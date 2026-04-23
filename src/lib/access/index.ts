import { PLANS, type PlanId } from "@/lib/plans";
import type { SubscriptionStatus, UserAccess, UserDocument } from "./types";

export const getAdminEmails = (): string[] =>
  (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAdminEmails().includes(normalized);
};

export const deriveUserAccess = (
  user: Pick<UserDocument, "plan" | "subscriptionStatus" | "planExpiresAt" | "email">,
): UserAccess => {
  if (isAdminEmail(user.email)) {
    return {
      tier: "premium",
      plan: "founding_lifetime",
      subscriptionStatus: "lifetime",
      canAccessPremium: true,
      planExpiresAt: undefined,
      isLifetime: true,
    };
  }

  const plan = user.plan || "free";
  const definition = PLANS[plan] || PLANS.free;
  const status: SubscriptionStatus = user.subscriptionStatus || "none";

  const isLifetime = plan === "founding_lifetime" && status === "lifetime";
  const hasActiveSubscription =
    definition.entitlementTier === "premium" &&
    (status === "active" || status === "lifetime") &&
    (!user.planExpiresAt ||
      status === "lifetime" ||
      new Date(user.planExpiresAt).getTime() > Date.now());

  return {
    tier: hasActiveSubscription ? "premium" : "free",
    plan,
    subscriptionStatus: status,
    canAccessPremium: hasActiveSubscription,
    planExpiresAt: user.planExpiresAt,
    isLifetime,
  };
};

export const buildEmptyUserDocument = (params: {
  uid: string;
  email: string;
  name?: string;
  locale?: "pt-BR" | "en";
}): UserDocument => {
  const now = new Date().toISOString();
  const admin = isAdminEmail(params.email);
  return {
    uid: params.uid,
    email: params.email,
    name: params.name,
    plan: admin ? "founding_lifetime" : "free",
    subscriptionStatus: admin ? "lifetime" : "none",
    planActivatedAt: admin ? now : undefined,
    locale: params.locale || "pt-BR",
    createdAt: now,
    updatedAt: now,
    billing: admin
      ? {
          subscriptionPlan: "founding_lifetime",
          lifetimePurchasedAt: now,
        }
      : undefined,
  };
};

export const isActivePlan = (plan: PlanId, status: SubscriptionStatus): boolean => {
  if (plan === "free") return false;
  if (plan === "founding_lifetime") return status === "lifetime" || status === "active";
  return status === "active";
};
