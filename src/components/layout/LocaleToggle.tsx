"use client";

import { useI18n } from "@/lib/i18n/context";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useI18n();
  const nextLabel = locale === "pt-BR" ? "EN" : "PT";
  const currentLabel = locale === "pt-BR" ? "PT" : "EN";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={`Trocar idioma para ${nextLabel}`}
      className={
        className ||
        "flex h-8 items-center gap-1 rounded-full border border-white/10 bg-[#0f0f0f] px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/25 hover:text-white"
      }
    >
      <span>{currentLabel}</span>
      <span className="text-white/20">/</span>
      <span className="text-white/25">{nextLabel}</span>
    </button>
  );
}
