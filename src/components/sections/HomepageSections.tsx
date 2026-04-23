"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { templates } from "@/data/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";

function HeroBackdrop() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 25% 30%, rgba(0,212,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(201,168,76,0.12) 0%, transparent 55%), #080808",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#080808] to-transparent" />
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute left-1/4 top-0 h-full w-px bg-white/[0.035]" />
        <div className="absolute left-2/4 top-0 h-full w-px bg-white/[0.035]" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-white/[0.035]" />
      </div>
    </>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#080808]">
      <HeroBackdrop />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pb-32 pt-36">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
          Blueprints para AI Coding
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-[var(--font-oswald)] text-[clamp(3.2rem,7.5vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-tight"
        >
          Sites premium.
          <br />
          <em
            className="not-italic"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontStyle: "italic",
              color: "#00d4ff",
            }}
          >
            Blueprints
          </em>{" "}
          prontos.
          <br />
          Recrie com IA.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-7 max-w-[500px] text-[1.05rem] leading-relaxed text-white/55"
        >
          Cada blueprint é um projeto real publicado — com tudo que você precisa
          para recriar usando Lovable, Bolt ou Cursor em minutos.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-9 flex flex-wrap gap-3.5"
        >
          <Link
            href="/blueprints"
            className="rounded-md bg-[#00d4ff] px-7 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver blueprints gratuitos →
          </Link>
          <Link
            href="/como-funciona"
            className="rounded-md border border-white/14 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-white/25"
          >
            Como funciona
          </Link>
        </motion.div>

        <motion.p
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-7 text-[11px] uppercase tracking-[0.2em] text-white/30"
        >
          3 blueprints gratuitos · Lovable · Bolt · Cursor · Claude
        </motion.p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
          scroll
        </p>
        <div className="mx-auto mt-2 h-10 w-px overflow-hidden bg-white/10">
          <div className="animate-scroll-down mx-auto h-4 w-px bg-white/50" />
        </div>
      </div>
    </section>
  );
}

const TOOLS = ["Lovable", "Bolt", "Cursor", "Claude", "v0", "Windsurf"];

export function ProofStrip() {
  return (
    <section className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#111111] px-5 py-4">
      <span className="text-[10px] uppercase tracking-[0.22em] text-white/30">
        Compatível com
      </span>
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-white/[0.07] bg-[#1a1a1a] px-3 py-1 text-xs font-medium text-white/50"
          >
            {tool}
          </span>
        ))}
      </div>
    </section>
  );
}

const VALUE_ITEMS = [
  {
    n: "01",
    title: "Sites reais, não mockups",
    copy: "Cada blueprint é baseado em um projeto publicado, deployado e funcionando em produção.",
  },
  {
    n: "02",
    title: "Prompt pronto para colar",
    copy: "Copie o prompt completo e cole diretamente na ferramenta de AI coding que você já usa.",
  },
  {
    n: "03",
    title: "Do prompt ao site em minutos",
    copy: "Sem começar do zero. Sem gastar horas em CSS. Direto ao resultado premium.",
  },
];

