export type PlanId = "free" | "premium_monthly" | "premium_yearly" | "founding_lifetime";

export type PlanKind = "free" | "subscription" | "lifetime";

export interface PlanDefinition {
  id: PlanId;
  kind: PlanKind;
  label: string;
  price: number;
  currency: "BRL";
  cycle: "MONTHLY" | "YEARLY" | "ONE_TIME" | "NONE";
  description: string;
  entitlementTier: "free" | "premium";
}

export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    kind: "free",
    label: "Gratuito",
    price: 0,
    currency: "BRL",
    cycle: "NONE",
    description: "Acesso aos 3 blueprints gratuitos.",
    entitlementTier: "free",
  },
  premium_monthly: {
    id: "premium_monthly",
    kind: "subscription",
    label: "Premium Mensal",
    price: 29,
    currency: "BRL",
    cycle: "MONTHLY",
    description: "Acesso a todos os blueprints — assinatura mensal.",
    entitlementTier: "premium",
  },
  premium_yearly: {
    id: "premium_yearly",
    kind: "subscription",
    label: "Premium Anual",
    price: 247,
    currency: "BRL",
    cycle: "YEARLY",
    description: "Acesso a todos os blueprints — assinatura anual.",
    entitlementTier: "premium",
  },
  founding_lifetime: {
    id: "founding_lifetime",
    kind: "lifetime",
    label: "Founding Lifetime",
    price: 397,
    currency: "BRL",
    cycle: "ONE_TIME",
    description: "Acesso vitalício — 100 vagas exclusivas de lançamento.",
    entitlementTier: "premium",
  },
};

export const FOUNDING_TOTAL_SEATS = 100;

export const PLAN_IDS = Object.keys(PLANS) as PlanId[];

export const isPaidPlan = (planId: PlanId): boolean =>
  PLANS[planId].entitlementTier === "premium";

export const inferPlanFromValue = (value: number): PlanId | null => {
  const rounded = Math.round(Number(value) || 0);
  for (const plan of Object.values(PLANS)) {
    if (Math.round(plan.price) === rounded) return plan.id;
  }
  return null;
};
