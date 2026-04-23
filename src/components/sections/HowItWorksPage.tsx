"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const STEPS = [
  {
    n: "01",
    title: "Escolha um blueprint",
    copy:
      "Navegue pelos 7+ blueprints reais, filtre por nicho, veja o preview ao vivo e entenda o estilo visual antes de decidir.",
    tip: "Use os filtros por nicho e por ferramenta (Lovable, Bolt, Cursor) para comparar estilos rapidamente.",
  },
  {
    n: "02",
    title: "Copie o pacote mestre",
    copy:
      "Cada blueprint vem com conceito, paleta, tipografia, mapa de seções, animações, assets e o prompt universal pronto para colar.",
    tip: "O prompt mestre já inclui fallback quando a IA gera algo genérico. Menos retrabalho, mais fidelidade.",
  },
  {
    n: "03",
    title: "Cole no Lovable, Bolt ou Cursor",
    copy:
      "Abra a ferramenta de AI coding que você já usa, cole o prompt e deixe a IA gerar o site completo em minutos.",
    tip: "Funciona igual em Lovable, Bolt, Cursor, Claude, v0 ou Windsurf — prompt é agnóstico de ferramenta.",
  },
  {
    n: "04",
    title: "Personalize e entregue",
    copy:
      "Troque marca, textos e ofertas usando o checklist de QA. Você entrega um site premium sem gastar horas em CSS.",
    tip: "A licença comercial está inclusa no Premium e no Founding Lifetime: venda para clientes sem medo.",
  },
];

const STACK = [
  { name: "Lovable", tag: "No-code AI" },
  { name: "Bolt", tag: "AI builder" },
  { name: "Cursor", tag: "IDE AI" },
  { name: "Claude", tag: "Agentic AI" },
  { name: "v0", tag: "UI AI" },
  { name: "Windsurf", tag: "IDE AI" },
];

export function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 15% 10%, rgba(0,212,255,0.14) 0%, transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(201,168,76,0.1) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-white/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
          Como funciona
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 font-[var(--font-oswald)] text-[clamp(2.4rem,5.5vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-tight"
        >
          Do blueprint ao{" "}
          <em
            className="not-italic"
            style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic", color: "#00d4ff" }}
          >
            site pronto
          </em>
          <br />
          em 4 passos.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-white/55"
        >
          Menos decisão, mais execução. Cada blueprint reduz a distância entre a ideia e o site publicado,
          entregando tudo que a IA precisa para acertar de primeira.
        </motion.p>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.n}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative rounded-2xl border border-white/[0.07] bg-[#111111] p-6 transition-colors hover:border-white/[0.14]"
            >
              <p
                className="font-[var(--font-oswald)] text-6xl font-bold"
                style={{ color: "rgba(255,255,255,0.06)" }}
              >
                {step.n}
              </p>
              <h2 className="mt-3 font-[var(--font-oswald)] text-2xl font-semibold uppercase tracking-wide">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{step.copy}</p>
              <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[11px] leading-relaxed text-white/40">
                💡 {step.tip}
              </p>
            </motion.article>
          ))}
        </div>

        <section className="mt-20">
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">Compatibilidade</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Funciona com sua stack de AI coding
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {STACK.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-white/[0.07] bg-[#111111] p-4"
              >
                <p className="font-[var(--font-oswald)] text-lg font-semibold">{tool.name}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">{tool.tag}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-white/[0.07] bg-[#111111] p-8 text-center">
          <h2 className="font-[var(--font-oswald)] text-3xl font-bold uppercase">
            Pronto para começar?
          </h2>
          <p className="mt-3 text-sm text-white/55">
            Experimente 3 blueprints gratuitos. Sem cartão. Sem compromisso.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/blueprints"
              className="rounded-md bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Ver blueprints gratuitos →
            </Link>
            <Link
              href="/planos"
              className="rounded-md border border-white/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-white/30"
            >
              Ver planos
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
