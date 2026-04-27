import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { getAsaasWebhookToken, getBaseAppUrl } from "@/lib/asaas/client";
import {
  CHECKOUT_EVENTS,
  PAYMENT_ACTIVATION_EVENTS,
  PAYMENT_CANCEL_EVENTS,
  PAYMENT_HARD_BLOCK_EVENTS,
  PAYMENT_RECORD_EVENTS,
  PAYMENT_SOFT_BLOCK_EVENTS,
  SUBSCRIPTION_EVENTS,
  type AsaasWebhookEvent,
} from "@/lib/asaas/events";
import type {
  AsaasCheckoutSession,
  AsaasPayment,
  AsaasSubscription,
  AsaasWebhookPayload,
} from "@/lib/asaas/types";
import type { UserDocument } from "@/lib/access/types";
import { FOUNDING_TOTAL_SEATS, PLANS, inferPlanFromValue, type PlanId } from "@/lib/plans";
import { AppError } from "@/lib/utils/errors";
import { getAdminNotifyAddress, sendTransactionalEmail } from "@/lib/email/client";
import {
  AdminPaymentNotifyEmail,
  FoundingWelcomeEmail,
  PaymentConfirmedEmail,
  PaymentOverdueEmail,
  SubscriptionCanceledEmail,
} from "@/lib/email/templates";

const safeDocId = (value: string): string => String(value).replaceAll("/", "_");

const ensureWebhookToken = (request: Request) => {
  const expected = getAsaasWebhookToken();
  if (!expected) {
    throw new AppError("ASAAS_WEBHOOK_TOKEN não configurado.", "WEBHOOK_NOT_CONFIGURED", 503);
  }
  const received = request.headers.get("asaas-access-token");
  if (!received || received.trim() !== expected) {
    throw new AppError("Unauthorized", "UNAUTHORIZED", 401);
  }
};

const getPaymentCustomerId = (p?: AsaasPayment): string =>
  typeof p?.customer === "string" ? p.customer : p?.customer?.id || "";

const getPaymentSubscriptionId = (p?: AsaasPayment): string => {
  if (typeof p?.subscription === "string") return p.subscription;
  if (p?.subscription && typeof p.subscription === "object") return p.subscription.id;
  return "";
};

const getSubscriptionCustomerId = (s?: AsaasSubscription): string =>
  typeof s?.customer === "string" ? s.customer : s?.customer?.id || "";

const parseExternalReference = (ref?: string): { uid: string; plan: PlanId } | null => {
  if (!ref || !ref.includes(":")) return null;
  const [uid, plan] = ref.split(":");
  if (!uid || !plan) return null;
  if (!(plan in PLANS)) return null;
  return { uid, plan: plan as PlanId };
};

const findUserByField = async (
  db: Firestore,
  field: string,
  value: string,
): Promise<{ uid: string; user: UserDocument } | null> => {
  if (!value) return null;
  const snap = await db.collection("users").where(field, "==", value).limit(1).get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { uid: doc.id, user: doc.data() as UserDocument };
};

const findUserForPayment = async (db: Firestore, payment?: AsaasPayment) => {
  const subscriptionId = getPaymentSubscriptionId(payment);
  const customerId = getPaymentCustomerId(payment);
  return (
    (await findUserByField(db, "billing.asaasSubscriptionId", subscriptionId)) ||
    (await findUserByField(db, "billing.asaasCustomerId", customerId))
  );
};

const findUserForSubscription = async (db: Firestore, subscription?: AsaasSubscription) => {
  const subscriptionId = subscription?.id || "";
  const customerId = getSubscriptionCustomerId(subscription);
  return (
    (await findUserByField(db, "billing.asaasSubscriptionId", subscriptionId)) ||
    (await findUserByField(db, "billing.asaasCustomerId", customerId))
  );
};

const findUserForCheckout = async (db: Firestore, checkout?: AsaasCheckoutSession) => {
  if (!checkout?.id) return null;
  return findUserByField(db, "billing.pendingCheckoutId", checkout.id);
};

