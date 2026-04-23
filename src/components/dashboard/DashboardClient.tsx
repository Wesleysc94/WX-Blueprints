"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { deriveUserAccess } from "@/lib/access";
import { readBillingError } from "@/lib/billing/client-errors";
import { PLANS } from "@/lib/plans";
import { templates } from "@/data/templates";
import type { UserAccess, UserDocument } from "@/lib/access/types";

type DashboardTab = "overview" | "blueprints" | "billing" | "account";

interface MeResponse {
  user: UserDocument;
  access: UserAccess;
}

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "overview", label: "Visão geral" },
  { id: "blueprints", label: "Meus blueprints" },
  { id: "billing", label: "Assinatura" },
  { id: "account", label: "Conta" },
];

const formatDate = (iso?: string): string => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

const statusLabel = (status: string): { label: string; color: string } => {
  switch (status) {
    case "active":
      return { label: "Ativa", color: "#22c55e" };
    case "lifetime":
      return { label: "Vitalícia", color: "#a855f7" };
    case "overdue":
      return { label: "Em atraso", color: "#f59e0b" };
    case "pending":
      return { label: "Aguardando pagamento", color: "#00d4ff" };
    case "blocked":
      return { label: "Bloqueada", color: "#ef4444" };
    case "canceled":
      return { label: "Cancelada", color: "#ef4444" };
    case "expired":
      return { label: "Expirada", color: "#ef4444" };
    default:
      return { label: "Sem assinatura", color: "rgba(255,255,255,0.4)" };
  }
};

