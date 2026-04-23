import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-[80vh] bg-[#080808] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(0,212,255,0.08), rgba(8,8,8,0) 70%)",
        }}
      />
      <section className="relative mx-auto w-full max-w-xl px-6 pt-48 text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">404</p>
        <h1
          className="mt-4 text-4xl font-bold leading-tight md:text-5xl"
          style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
        >
          Essa página se perdeu.
        </h1>
        <p className="mt-4 text-sm text-white/55">
          O link pode estar desatualizado ou o blueprint saiu do catálogo. Volte à biblioteca e
          explore de novo.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/blueprints"
            className="rounded-full bg-[#00d4ff] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver blueprints
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/70 transition-colors hover:border-white/30"
          >
            Voltar ao início
          </Link>
        </div>
      </section>
    </main>
  );
}