const clearPendingCheckout = (billing: UserDocument["billing"] = {}) => ({
  ...billing,
  pendingCheckoutId: "",
  pendingCheckoutPlan: undefined,
  pendingCheckoutCreatedAt: "",
  pendingCheckoutUrl: "",
});

const resolvePlan = (user: UserDocument, amount: number | undefined, fallback?: PlanId): PlanId => {
  const stored =
    user.billing?.subscriptionPlan ||
    user.billing?.pendingCheckoutPlan ||
    (user.plan !== "free" ? user.plan : undefined);
  if (amount !== undefined) {
    const inferred = inferPlanFromValue(amount);
    if (inferred) return inferred;
  }
  return stored || fallback || "premium_monthly";
};

const addCycle = (date: Date, plan: PlanId): Date => {
  const next = new Date(date);
  if (plan === "premium_yearly") next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next;
};

const assignFoundingSeat = async (
  db: Firestore,
  uid: string,
): Promise<{ seat: number; remaining: number }> => {
  const ref = db.collection("foundingSeats").doc("singleton");
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? (snap.data() as { seatsTaken?: number; totalSeats?: number }) : {};
    const total = data.totalSeats || FOUNDING_TOTAL_SEATS;
    const taken = data.seatsTaken || 0;
    if (taken >= total) {
      throw new AppError("As 100 vagas founding lifetime já foram preenchidas.", "LIFETIME_SOLD_OUT", 409);
    }
    const seat = taken + 1;
    tx.set(
      ref,
      {
        totalSeats: total,
        seatsTaken: seat,
        seatsRemaining: total - seat,
        lastAssignedAt: new Date().toISOString(),
        lastAssignedUserId: uid,
      },
      { merge: true },
    );
    return { seat, remaining: total - seat };
  });
};

const updatePaymentRecord = async (
  db: Firestore,
  payment: AsaasPayment | undefined,
  extra: Record<string, unknown>,
) => {
  if (!payment?.id) return null;
  const ref = db.collection("asaasPayments").doc(safeDocId(payment.id));
  const snap = await ref.get();
  const current = (snap.exists ? snap.data() : {}) as Record<string, unknown>;
  await ref.set(
    {
      ...current,
      paymentId: payment.id,
      subscriptionId: getPaymentSubscriptionId(payment),
      customerId: getPaymentCustomerId(payment),
      value: Number(payment.value) || 0,
      dueDate: payment.dueDate || "",
      updatedAt: new Date().toISOString(),
      ...extra,
    },
    { merge: true },
  );
  return current;
};

const handleCheckoutEvent = async (db: Firestore, event: AsaasWebhookPayload) => {
  const checkout = event.checkout;
  const located = await findUserForCheckout(db, checkout);
  if (!located) return { ignored: true, reason: "checkout_not_found" };

  const { uid, user } = located;
  const nowIso = new Date().toISOString();
  const pendingPlan =
    user.billing?.pendingCheckoutPlan || user.billing?.subscriptionPlan || "premium_monthly";
  const customerId = typeof checkout?.customer === "string" ? checkout.customer : "";
  const baseBilling = {
    ...(user.billing || {}),
    asaasCustomerId: customerId || user.billing?.asaasCustomerId,
    lastEventId: event.id,
    lastCheckoutStatus: checkout?.status || event.event,
  };

  if (event.event === "CHECKOUT_CREATED") {
    await db.collection("users").doc(uid).set(
      { updatedAt: nowIso, billing: baseBilling },
      { merge: true },
    );
    return { uid, status: checkout?.status || "ACTIVE" };
  }

  if (event.event === "CHECKOUT_PAID") {
    await db.collection("users").doc(uid).set(
      {
        subscriptionStatus: user.subscriptionStatus === "lifetime" ? "lifetime" : "pending",
        updatedAt: nowIso,
        billing: {
          ...clearPendingCheckout(baseBilling),
          subscriptionPlan: pendingPlan,
          lastCheckoutPaidAt: nowIso,
        },
      },
      { merge: true },
    );
    return { uid, status: "paid_waiting_payment_event", plan: pendingPlan };
  }

  if (event.event === "CHECKOUT_CANCELED" || event.event === "CHECKOUT_EXPIRED") {
    await db.collection("users").doc(uid).set(
      {
        subscriptionStatus:
          user.subscriptionStatus === "lifetime" ? "lifetime" : user.subscriptionStatus || "none",
        updatedAt: nowIso,
        billing: clearPendingCheckout(baseBilling),
      },
      { merge: true },
    );
    return { uid, status: event.event };
  }

  return { uid, status: event.event };
};

