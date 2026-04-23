"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import type { UserAccess } from "@/lib/access/types";

interface Props {
  repoUrl: string;
  repoAccess?: "public" | "private" | "collaborator";
  templateName: string;
}

interface MeResponse {
  access: UserAccess;
}

const labelForAccess: Record<NonNullable<Props["repoAccess"]>, string> = {
  public: "Repositório público",
  private: "Repositório privado",
  collaborator: "Acesso como colaborador",
};

export function TemplateRepoAccess({ repoUrl, repoAccess = "private", templateName }: Props) {
  const { user, ready, getIdToken } = useAuth();
  const [access, setAccess] = useState<UserAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!ready) return;
      if (!user) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const token = await getIdToken();
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error("me failed");
        const json = (await res.json()) as MeResponse;
        if (mounted) setAccess(json.access);
      } catch {
        if (mounted) setAccess(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [ready, user, getIdToken]);

  const canAccess = access?.canAccessPremium === true;
  const isCollaboratorPlan =
    access?.isLifetime === true || access?.plan === "founding_lifetime";
  const collaboratorRequired = repoAccess === "collaborator" && !isCollaboratorPlan;
  const effectiveAccess = canAccess && !collaboratorRequired;

  return (
    <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
      <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Código-fonte</p>
      <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">
        Repositório do projeto
      </h2>
      <p className="mt-2 text-sm text-white/55">
        Clone, rode localmente e adapte para o cliente. Use como base para qualquer projeto do nicho.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
        <span className="rounded-full border border-white/10 px-3 py-1">
          {labelForAccess[repoAccess]}
        </span>
        {repoAccess === "collaborator" && (
          <span className="rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 px-3 py-1 text-[#a855f7]">
            Founding
          </span>
        )}
      </div>

      {loading ? (
        <div className="mt-5 text-sm text-white/35">Verificando acesso…</div>
      ) : !user ? (
        <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/30 p-5">
          <p className="text-sm text-white/55">
            Entre ou crie uma conta para verificar se você tem acesso ao repositório do{" "}
            <span className="text-white/80">{templateName}</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/entrar"
              className="rounded-md bg-[#00d4ff] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
            >
              Entrar
            </Link>
            <Link
              href="/criar-conta"
              className="rounded-md border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:border-white/30 hover:text-white/90"
            >
              Criar conta
            </Link>
          </div>
        </div>
      ) : effectiveAccess ? (
        <div className="mt-5 rounded-xl border border-[#22c55e]/40 bg-[#22c55e]/5 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#22c55e]">✓ Acesso liberado</p>
          <p className="mt-2 break-all font-mono text-sm text-white/80">{repoUrl}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#22c55e] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
            >
              Abrir repositório ↗
            </a>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(repoUrl)}
              className="rounded-md border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition-colors hover:border-white/30 hover:text-white/90"
            >
              Copiar link
            </button>
          </div>
          {repoAccess === "collaborator" && (
            <p className="mt-3 text-xs text-white/45">
              Como founding member você recebe convite de colaborador por email em até 24h.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/5 p-5">
          <p className="flex items-center gap-2 text-sm text-[#c9a84c]">
            🔒{" "}
            {collaboratorRequired
              ? "Esse repositório é exclusivo para Founding Members (100 vagas)."
              : "O repositório fica disponível para assinantes Premium e Founding."}
          </p>
          <p className="mt-2 text-sm text-white/55">
            Você continua com o blueprint completo em texto. Quer o código pronto para clonar?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/planos"
              className="rounded-md bg-[#c9a84c] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-black transition-opacity hover:opacity-90"
            >
              {collaboratorRequired ? "Virar Founding →" : "Assinar Premium →"}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