export function DashboardClient() {
  const { user, ready, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/entrar?from=${encodeURIComponent("/painel")}`);
    }
  }, [ready, user, router]);

  const loadMe = useCallback(async () => {
    const token = await getIdToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Falha ao carregar dados.");
      const json = (await res.json()) as MeResponse;
      setData(json);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao carregar painel.");
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    if (!user) return;
    // loadMe dispara fetch assíncrono; setState ocorre após await, não sincronamente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMe();
  }, [user, loadMe]);

  const access =
    data?.access ||
    deriveUserAccess({ plan: "free", subscriptionStatus: "none", email: user?.email || "" });

  const unlockedTemplates = useMemo(
    () => (access.canAccessPremium ? templates : templates.filter((t) => t.tier === "free")),
    [access.canAccessPremium],
  );

  const onCopyPrompt = async (id: string, prompt?: string) => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    toast.success("Prompt copiado");
    setTimeout(() => setCopiedId(null), 1600);
  };

  const onCancelSubscription = async () => {
    if (!data) return;
    if (!confirm("Cancelar assinatura? O acesso continua até o fim do ciclo atual.")) return;
    const token = await getIdToken();
    if (!token) return;
    setCancelLoading(true);
    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const message = await readBillingError(res, "Falha ao cancelar.");
        throw new Error(message);
      }
      toast.success("Assinatura cancelada.");
      await loadMe();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar.");
    } finally {
      setCancelLoading(false);
    }
  };

  const onSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!ready || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-white/40">
        Carregando…
      </div>
    );
  }

  const info = statusLabel(access.subscriptionStatus);
  const planDefinition = PLANS[access.plan];
  const memberName = data?.user.name || user.displayName || user.email?.split("@")[0] || "Membro";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 10% 0%, rgba(0,212,255,0.1) 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(168,85,247,0.08) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/35">Painel</p>
            <h1 className="mt-2 font-[var(--font-oswald)] text-4xl font-bold uppercase md:text-5xl">
              Olá, {memberName}
            </h1>
            <p className="mt-2 text-sm text-white/50">
              {user.email}
              {access.isLifetime && (
                <span className="ml-2 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[#a855f7]">
                  Founding member #{data?.user.billing?.foundingSeatNumber ?? "—"}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="self-start rounded-xl border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
          >
            Sair
          </button>
        </div>

        <nav className="mt-10 flex flex-wrap gap-2 border-b border-white/[0.07] pb-0">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative rounded-t-lg px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                tab === item.id ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {item.label}
              {tab === item.id && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#00d4ff]" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {loading && !data ? (
            <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-8 text-center text-sm text-white/40">
              Carregando painel…
            </div>
          ) : tab === "overview" ? (
            <OverviewPanel data={data} access={access} planDefinition={planDefinition} info={info} />
          ) : tab === "blueprints" ? (
            <BlueprintsPanel
              templates={unlockedTemplates}
              canPremium={access.canAccessPremium}
              copiedId={copiedId}
              onCopy={onCopyPrompt}
            />
          ) : tab === "billing" ? (
            <BillingPanel
              data={data}
              access={access}
              onCancel={onCancelSubscription}
              cancelLoading={cancelLoading}
            />
          ) : (
            <AccountPanel data={data} email={user.email || ""} />
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">{label}</p>
      <p
        className="mt-2 font-[var(--font-oswald)] text-3xl font-bold"
        style={{ color: accent || "#ffffff" }}
      >
        {value}
      </p>
    </div>
  );
}

function OverviewPanel({
  data,
  access,
  planDefinition,
  info,
}: {
  data: MeResponse | null;
  access: UserAccess;
  planDefinition: (typeof PLANS)[keyof typeof PLANS];
  info: { label: string; color: string };
}) {
  const unlockedCount = access.canAccessPremium ? templates.length : templates.filter((t) => t.tier === "free").length;
  const nextDue = data?.user.billing?.nextSubscriptionDueDate;
  const expiresAt = access.planExpiresAt;

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Plano atual" value={planDefinition.label} accent="#00d4ff" />
        <StatCard label="Status" value={info.label} accent={info.color} />
        <StatCard
          label={access.isLifetime ? "Acesso" : "Próximo ciclo"}
          value={access.isLifetime ? "Vitalício" : formatDate(nextDue || expiresAt)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#00d4ff]">Biblioteca desbloqueada</p>
          <p className="mt-3 font-[var(--font-oswald)] text-5xl font-bold">{unlockedCount}/{templates.length}</p>
          <p className="mt-2 text-sm text-white/50">
            {access.canAccessPremium
              ? "Todos os blueprints disponíveis estão desbloqueados para você."
              : "Você tem acesso aos blueprints gratuitos. Faça upgrade para desbloquear o restante."}
          </p>
          {!access.canAccessPremium && (
            <Link
              href="/planos"
              className="mt-5 inline-block rounded-md bg-[#00d4ff] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Ver planos →
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9a84c]">Próximos passos</p>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li className="flex gap-3">
              <span className="font-[var(--font-oswald)] text-white/30">01</span>
              <span>Escolha um blueprint em <Link href="/blueprints" className="text-[#00d4ff]">/blueprints</Link>.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-[var(--font-oswald)] text-white/30">02</span>
              <span>Copie o prompt universal e cole no Lovable, Bolt ou Cursor.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-[var(--font-oswald)] text-white/30">03</span>
              <span>Siga o checklist de QA para entregar com fidelidade visual.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function BlueprintsPanel({
  templates: list,
  canPremium,
  copiedId,
  onCopy,
}: {
  templates: typeof templates;
  canPremium: boolean;
  copiedId: string | null;
  onCopy: (id: string, prompt?: string) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/40">
        <span>{list.length} desbloqueados</span>
        {!canPremium && (
          <Link href="/planos" className="text-[#00d4ff] hover:opacity-80">
            Desbloquear tudo →
          </Link>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-white/[0.07] bg-[#111111] p-5"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: item.tier === "free" ? "#22c55e22" : "#c9a84c22",
                    color: item.tier === "free" ? "#22c55e" : "#c9a84c",
                    border: `1px solid ${item.tier === "free" ? "#22c55e44" : "#c9a84c44"}`,
                  }}
                >
                  {item.tier === "free" ? "FREE" : "PREMIUM"}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">{item.niche}</span>
              </div>
              <h3 className="mt-3 font-[var(--font-oswald)] text-2xl uppercase leading-tight">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.tagline}</p>
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href={`/blueprints/${item.slug}`}
                className="rounded-md border border-white/10 px-4 py-2 text-xs font-semibold transition-colors hover:border-white/25"
              >
                Abrir blueprint
              </Link>
              <button
                type="button"
                onClick={() => onCopy(item.id, item.blueprint?.universal_prompt)}
                disabled={!item.blueprint?.universal_prompt}
                className="rounded-md bg-[#00d4ff] px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {copiedId === item.id ? "Copiado ✓" : "Copiar prompt"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BillingPanel({
  data,
  access,
  onCancel,
  cancelLoading,
}: {
  data: MeResponse | null;
  access: UserAccess;
  onCancel: () => void;
  cancelLoading: boolean;
}) {
  const billing = data?.user.billing;
  const planDefinition = PLANS[access.plan];
  const canCancel =
    access.plan !== "free" &&
    !access.isLifetime &&
    (access.subscriptionStatus === "active" || access.subscriptionStatus === "overdue");

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#00d4ff]">Plano atual</p>
        <h3 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">
          {planDefinition.label}
        </h3>
        {planDefinition.price > 0 && (
          <p className="mt-1 text-sm text-white/50">
            R$ {planDefinition.price} {planDefinition.cycle === "MONTHLY" ? "/mês" : planDefinition.cycle === "YEARLY" ? "/ano" : "pagamento único"}
          </p>
        )}
        <dl className="mt-5 grid gap-3 md:grid-cols-2">
          <Field label="Status" value={statusLabel(access.subscriptionStatus).label} />
          <Field label="Ativado em" value={formatDate(data?.user.planActivatedAt)} />
          {!access.isLifetime && (
            <Field label="Expira em" value={formatDate(access.planExpiresAt)} />
          )}
          {billing?.nextSubscriptionDueDate && (
            <Field label="Próxima cobrança" value={formatDate(billing.nextSubscriptionDueDate)} />
          )}
          {billing?.lastPaymentAt && (
            <Field label="Último pagamento" value={formatDate(billing.lastPaymentAt)} />
          )}
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        {access.plan === "free" ? (
          <Link
            href="/planos"
            className="rounded-md bg-[#00d4ff] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver planos →
          </Link>
        ) : (
          <Link
            href="/planos"
            className="rounded-md border border-white/15 px-5 py-3 text-sm font-semibold transition-colors hover:border-white/30"
          >
            Mudar de plano
          </Link>
        )}
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelLoading}
            className="rounded-md border border-[#ef4444]/40 px-5 py-3 text-sm font-semibold text-[#ef4444] transition-colors hover:bg-[#ef4444]/10 disabled:opacity-60"
          >
            {cancelLoading ? "Cancelando…" : "Cancelar assinatura"}
          </button>
        )}
      </div>

      <p className="text-xs text-white/30">
        Pagamentos processados pelo Asaas. Reembolso disponível em até 7 dias (CDC).
      </p>
    </section>
  );
}

function AccountPanel({ data, email }: { data: MeResponse | null; email: string }) {
  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#00d4ff]">Dados pessoais</p>
        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Nome" value={data?.user.name || "—"} />
          <Field label="Email" value={email} />
          <Field label="CPF" value={data?.user.cpf ? data.user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "—"} />
          <Field label="Telefone" value={data?.user.phone || "—"} />
          <Field label="Membro desde" value={formatDate(data?.user.createdAt)} />
          <Field label="Locale" value={data?.user.locale || "pt-BR"} />
        </dl>
      </div>
      <div className="rounded-2xl border border-white/[0.07] bg-[#111111] p-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#c9a84c]">Suporte</p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          Dúvidas, ajustes de cadastro ou reembolso? Fale com a gente por{" "}
          <a
            href="mailto:wxdigitalstudio@gmail.com"
            className="text-[#00d4ff] hover:opacity-80"
          >
            wxdigitalstudio@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.2em] text-white/35">{label}</dt>
      <dd className="mt-1 text-sm text-white/80">{value}</dd>
    </div>
  );
}