const fireNotification = async (args: {
  uid: string;
  email: string;
  name: string;
  planLabel: string;
  appUrl: string;
  kind: "activated" | "lifetime" | "overdue" | "canceled";
  seatNumber?: number;
  expiresAt?: string;
  dueDate?: string;
  checkoutUrl?: string;
  eventType: string;
  value?: number;
}) => {
  const { email, name, planLabel, appUrl, kind } = args;
  if (email) {
    if (kind === "activated") {
      await sendTransactionalEmail({
        to: email,
        subject: "Pagamento confirmado — acesso liberado",
        template: PaymentConfirmedEmail({ name, planLabel, expiresAt: args.expiresAt, appUrl }),
        tags: [{ name: "type", value: "payment_confirmed" }],
      });
    } else if (kind === "lifetime") {
      await sendTransactionalEmail({
        to: email,
        subject: `Founding Member #${args.seatNumber ?? ""} — acesso vitalício`,
        template: FoundingWelcomeEmail({ name, seatNumber: args.seatNumber, appUrl }),
        tags: [{ name: "type", value: "founding_welcome" }],
      });
    } else if (kind === "overdue") {
      await sendTransactionalEmail({
        to: email,
        subject: "Pagamento em atraso — regularize seu acesso",
        template: PaymentOverdueEmail({ name, dueDate: args.dueDate, checkoutUrl: args.checkoutUrl }),
        tags: [{ name: "type", value: "payment_overdue" }],
      });
    } else if (kind === "canceled") {
      await sendTransactionalEmail({
        to: email,
        subject: "Assinatura cancelada",
        template: SubscriptionCanceledEmail({ name, appUrl }),
        tags: [{ name: "type", value: "subscription_canceled" }],
      });
    }
  }

  await sendTransactionalEmail({
    to: getAdminNotifyAddress(),
    subject: `[WX] ${args.eventType} — ${email}`,
    template: AdminPaymentNotifyEmail({
      uid: args.uid,
      email,
      planLabel,
      eventType: args.eventType,
      value: args.value,
    }),
    tags: [{ name: "type", value: "admin_notification" }],
  });
};

