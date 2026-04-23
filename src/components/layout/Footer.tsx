"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/context";

const MARQUEE_TEXT =
  "SITES PREMIUM • BLUEPRINTS PRONTOS • AI CODING • WX DIGITAL STUDIO • SITES PREMIUM • BLUEPRINTS PRONTOS • AI CODING • WX DIGITAL STUDIO • ";

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
      <div className="overflow-hidden border-b border-white/[0.06] py-4">
        <p
          className="animate-marquee inline-block whitespace-nowrap text-xs uppercase tracking-[0.25em] text-white/20"
          aria-hidden="true"
        >
          {MARQUEE_TEXT}
          {MARQUEE_TEXT}
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          <div>
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
            >
              WX Blueprints
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              {t("footer.description")}
            </p>
            <a
              href="mailto:contato@wxdigitalstudio.com.br"
              className="mt-4 inline-block text-xs text-white/30 underline underline-offset-4 transition-colors hover:text-white/60"
            >
              contato@wxdigitalstudio.com.br
            </a>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
                {t("footer.product")}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ["/blueprints", t("nav.blueprints")],
                  ["/planos", t("nav.plans")],
                  ["/como-funciona", t("nav.how_it_works")],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-white/40 transition-colors hover:text-white/70"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
                {t("footer.niches")}
              </p>
              <div className="flex flex-col gap-2 text-sm text-white/40">
                <span>Automotivo</span>
                <span>Barbearia</span>
                <span>Alimentação</span>
                <span>Saúde</span>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-white/25">
                {t("footer.account")}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  ["/entrar", t("nav.sign_in")],
                  ["/criar-conta", t("nav.sign_up")],
                  ["/painel", t("nav.panel")],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-white/40 transition-colors hover:text-white/70"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <p className="text-xs text-white/20">
            {t("footer.copyright")}
          </p>
          <Link
            href="/planos"
            className="rounded-full bg-[#00d4ff] px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            {t("footer.access_plans")}
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-6 text-xs text-white/30">
          {[
            ["/termos", "Termos de uso"],
            ["/privacidade", "Privacidade"],
            ["/reembolso", "Reembolso"],
            ["/licenca", "Licença"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="transition-colors hover:text-white/60"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
