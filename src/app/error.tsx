"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[wx-blueprints] runtime error", error);
    }
  }, [error]);

  return (
    <main className="relative min-h-[80vh] bg-[#080808] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(239,68,68,0.1), rgba(8,8,8,0) 70%)",
        }}
      />
      <section className="relative mx-auto w-full max-w-xl px-6 pt-48 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Erro inesperado</p>
        <h1
          className="mt-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
        >
          Algo saiu do trilho.
        </h1>
        <p className="mt-4 text-sm text-white/55">
          Registramos a falha e vamos investigar. Tente a ação novamente em alguns segundos.
          {error.digest && (
            <span className="mt-2 block text-xs text-white/30">
              Código: {error.digest}
            </span>
          )}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-[#00d4ff] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Tentar de novo
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition-colors hover:border-white/30"
          >
            Voltar para o início
          </Link>
        </div>
      </section>
    </main>
  );
}