const handlePaymentActivation = async (
  db: Firestore,
  uid: string,
  user: UserDocument,
  event: AsaasWebhookPayload,
  payment: AsaasPayment,
  appUrl: string,
) => {
  const paymentId = payment.id;
  const customerId = getPaymentCustomerId(payment);
  const subscriptionId = getPaymentSubscriptionId(payment);
  const now = new Date();
  const nowIso = now.toISOString();

  const reference = parseExternalReference((payment as AsaasPayment & { externalReference?: string }).externalReference);
  const plan = reference?.plan || resolvePlan(user, payment.value);
  const isLifetime = plan === "founding_lifetime";

  const paymentRecord = (await updatePaymentRecord(db, payment, {
    lastEvent: event.event,
    lastEventId: event.id,
    status: payment.status || "",
    plan,
    userId: uid,
  })) as { accessAppliedAt?: string } | null;

  const alreadyApplied = Boolean(paymentRecord?.accessAppliedAt);
  if (alreadyApplied) {
    return { uid, paymentId, plan, status: "already_applied" };
  }

  const userRef = db.collection("users").doc(uid);
  let lifetimeSeatNumber: number | undefined;

  if (isLifetime) {
    const alreadyLifetime =
      user.plan === "founding_lifetime" && user.subscriptionStatus === "lifetime";
    let seatNumber = user.billing?.foundingSeatNumber;
    if (!alreadyLifetime) {
      const assigned = await assignFoundingSeat(db, uid);
      seatNumber = assigned.seat;
    }
    lifetimeSeatNumber = seatNumber;
    await userRef.set(
      {
        plan: "founding_lifetime",
        planActivatedAt: user.planActivatedAt || nowIso,
        planExpiresAt: FieldValue.delete(),
        subscriptionStatus: "lifetime",
        updatedAt: nowIso,
        billing: {
          ...clearPendingCheckout(user.billing || {}),
          asaasCustomerId: customerId || user.billing?.asaasCustomerId,
          subscriptionPlan: "founding_lifetime",
          subscriptionValue: PLANS.founding_lifetime.price,
          lastEventId: event.id,
          lastPaymentId: paymentId,
          lastPaymentEvent: event.event,
          lastPaymentAt: nowIso,
          lastPaymentDueDate: payment.dueDate || "",
          lastActivatedPaymentId: paymentId,
          lifetimePurchasedAt: user.billing?.lifetimePurchasedAt || nowIso,
          foundingSeatNumber: seatNumber,
        },
      },
      { merge: true },
    );
  } else {
    const currentExpiry = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
    const base = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now;
    const nextExpiry = addCycle(base, plan).toISOString();

    await userRef.set(
      {
        plan,
        planActivatedAt: user.planActivatedAt || nowIso,
        planExpiresAt: nextExpiry,
        subscriptionStatus: "active",
        updatedAt: nowIso,
        billing: {
          ...clearPendingCheckout(user.billing || {}),
          asaasCustomerId: customerId || user.billing?.asaasCustomerId,
          asaasSubscriptionId: subscriptionId || user.billing?.asaasSubscriptionId,
          asaasSubscriptionStatus: user.billing?.asaasSubscriptionStatus || "ACTIVE",
          subscriptionPlan: plan,
          subscriptionValue: Number(payment.value) || PLANS[plan].price,
          lastEventId: event.id,
          lastPaymentId: paymentId,
          lastPaymentEvent: event.event,
          lastPaymentAt: nowIso,
          lastPaymentDueDate: payment.dueDate || "",
          lastActivatedPaymentId: paymentId,
        },
      },
      { merge: true },
    );

    await updatePaymentRecord(db, payment, {
      accessAppliedAt: nowIso,
      accessPlan: plan,
      appliedByEvent: event.event,
      appliedEventId: event.id,
      appliedUntil: nextExpiry,
    });

    await fireNotification({
      uid,
      email: user.email,
      name: user.name || user.email.split("@")[0] || "Membro",
      planLabel: PLANS[plan].label,
      appUrl,
      kind: "activated",
      expiresAt: nextExpiry,
      eventType: event.event,
      value: Number(payment.value) || undefined,
    });

    return { uid, paymentId, plan, status: "active", expiresAt: nextExpiry };
  }

  await updatePaymentRecord(db, payment, {
    accessAppliedAt: nowIso,
    accessPlan: plan,
    appliedByEvent: event.event,
    appliedEventId: event.id,
  });

  await fireNotification({
    uid,
    email: user.email,
    name: user.name || user.email.split("@")[0] || "Membro",
    planLabel: PLANS.founding_lifetime.label,
    appUrl,
    kind: "lifetime",
    seatNumber: lifetimeSeatNumber,
    eventType: event.event,
    value: Number(payment.value) || undefined,
  });
  return { uid, paymentId, plan, status: "lifetime", seatNumber: lifetimeSeatNumber };
};