export function ValueProps() {
  return (
    <section className="mt-20">
      <div className="grid gap-4 md:grid-cols-3">
        {VALUE_ITEMS.map((item, i) => (
          <motion.article
            key={item.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-6 transition-colors hover:border-white/[0.12]"
          >
            <p
              className="font-[var(--font-oswald)] text-5xl font-bold"
              style={{ color: "rgba(255,255,255,0.06)" }}
            >
              {item.n}
            </p>
            <h3 className="mt-4 font-[var(--font-oswald)] text-[1.15rem] font-semibold uppercase tracking-wide">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {item.copy}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function FreeTemplatesGallery() {
  const freeTemplates = templates.filter((t) => t.tier === "free").slice(0, 3);

  return (
    <section className="mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">
            Coleção gratuita
          </p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
            Blueprints disponíveis
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Comece pelos gratuitos. Veja a qualidade. Decida depois.
          </p>
        </div>
        <Link
          href="/blueprints"
          className="hidden shrink-0 text-sm text-white/40 transition-colors hover:text-white md:block"
        >
          Ver todos →
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {freeTemplates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <TemplateCard template={template} />
          </motion.div>
        ))}
      </div>

      <Link
        href="/blueprints"
        className="mt-6 inline-block text-sm text-[#00d4ff] md:hidden"
      >
        Ver todos os blueprints →
      </Link>
    </section>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Escolha um blueprint",
    copy: "Navegue pelo catálogo e veja o preview ao vivo de cada projeto real.",
  },
  {
    n: "2",
    title: "Copie o blueprint",
    copy: "Acesse o conceito, paleta, estrutura e o prompt completo em um clique.",
  },
  {
    n: "3",
    title: "Cole e customize",
    copy: "Use no Lovable, Bolt ou Cursor. Em minutos você tem um site premium.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mt-24">
      <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">
        Processo
      </p>
      <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
        Como funciona
      </h2>

      <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
        {STEPS.map((step, i) => (
          <div key={step.n} className="relative flex gap-5 md:flex-col md:gap-5 md:pr-10">
            {i < STEPS.length - 1 && (
              <div className="absolute right-0 top-5 hidden h-px w-1/3 border-t border-dashed border-white/10 md:block" />
            )}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 font-[var(--font-oswald)] text-sm font-semibold text-white/60">
              {step.n}
            </div>
            <div>
              <h3 className="font-[var(--font-oswald)] text-xl font-semibold tracking-wide">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {step.copy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedTemplateSection() {
  const destaque =
    templates.find((t) => t.quality_score >= 5 && t.tier === "free") ??
    templates[0];

  return (
    <section className="mt-24 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#111111]">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-8 md:p-10">
          <span className="inline-flex w-fit rounded-full border border-[#c9a84c]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a84c]">
            Mais popular
          </span>
          <h3 className="mt-5 font-[var(--font-oswald)] text-5xl font-bold uppercase tracking-tight">
            {destaque.name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            {destaque.tagline}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {destaque.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[10px] text-white/40"
              >
                {s}
              </span>
            ))}
          </div>

          <ul className="mt-6 space-y-2.5">
            {[
              "Conceito de design completo",
              "Mapa de seções detalhado",
              "Prompt universal mestre + assets",
              "Checklist de QA para fidelidade visual",
            ].map((feat) => (
              <li
                key={feat}
                className="flex items-center gap-2.5 text-sm text-white/55"
              >
                <span className="text-[#22c55e]">✓</span> {feat}
              </li>
            ))}
          </ul>

          <Link
            href={`/blueprints/${destaque.slug}`}
            className="mt-7 inline-block rounded-md bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Acessar blueprint completo →
          </Link>
        </div>

        <div
          className="relative min-h-[360px]"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${destaque.colors.primary}28 0%, transparent 55%), radial-gradient(circle at 75% 75%, ${destaque.colors.accent}1a 0%, transparent 50%), ${destaque.colors.background}`,
          }}
        >
          <div className="absolute inset-5 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080808] shadow-2xl md:inset-8">
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#111111] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
              <div className="ml-2 h-4 flex-1 rounded-sm border border-white/[0.06] bg-[#1a1a1a]" />
            </div>
            <div className="flex h-full items-center justify-center p-8">
              <p
                className="select-none text-center font-[var(--font-oswald)] text-7xl font-bold uppercase opacity-[0.07]"
                style={{ color: destaque.colors.primary }}
              >
                {destaque.name}
              </p>
            </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-20 rounded-b-3xl"
            style={{
              background: `linear-gradient(to top, ${destaque.colors.background}, transparent)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "GRATUITO",
    price: "R$0",
    period: "sempre",
    accentColor: "#22c55e",
    featured: false,
    items: [
      { ok: true, text: "3 blueprints gratuitos completos" },
      { ok: true, text: "Preview ao vivo de todos os blueprints" },
      { ok: true, text: "Conceito de design + paleta + tipografia" },
      { ok: false, text: "Prompt universal completo" },
      { ok: false, text: "Nota de personalização por nicho" },
    ],
    cta: "Começar grátis",
    href: "/blueprints",
  },
  {
    name: "PREMIUM",
    price: "R$29",
    period: "/mês",
    accentColor: "#c9a84c",
    featured: true,
    items: [
      { ok: true, text: "Todos os blueprints atuais e futuros" },
      { ok: true, text: "Prompt completo (Lovable, Bolt, Cursor)" },
      { ok: true, text: "Mapa de seções detalhado" },
      { ok: true, text: "Nota de personalização por nicho" },
      { ok: true, text: "Novos blueprints todo mês" },
    ],
    cta: "Assinar agora →",
    href: "/planos",
  },
  {
    name: "FOUNDING LIFETIME",
    price: "R$397",
    period: "único",
    accentColor: "#a855f7",
    featured: false,
    items: [
      { ok: true, text: "Tudo do Premium para sempre" },
      { ok: true, text: "Acesso vitalício sem mensalidade" },
      { ok: true, text: "Selo Founding Member" },
      { ok: true, text: "Apenas 100 vagas totais" },
      { ok: true, text: "Prioridade em novos nichos" },
    ],
    cta: "Garantir vaga →",
    href: "/planos",
  },
];

export function PricingPreview() {
  return (
    <section className="mt-24">
      <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">
        Planos
      </p>
      <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
        Acesse a biblioteca completa
      </h2>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className="relative flex flex-col rounded-2xl border bg-[#111111] p-6"
            style={{
              borderColor: plan.featured
                ? `${plan.accentColor}55`
                : "rgba(255,255,255,0.07)",
              boxShadow: plan.featured
                ? `0 0 50px -15px ${plan.accentColor}30`
                : "none",
            }}
          >
            {plan.featured && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-0.5 text-[10px] uppercase tracking-[0.18em]"
                style={{
                  borderColor: `${plan.accentColor}55`,
                  backgroundColor: "#080808",
                  color: plan.accentColor,
                }}
              >
                Mais popular
              </span>
            )}

            <p
              className="font-[var(--font-oswald)] text-sm font-medium uppercase tracking-wider"
              style={{ color: plan.accentColor }}
            >
              {plan.name}
            </p>

            <div className="mt-3 flex items-end gap-1">
              <span className="font-[var(--font-oswald)] text-4xl font-bold">
                {plan.price}
              </span>
              <span className="mb-1 text-sm text-white/40">{plan.period}</span>
            </div>

            <ul className="mt-5 flex-1 space-y-2.5">
              {plan.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-sm">
                  <span
                    className="shrink-0 pt-px"
                    style={{ color: item.ok ? "#22c55e" : "rgba(255,255,255,0.2)" }}
                  >
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <span
                    className={
                      item.ok ? "text-white/55" : "text-white/22 line-through"
                    }
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className="mt-6 rounded-md px-5 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-85"
              style={
                plan.featured
                  ? {
                      backgroundColor: plan.accentColor,
                      color: "#000",
                    }
                  : {
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#f0f0f0",
                    }
              }
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-white/25">
        Founding Lifetime: 100 vagas totais, preço fixo de lançamento
      </p>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: "Vou conseguir replicar igual ao original?",
    a: "Esse é o objetivo do blueprint: reduzir ao máximo a diferença entre referência e execução. O pacote inclui prompt, estrutura, tokens de design, lista de assets e checklist de QA visual.",
  },
  {
    q: "É só um prompt genérico?",
    a: "Não. Junto com o prompt vai especificação técnica de implementação, lista de assets necessários, especificação de animações e checklist de QA. O prompt é só uma das peças.",
  },
  {
    q: "Funciona para quem não é dev avançado?",
    a: "Sim. O material foi organizado para ser usado diretamente por IA (Lovable, Bolt, Cursor) ou por desenvolvedor humano. A clareza é o produto.",
  },
  {
    q: "Funciona com meu fluxo (Lovable/Cursor/Claude/Windsurf)?",
    a: "Sim. O prompt universal foi desenhado para ser agnóstico de ferramenta — funciona em qualquer plataforma de AI coding.",
  },
  {
    q: "Posso vender os sites criados para clientes?",
    a: "Sim. A licença de uso inclui o direito de usar os blueprints em projetos próprios e de clientes, tanto no Premium quanto no Founding Lifetime.",
  },
  {
    q: "Os blueprints são projetos reais ou mockups?",
    a: "Projetos reais, deployados e funcionando em produção. Você pode acessar o preview ao vivo de cada um antes de qualquer decisão.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mb-24 mt-24">
      <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">
        Dúvidas frequentes
      </p>
      <h2 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
        FAQ
      </h2>

      <div className="mt-8 divide-y divide-white/[0.06]">
        {FAQ_ITEMS.map((item, i) => (
          <article key={i} className="py-5">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <h3 className="font-[var(--font-oswald)] text-[1.1rem] font-medium leading-snug">
                {item.q}
              </h3>
              <span
                className="shrink-0 text-lg text-white/30 transition-transform duration-300"
                style={{
                  transform: open === i ? "rotate(45deg)" : "none",
                  display: "inline-block",
                }}
              >
                +
              </span>
            </button>
            {open === i && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50"
              >
                {item.a}
              </motion.p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
