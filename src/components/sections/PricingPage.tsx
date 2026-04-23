"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { useT } from "@/lib/i18n/context";
import { mapAuthError } from "@/lib/auth/client-errors";
import { mapBillingError, readBillingError } from "@/lib/billing/client-errors";
import type { PlanId } from "@/lib/plans";

type Billing = "monthly" | "yearly";

type CardPlan = {
  id: "free" | "premium" | "founding";
  planId?: Extract<PlanId, "premium_monthly" | "premium_yearly" | "founding_lifetime">;
  accent: string;
  name: string;
  priceMonthly: string;
  priceYearly: string;
  periodMonthly: string;
  periodYearly: string;
  badge?: string;
  items: { ok: boolean; text: string }[];
  cta: string;
  href?: string;
  featured?: boolean;
};

const PLAN_CARDS: CardPlan[] = [
  {
    id: "free",
    accent: "#22c55e",
    name: "Gratuito",
    priceMonthly: "R$0",
    priceYearly: "R$0",
    periodMonthly: "sempre",
    periodYearly: "sempre",
    items: [
      { ok: true, text: "3 blueprints gratuitos completos" },
      { ok: true, text: "Preview ao vivo do catálogo inteiro" },
      { ok: true, text: "Conceito de design + paleta + tipografia" },
      { ok: false, text: "Prompt universal mestre" },
      { ok: false, text: "Nota de personalização por nicho" },
    ],
    cta: "Começar grátis",
    href: "/blueprints",
  },
  {
    id: "premium",
    planId: "premium_monthly",
    accent: "#00d4ff",
    name: "Premium",
    priceMonthly: "R$29",
    priceYearly: "R$247",
    periodMonthly: "/mês",
    periodYearly: "/ano",
    badge: "Mais popular",
    featured: true,
    items: [
      { ok: true, text: "Todos os blueprints atuais e futuros" },
      { ok: true, text: "Prompt universal completo" },
      { ok: true, text: "Mapa de seções detalhado" },
      { ok: true, text: "Nota de personalização por nicho" },
      { ok: true, text: "Novos blueprints todo mês" },
      { ok: true, text: "Licença comercial inclusa" },
    ],
    cta: "Assinar agora",
  },
  {
    id: "founding",
    planId: "founding_lifetime",
    accent: "#a855f7",
    name: "Founding Lifetime",
    priceMonthly: "R$397",
    priceYearly: "R$397",
    periodMonthly: "único",
    periodYearly: "único",
    items: [
      { ok: true, text: "Tudo do Premium para sempre" },
      { ok: true, text: "Acesso vitalício sem mensalidade" },
      { ok: true, text: "Selo Founding Member no painel" },
      { ok: true, text: "Apenas 100 vagas totais" },
      { ok: true, text: "Prioridade em novos nichos" },
    ],
    cta: "Garantir vaga",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export function PricingPage() {
  const t = useT();
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const onSelect = async (card: CardPlan) => {
    if (card.id === "free") {
      router.push(card.href || "/blueprints");
      return;
    }
    if (!user) {
      router.push(`/criar-conta?from=${encodeURIComponent("/planos")}`);
      return;
    }
    const planId: PlanId =
      card.id === "founding"
        ? "founding_lifetime"
        : billing === "yearly"
          ? "premium_yearly"
          : "premium_monthly";

    setLoadingPlan(card.id);
    try {
      const token = await getIdToken();
      if (!token) {
        toast.error(mapBillingError({ code: "AUTH_REQUIRED" }));
        return;
      }
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan: planId }),
      });
      if (!res.ok) {
        const message = await readBillingError(res, "Não foi possível iniciar o checkout.");
        throw new Error(message);
      }
      const data = await res.json();
      if (!data.checkoutUrl) {
        throw new Error("Não foi possível iniciar o checkout.");
      }
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error(t(mapAuthError(error)));
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(0,212,255,0.15) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(168,85,247,0.12) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
          Planos WX Blueprints
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 font-[var(--font-oswald)] text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-tight"
        >
          Escolha seu acesso.
          <br />
          <em
            className="not-italic"
            style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", color: "#00d4ff" }}
          >
            Sem enrolação
          </em>{" "}
          e sem pegadinha.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/55"
        >
          3 blueprints gratuitos para testar. Premium para acesso total. Founding Lifetime para garantir
          acesso vitalício enquanto houver vagas.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1"
        >
          {(["monthly", "yearly"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setBilling(option)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                billing === option ? "bg-[#00d4ff] text-black" : "text-white/55 hover:text-white"
              }`}
            >
              {option === "monthly" ? "Mensal" : "Anual · economize 29%"}
            </button>
          ))}
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLAN_CARDS.map((card, i) => {
            const price = billing === "yearly" ? card.priceYearly : card.priceMonthly;
            const period = billing === "yearly" ? card.periodYearly : card.periodMonthly;
            return (
              <motion.article
                key={card.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative flex flex-col rounded-2xl border bg-[#111111] p-6"
                style={{
                  borderColor: card.featured ? `${card.accent}55` : "rgba(255,255,255,0.07)",
                  boxShadow: card.featured ? `0 0 50px -15px ${card.accent}40` : "none",
                }}
              >
                {card.badge && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                    style={{ borderColor: `${card.accent}55`, backgroundColor: "#080808", color: card.accent }}
                  >
                    {card.badge}
                  </span>
                )}

                <p
                  className="font-[var(--font-oswald)] text-sm font-medium uppercase tracking-[0.2em]"
                  style={{ color: card.accent }}
                >
                  {card.name}
                </p>

                <div className="mt-3 flex items-end gap-1">
                  <span className="font-[var(--font-oswald)] text-5xl font-bold">{price}</span>
                  <span className="mb-1.5 text-sm text-white/40">{period}</span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {card.items.map((item) => (
                    <li key={item.text} className="flex items-start gap-2 text-sm">
                      <span
                        className="shrink-0 pt-px"
                        style={{ color: item.ok ? "#22c55e" : "rgba(255,255,255,0.2)" }}
                      >
                        {item.ok ? "✓" : "✗"}
                      </span>
                      <span className={item.ok ? "text-white/65" : "text-white/22 line-through"}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onSelect(card)}
                  disabled={loadingPlan === card.id}
                  className="mt-6 rounded-xl px-5 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-60"
                  style={
                    card.featured
                      ? { backgroundColor: card.accent, color: "#000" }
                      : { border: "1px solid rgba(255,255,255,0.12)", color: "#f0f0f0" }
                  }
                >
                  {loadingPlan === card.id ? "Redirecionando…" : card.cta}
                </button>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Pagamento seguro pelo Asaas · Pix e cartão · Reembolso de 7 dias (CDC) · Sem fidelidade
        </p>

        <section className="mt-20 rounded-2xl border border-white/[0.07] bg-[#111111] p-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Founding Lifetime</p>
          <h2 className="mt-3 font-[var(--font-oswald)] text-3xl font-bold uppercase">
            100 vagas. Acesso vitalício. R$397 uma vez.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">
            Esse preço não volta. Depois das 100 vagas, a oferta sai e só restam os planos mensais ou anuais.
            Garanta agora acesso a todos os blueprints — presentes e futuros — sem mensalidade.
          </p>
          <Link
            href="#planos"
            className="mt-5 inline-block rounded-md border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/30"
          >
            Ver planos acima ↑
          </Link>
        </section>
      </div>
    </main>
  );
}
