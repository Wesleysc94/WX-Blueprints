import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-[#080808] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,212,255,0.08), rgba(8,8,8,0) 70%)",
        }}
      />

      <section className="relative mx-auto w-full max-w-3xl px-6 pb-24 pt-36">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white/70"
        >
          ← voltar
        </Link>

        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-white/40">
          {eyebrow}
        </p>
        <h1
          className="mt-3 text-4xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
        >
          {title}
        </h1>
        <p className="mt-3 text-xs text-white/40">Atualizado em {updatedAt}</p>

        <div className="prose-legal mt-10 space-y-6 text-[15px] leading-[1.7] text-white/70">
          {children}
        </div>

        <div className="mt-16 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-sm text-white/60">
          Dúvidas? Escreva para{" "}
          <a
            href="mailto:wxdigitalstudio@gmail.com"
            className="text-[#00d4ff] underline underline-offset-4"
          >
            wxdigitalstudio@gmail.com
          </a>
          .
        </div>
      </section>
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
