"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { LocaleToggle } from "./LocaleToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();
  const { user, ready } = useAuth();
  const signedIn = ready && !!user;

  const navLinks = useMemo(
    () => [
      { href: "/blueprints", label: t("nav.blueprints") },
      { href: "/como-funciona", label: t("nav.how_it_works") },
      { href: "/planos", label: t("nav.plans") },
    ],
    [t],
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    // Fecha o menu mobile ao mudar de rota. pathname é um sinal externo
    // (Next router) — não é estado derivado, então setState aqui é legítimo.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className="inline-flex w-full max-w-2xl items-center rounded-full border px-2 py-2 transition-all duration-300"
          style={{
            borderColor: scrolled
              ? "rgba(255,255,255,0.1)"
              : "rgba(255,255,255,0.07)",
            backgroundColor: scrolled
              ? "rgba(8,8,8,0.92)"
              : "rgba(8,8,8,0.6)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Link
            href="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#080808]"
          >
            <span
              style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}
              className="text-[13px] text-white/80"
            >
              WX
            </span>
          </Link>

          <div className="mx-1.5 hidden h-4 w-px bg-white/10 sm:block" />

          <div className="hidden flex-1 items-center gap-0.5 sm:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3.5 py-1.5 text-sm transition-colors"
                style={{
                  backgroundColor:
                    pathname === href
                      ? "rgba(255,255,255,0.07)"
                      : "transparent",
                  color:
                    pathname === href
                      ? "rgba(240,240,240,0.9)"
                      : "rgba(240,240,240,0.45)",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mx-1.5 hidden h-4 w-px bg-white/10 sm:block" />

          <div className="hidden items-center gap-2 sm:flex">
            <LocaleToggle />
            {signedIn ? (
              <Link
                href="/painel"
                className="rounded-full bg-[#00d4ff] px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Painel
              </Link>
            ) : (
              <Link
                href="/criar-conta"
                className="rounded-full bg-[#00d4ff] px-4 py-1.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                {t("nav.start_free")}
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-auto rounded-full p-2 text-white/50 sm:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080808]/95 p-6 pt-24 sm:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-white/[0.07] p-4 text-left text-lg text-white"
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-2">
              <LocaleToggle className="flex h-11 flex-1 items-center justify-center gap-1 rounded-2xl border border-white/[0.07] text-sm font-semibold uppercase tracking-[0.2em] text-white/60" />
              <Link
                href={signedIn ? "/painel" : "/criar-conta"}
                className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#00d4ff] text-sm font-semibold text-black"
              >
                {signedIn ? "Painel →" : `${t("nav.start_free")} →`}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