const handlePaymentEvent = async (db: Firestore, event: AsaasWebhookPayload, appUrl: string) => {
  const payment = event.payment;
  if (!payment) return { ignored: true, reason: "missing_payment" };
  const paymentId = payment.id;

  await updatePaymentRecord(db, payment, {
    lastEvent: event.event,
    lastEventId: event.id,
    status: payment.status || "",
  });

  const located = await findUserForPayment(db, payment);
  if (!located) return { ignored: true, reason: "payment_user_not_found", paymentId };

  const { uid, user } = located;
  const nowIso = new Date().toISOString();
  const plan = resolvePlan(user, payment.value);
  const customerId = getPaymentCustomerId(payment);
  const subscriptionId = getPaymentSubscriptionId(payment);
  const userRef = db.collection("users").doc(uid);
  const displayName = user.name || user.email.split("@")[0] || "Membro";

  const baseBillingPatch = {
    ...(user.billing || {}),
    asaasCustomerId: customerId || user.billing?.asaasCustomerId,
    asaasSubscriptionId: subscriptionId || user.billing?.asaasSubscriptionId,
    subscriptionPlan: plan,
    lastEventId: event.id,
    lastPaymentId: paymentId,
    lastPaymentEvent: event.event,
    lastPaymentDueDate: payment.dueDate || "",
  };

  if (event.event === "PAYMENT_CREATED" || event.event === "PAYMENT_UPDATED") {
    await userRef.set({ updatedAt: nowIso, billing: baseBillingPatch }, { merge: true });
    return { uid, paymentId, status: event.event.toLowerCase() };
  }

  if (PAYMENT_ACTIVATION_EVENTS.has(event.event)) {
    return handlePaymentActivation(db, uid, user, event, payment, appUrl);
  }

  if (PAYMENT_SOFT_BLOCK_EVENTS.has(event.event)) {
    await userRef.set(
      { subscriptionStatus: "overdue", updatedAt: nowIso, billing: baseBillingPatch },
      { merge: true },
    );
    await fireNotification({
      uid,
      email: user.email,
      name: displayName,
      planLabel: PLANS[plan].label,
      appUrl,
      kind: "overdue",
      dueDate: payment.dueDate,
      checkoutUrl: user.billing?.pendingCheckoutUrl,
      eventType: event.event,
      value: Number(payment.value) || undefined,
    });
    return { uid, paymentId, status: "overdue" };
  }

  if (PAYMENT_HARD_BLOCK_EVENTS.has(event.event)) {
    await userRef.set(
      {
        subscriptionStatus: "blocked",
        planExpiresAt: nowIso,
        updatedAt: nowIso,
        billing: baseBillingPatch,
      },
      { merge: true },
    );
    return { uid, paymentId, status: "blocked" };
  }

  if (PAYMENT_CANCEL_EVENTS.has(event.event)) {
    await userRef.set(
      {
        subscriptionStatus: "canceled",
        planExpiresAt: nowIso,
        updatedAt: nowIso,
        billing: baseBillingPatch,
      },
      { merge: true },
    );
    await fireNotification({
      uid,
      email: user.email,
      name: displayName,
      planLabel: PLANS[plan].label,
      appUrl,
      kind: "canceled",
      eventType: event.event,
      value: Number(payment.value) || undefined,
    });
    return { uid, paymentId, status: "canceled" };
  }

  return { ignored: true, reason: "payment_event_ignored", paymentId };
};

