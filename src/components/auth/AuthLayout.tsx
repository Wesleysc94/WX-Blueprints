import type { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center px-6 py-20">
      <div
        className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-[340px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,212,255,0.12) 0%, transparent 65%)",
        }}
      />

      <Link
        href="/"
        className="mb-8 inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-white/40 transition-colors hover:text-white/60"
      >
        <span>←</span> WX Blueprints
      </Link>

      <h1 className="font-[var(--font-oswald)] text-4xl font-bold uppercase tracking-tight md:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-white/55">{subtitle}</p>}

      <div className="mt-10">{children}</div>

      {footer && <div className="mt-8 border-t border-white/[0.06] pt-6">{footer}</div>}
    </main>
  );
}
