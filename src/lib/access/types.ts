import type { PlanId } from "@/lib/plans";

export type SubscriptionStatus =
  | "none"
  | "pending"
  | "active"
  | "overdue"
  | "blocked"
  | "canceled"
  | "expired"
  | "lifetime";

export interface UserBilling {
  asaasCustomerId?: string;
  asaasSubscriptionId?: string;
  asaasSubscriptionStatus?: string;
  subscriptionPlan?: PlanId;
  subscriptionValue?: number;
  nextSubscriptionDueDate?: string;
  pendingCheckoutId?: string;
  pendingCheckoutPlan?: PlanId;
  pendingCheckoutUrl?: string;
  pendingCheckoutCreatedAt?: string;
  lastEventId?: string;
  lastPaymentId?: string;
  lastPaymentEvent?: string;
  lastPaymentAt?: string;
  lastPaymentDueDate?: string;
  lastCheckoutStatus?: string;
  lastCheckoutPaidAt?: string;
  lastActivatedPaymentId?: string;
  lifetimePurchasedAt?: string;
  foundingSeatNumber?: number;
}

export interface UserDocument {
  uid: string;
  email: string;
  name?: string;
  cpf?: string;
  phone?: string;
  plan: PlanId;
  planActivatedAt?: string;
  planExpiresAt?: string;
  subscriptionStatus: SubscriptionStatus;
  billing?: UserBilling;
  locale?: "pt-BR" | "en";
  createdAt: string;
  updatedAt: string;
}

export interface UserAccess {
  tier: "free" | "premium";
  plan: PlanId;
  subscriptionStatus: SubscriptionStatus;
  canAccessPremium: boolean;
  planExpiresAt?: string;
  isLifetime: boolean;
}
