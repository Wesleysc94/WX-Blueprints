"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { templates } from "@/data/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

type TierFilter = "Todos" | "Gratuito" | "Premium";

export default function BlueprintsPage() {
  const [niche, setNiche] = useState("Todos");
  const [tier, setTier] = useState<TierFilter>("Todos");
  const [stack, setStack] = useState("Todos");

  const filtered = useMemo(() => {
    return templates.filter((template) => {
      const nicheMatch = niche === "Todos" || template.niche === niche;
      const tierValue = tier === "Gratuito" ? "free" : tier === "Premium" ? "premium" : "Todos";
      const tierMatch = tier === "Todos" || template.tier === tierValue;
      const stackMatch =
        stack === "Todos" ||
        template.stack.some((item) => item.toLowerCase().includes(stack.toLowerCase()));
      return nicheMatch && tierMatch && stackMatch;
    });
  }, [niche, tier, stack]);

  const niches = ["Todos", ...Array.from(new Set(templates.map((item) => item.niche)))];
  const totalCount = templates.length;
  const freeCount = templates.filter((t) => t.tier === "free").length;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 10% 0%, rgba(0,212,255,0.14) 0%, transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(201,168,76,0.1) 0%, transparent 55%)",
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
          Catálogo de blueprints
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 font-[var(--font-oswald)] text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-tight"
        >
          {totalCount} blueprints prontos.
          <br />
          <em
            className="not-italic"
            style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", color: "#00d4ff" }}
          >
            {freeCount} grátis
          </em>{" "}
          para testar.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/55"
        >
          Filtre por nicho, qualidade visual ou stack. Veja o preview ao vivo, abra o blueprint
          completo e copie o prompt universal em um clique.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-10 grid gap-3 rounded-2xl border border-white/[0.07] bg-[#111111] p-4 md:grid-cols-3"
        >
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            Nicho
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm normal-case tracking-normal text-white focus:border-[#00d4ff]/60 focus:outline-none"
            >
              {niches.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            Plano
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as TierFilter)}
              className="h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm normal-case tracking-normal text-white focus:border-[#00d4ff]/60 focus:outline-none"
            >
              <option>Todos</option>
              <option>Gratuito</option>
              <option>Premium</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            Stack
            <select
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              className="h-10 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm normal-case tracking-normal text-white focus:border-[#00d4ff]/60 focus:outline-none"
            >
              <option>Todos</option>
              <option>React</option>
              <option>Next.js</option>
              <option>Tailwind</option>
              <option>HTML</option>
              <option>Vite</option>
            </select>
          </label>
        </motion.div>

        <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span>
            {filtered.length} {filtered.length === 1 ? "blueprint" : "blueprints"}
          </span>
          <span className="hidden md:inline">Dica: comece pelos gratuitos para validar a qualidade</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="h-full"
            >
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/[0.07] bg-[#111111] p-8 text-center">
            <p className="font-[var(--font-oswald)] text-xl uppercase">Nenhum blueprint encontrado</p>
            <p className="mt-2 text-sm text-white/50">
              Limpe os filtros ou peça um nicho novo — a biblioteca cresce todo mês.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
