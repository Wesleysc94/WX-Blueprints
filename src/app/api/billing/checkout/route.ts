import { z } from "zod";
import { requireAuth } from "@/lib/firebase/auth-server";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { ensureUserDocument } from "@/lib/access/server";
import {
  createOneTimeCheckout,
  createSubscriptionCheckout,
  ensureAsaasCustomer,
  getAsaasCheckoutHost,
  getBaseAppUrl,
} from "@/lib/asaas/client";
import { FOUNDING_TOTAL_SEATS, PLANS, type PlanId } from "@/lib/plans";
import { AppError, toApiErrorPayload } from "@/lib/utils/errors";
import { normalizeCpf, normalizePhone } from "@/lib/utils/normalizers";
import { getClientKey, rateLimit } from "@/lib/utils/rate-limit";
import type { UserDocument } from "@/lib/access/types";

const bodySchema = z.object({
  plan: z.enum(["premium_monthly", "premium_yearly", "founding_lifetime"]),
  name: z.string().trim().min(2).max(120).optional(),
  cpf: z.string().trim().optional(),
  phone: z.string().trim().optional(),
});

const isPendingCheckoutValid = (user: UserDocument, plan: PlanId): boolean => {
  const billing = user.billing;
  if (!billing?.pendingCheckoutId || !billing.pendingCheckoutUrl) return false;
  if (billing.pendingCheckoutPlan !== plan) return false;
  if (!billing.pendingCheckoutCreatedAt) return false;
  const created = new Date(billing.pendingCheckoutCreatedAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 60 * 60 * 1000;
};

export const POST = async (request: Request): Promise<Response> => {
  try {
    rateLimit({ key: getClientKey(request, "checkout"), limit: 6, windowMs: 60_000 });

    if (!hasFirebaseAdminConfig()) {
      throw new AppError(
        "Firebase Admin não configurado.",
        "FIREBASE_ADMIN_NOT_CONFIGURED",
        503,
      );
    }

    const auth = await requireAuth(request);
    const raw = await request.json().catch(() => ({}));
    const { plan, name, cpf, phone } = bodySchema.parse(raw);

    const definition = PLANS[plan];
    if (!definition || definition.entitlementTier !== "premium") {
      throw new AppError("Plano inválido.", "PLAN_INVALID", 400);
    }

    const db = getAdminDb();
    const userRef = db.collection("users").doc(auth.uid);
    const user = await ensureUserDocument({
      uid: auth.uid,
      email: auth.email,
      name: name || auth.name,
    });

    if (plan === "founding_lifetime") {
      const seatsSnap = await db.collection("foundingSeats").doc("singleton").get();
      const seatsTaken = seatsSnap.exists ? Number(seatsSnap.data()?.seatsTaken) || 0 : 0;
      if (seatsTaken >= FOUNDING_TOTAL_SEATS) {
        throw new AppError(
          "As 100 vagas founding lifetime já foram preenchidas.",
          "LIFETIME_SOLD_OUT",
          409,
        );
      }
    }

    if (isPendingCheckoutValid(user, plan)) {
      return Response.json({
        checkoutId: user.billing!.pendingCheckoutId,
        checkoutUrl: user.billing!.pendingCheckoutUrl,
        reused: true,
      });
    }

    const cpfNormalized = normalizeCpf(cpf || user.cpf || "");
    const phoneNormalized = normalizePhone(phone || user.phone || "");
    const displayName = (name || user.name || auth.name || auth.email.split("@")[0] || "Cliente WX").trim();

    const customer = await ensureAsaasCustomer({
      customerId: user.billing?.asaasCustomerId,
      name: displayName,
      email: auth.email,
      cpf: cpfNormalized || undefined,
      phone: phoneNormalized || undefined,
    });

    const baseAppUrl =
      getBaseAppUrl(request) ||
      request.headers.get("origin") ||
      "http://localhost:3000";
    const callbacks = {
      successUrl: `${baseAppUrl}/painel?checkout=success&plan=${plan}`,
      cancelUrl: `${baseAppUrl}/planos?checkout=cancel&plan=${plan}`,
      expiredUrl: `${baseAppUrl}/planos?checkout=expired&plan=${plan}`,
    };

    const description =
      plan === "founding_lifetime"
        ? "WX Blueprints — Acesso vitalício Founding"
        : plan === "premium_yearly"
          ? "WX Blueprints — Premium anual"
          : "WX Blueprints — Premium mensal";

    const checkout =
      plan === "founding_lifetime"
        ? await createOneTimeCheckout({
            customerId: customer.id,
            value: definition.price,
            description,
            callbacks,
            externalReference: `${auth.uid}:${plan}`,
          })
        : await createSubscriptionCheckout({
            customerId: customer.id,
            value: definition.price,
            cycle: plan === "premium_yearly" ? "YEARLY" : "MONTHLY",
            description,
            callbacks,
            externalReference: `${auth.uid}:${plan}`,
          });

    const checkoutUrl = checkout.url || `${getAsaasCheckoutHost()}?id=${checkout.id}`;
    const nowIso = new Date().toISOString();

    await userRef.set(
      {
        name: user.name || displayName,
        cpf: cpfNormalized || user.cpf || "",
        phone: phoneNormalized || user.phone || "",
        subscriptionStatus: user.subscriptionStatus === "lifetime" ? "lifetime" : "pending",
        updatedAt: nowIso,
        billing: {
          ...(user.billing || {}),
          asaasCustomerId: customer.id,
          subscriptionPlan: plan,
          pendingCheckoutId: checkout.id,
          pendingCheckoutPlan: plan,
          pendingCheckoutCreatedAt: nowIso,
          pendingCheckoutUrl: checkoutUrl,
          lastCheckoutStatus: checkout.status || "ACTIVE",
        },
      },
      { merge: true },
    );

    return Response.json({
      checkoutId: checkout.id,
      checkoutUrl,
      reused: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: error.issues[0]?.message || "Dados inválidos.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }
    const { status, body } = toApiErrorPayload(error);
    return Response.json(body, { status });
  }
};