const handleSubscriptionEvent = async (db: Firestore, event: AsaasWebhookPayload, appUrl: string) => {
  const subscription = event.subscription;
  if (!subscription) return { ignored: true, reason: "missing_subscription" };

  const located = await findUserForSubscription(db, subscription);
  if (!located) return { ignored: true, reason: "subscription_not_found" };

  const { uid, user } = located;
  const nowIso = new Date().toISOString();
  const subscriptionId = subscription.id;
  const customerId = getSubscriptionCustomerId(subscription);
  const plan = resolvePlan(user, subscription.value);
  const displayName = user.name || user.email.split("@")[0] || "Membro";
  const billingPatch = {
    ...(user.billing || {}),
    asaasCustomerId: customerId || user.billing?.asaasCustomerId,
    asaasSubscriptionId: subscriptionId || user.billing?.asaasSubscriptionId,
    asaasSubscriptionStatus: subscription.status || user.billing?.asaasSubscriptionStatus,
    subscriptionPlan: plan,
    subscriptionValue: Number(subscription.value) || PLANS[plan].price,
    nextSubscriptionDueDate: subscription.nextDueDate || "",
    lastEventId: event.id,
  };

  const userRef = db.collection("users").doc(uid);

  if (event.event === "SUBSCRIPTION_CREATED" || event.event === "SUBSCRIPTION_UPDATED") {
    await userRef.set({ updatedAt: nowIso, billing: billingPatch }, { merge: true });
    return { uid, subscriptionId, status: subscription.status || event.event };
  }

  if (event.event === "SUBSCRIPTION_INACTIVATED" || event.event === "SUBSCRIPTION_DELETED") {
    const wasLifetime = user.subscriptionStatus === "lifetime";
    await userRef.set(
      {
        subscriptionStatus: wasLifetime ? "lifetime" : "canceled",
        updatedAt: nowIso,
        billing: { ...billingPatch, asaasSubscriptionStatus: "INACTIVE" },
      },
      { merge: true },
    );
    if (!wasLifetime) {
      await fireNotification({
        uid,
        email: user.email,
        name: displayName,
        planLabel: PLANS[plan].label,
        appUrl,
        kind: "canceled",
        eventType: event.event,
        value: Number(subscription.value) || undefined,
      });
    }
    return { uid, subscriptionId, status: "canceled" };
  }

  if (event.event === "SUBSCRIPTION_SPLIT_DIVERGENCE_BLOCK") {
    await userRef.set(
      { subscriptionStatus: "blocked", updatedAt: nowIso, billing: billingPatch },
      { merge: true },
    );
    return { uid, subscriptionId, status: "blocked" };
  }

  if (event.event === "SUBSCRIPTION_SPLIT_DIVERGENCE_BLOCK_FINISHED") {
    await userRef.set(
      { subscriptionStatus: "active", updatedAt: nowIso, billing: billingPatch },
      { merge: true },
    );
    return { uid, subscriptionId, status: "active" };
  }

  return { ignored: true, reason: "subscription_event_ignored" };
};

const markEventProcessed = async (
  db: Firestore,
  eventId: string,
  event: AsaasWebhookPayload,
  result: unknown,
) => {
  await db.collection("asaasEvents").doc(safeDocId(eventId)).set({
    eventId,
    event: event.event,
    processedAt: new Date().toISOString(),
    result: result as Record<string, unknown>,
    raw: event as unknown as Record<string, unknown>,
  });
};

// Asaas valida a URL do webhook fazendo GET/HEAD na hora do cadastro.
// Retornamos 200 OK aqui pra passar a validação. POST continua sendo o handler real.
export const GET = async (): Promise<Response> =>
  Response.json({ ok: true, endpoint: "asaas-webhook", method: "POST" });

export const HEAD = async (): Promise<Response> =>
  new Response(null, { status: 200 });

export const POST = async (request: Request): Promise<Response> => {
  try {
    ensureWebhookToken(request);

    if (!hasFirebaseAdminConfig()) {
      throw new AppError(
        "O webhook do Asaas precisa da credencial FIREBASE_SERVICE_ACCOUNT.",
        "FIREBASE_ADMIN_NOT_CONFIGURED",
        503,
      );
    }

    const event = (await request.json()) as AsaasWebhookPayload;
    const eventId = event.id || `${event.event || "unknown"}-${Date.now()}`;
    const db = getAdminDb();

    const eventRef = db.collection("asaasEvents").doc(safeDocId(eventId));
    const existing = await eventRef.get();
    if (existing.exists) {
      return Response.json({ success: true, duplicate: true });
    }

    let result: unknown = { ignored: true };
    const name = event.event as AsaasWebhookEvent;
    const appUrl = getBaseAppUrl(request) || "https://blueprints.wxdigitalstudio.com.br";

    if (CHECKOUT_EVENTS.has(name)) {
      result = await handleCheckoutEvent(db, event);
    } else if (PAYMENT_RECORD_EVENTS.has(name)) {
      result = await handlePaymentEvent(db, event, appUrl);
    } else if (SUBSCRIPTION_EVENTS.has(name)) {
      result = await handleSubscriptionEvent(db, event, appUrl);
    }

    await markEventProcessed(db, eventId, event, result);
    return Response.json({ success: true, result });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Erro ao processar webhook.";
    return Response.json({ error: message }, { status: statusCode });
  }
};
