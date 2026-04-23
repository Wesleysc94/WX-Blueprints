import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { templates } from "@/data/templates";
import { UniversalPromptBox } from "@/components/templates/UniversalPromptBox";
import { BlueprintVideo } from "@/components/templates/BlueprintVideo";
import { TemplateRepoAccess } from "@/components/templates/TemplateRepoAccess";
import { getTemplateVideoUrl } from "@/lib/storage/videos";

interface Props {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () =>
  templates.map((t) => ({ slug: t.slug }));

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) return { title: "Blueprint não encontrado" };
  return {
    title: `${template.name} — Blueprint WX`,
    description: template.tagline,
    openGraph: {
      title: `${template.name} — Blueprint WX`,
      description: template.tagline,
      siteName: "WX Blueprints",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${template.name} — WX Blueprints`,
      description: template.tagline,
    },
  };
};

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = templates.find((item) => item.slug === slug);
  if (!template) notFound();
  const videoUrl = template.preview_video_url || getTemplateVideoUrl(slug);

  const isFree = template.tier === "free";
  const related = templates
    .filter((item) => item.slug !== template.slug && (item.niche === template.niche || item.tier === template.tier))
    .slice(0, 3);

  const tierColor = isFree ? "#22c55e" : "#c9a84c";
  const tierLabel = isFree ? "Gratuito" : "Premium";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse at 20% 0%, ${template.colors.primary}20 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, ${template.colors.accent}18 0%, transparent 55%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-24">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          <Link href="/blueprints" className="transition-colors hover:text-white/65">
            Blueprints
          </Link>
          <span>›</span>
          <span className="text-white/55">{template.niche}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{
              backgroundColor: `${tierColor}22`,
              color: tierColor,
              border: `1px solid ${tierColor}44`,
            }}
          >
            {tierLabel}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/50">
            {template.niche}
          </span>
          <span className="flex items-center gap-0.5 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50">
            {Array.from({ length: template.quality_score }).map((_, i) => (
              <span key={i} className="text-[#c9a84c]">★</span>
            ))}
          </span>
        </div>

        <h1 className="mt-5 font-[var(--font-oswald)] text-[clamp(2.6rem,6vw,5rem)] font-bold uppercase leading-[0.95] tracking-tight">
          {template.name}
        </h1>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-white/60">
          {template.tagline}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {template.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/[0.07] px-2.5 py-1 text-[11px] text-white/45"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={template.deploy_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Ver preview ao vivo ↗
          </a>
          {!isFree && (
            <Link
              href="/planos"
              className="rounded-md border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-6 py-3 text-sm font-semibold text-[#c9a84c] transition-colors hover:bg-[#c9a84c]/20"
            >
              Desbloquear por R$29/mês →
            </Link>
          )}
        </div>

        {videoUrl && (
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-black">
            <div className="relative aspect-video w-full">
              <BlueprintVideo src={videoUrl} />
            </div>
          </div>
        )}

        <section className="mt-14 rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Conceito</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">Sobre o projeto</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {template.blueprint?.concept ?? "Blueprint em preparação."}
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Identidade visual</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">Paleta</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {Object.entries(template.colors).map(([role, color]) => (
              <div
                key={role}
                className="rounded-xl border border-white/[0.07] bg-black/30 p-3"
              >
                <div
                  className="h-14 rounded-lg border border-white/[0.06]"
                  style={{ backgroundColor: color }}
                />
                <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/35">{role}</p>
                <p className="text-sm text-white/70">{color}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Display</p>
              <p className="mt-1 font-[var(--font-oswald)] text-2xl">{template.fonts.display}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-black/30 p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">Corpo</p>
              <p className="mt-1 text-lg">{template.fonts.body}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Entregáveis</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">O que está incluído</h2>
          <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
            {[
              { ok: true, text: "Preview ao vivo do projeto publicado" },
              { ok: true, text: "Conceito de design + paleta + tipografia" },
              { ok: isFree, text: "Prompt universal mestre" },
              { ok: isFree, text: "Mapa de seções detalhado" },
              { ok: isFree, text: "Especificação de implementação + animações" },
              { ok: isFree, text: "Lista de assets necessários" },
              { ok: isFree, text: "Checklist de QA para fidelidade visual" },
              { ok: isFree, text: "Nota de personalização por nicho" },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2.5 text-sm">
                <span style={{ color: item.ok ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                  {item.ok ? "✓" : "🔒"}
                </span>
                <span className={item.ok ? "text-white/65" : "text-white/35"}>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#111111] p-7">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#00d4ff]">Blueprint completo</p>
          <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">
            Pacote técnico
          </h2>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
            Versão: {template.blueprint?.version ?? "v1.0 · Abril 2026"}
          </p>

          {isFree ? (
            <div className="mt-6 space-y-6">
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Mapa de seções
                </h3>
                <ul className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-white/60">
                  {template.blueprint?.sections_map?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Implementação
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-white/60">
                  {template.blueprint?.implementation_spec?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Animações
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-white/60">
                  {template.blueprint?.animations_spec?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              {template.blueprint?.universal_prompt && (
                <UniversalPromptBox prompt={template.blueprint.universal_prompt} />
              )}
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Assets necessários
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-white/60">
                  {template.blueprint?.assets_references?.map((item) => (
                    <li key={item.description}>
                      <span
                        className="mr-2 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.15em]"
                        style={{
                          backgroundColor: item.required ? "#ef444422" : "rgba(255,255,255,0.06)",
                          color: item.required ? "#ef4444" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {item.required ? "Obrigatório" : "Opcional"}
                      </span>
                      {item.type}: {item.description}
                    </li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Checklist de QA
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-white/60">
                  {template.blueprint?.qa_checklist?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3 className="text-[11px] uppercase tracking-[0.25em] text-white/35">
                  Nota de personalização
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {template.blueprint?.customization_notes}
                </p>
              </article>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-[#c9a84c]/40 bg-[#c9a84c]/5 p-6">
              <div className="relative overflow-hidden rounded-lg border border-white/[0.07] bg-black/40 p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#111111]/80 to-[#111111]" />
                <p className="blur-[4px]">
                  {template.blueprint?.universal_prompt?.slice(0, 400) ||
                    "Prompt completo, mapa de seção e notas de customização ficam visíveis para membros premium."}
                </p>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-[#c9a84c]">
                🔒 Conteúdo premium — assine para desbloquear este blueprint e todos os próximos.
              </p>
              <Link
                href="/planos"
                className="mt-5 inline-block rounded-md bg-[#c9a84c] px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                Desbloquear por R$29/mês →
              </Link>
            </div>
          )}
        </section>

        {template.repo_url && (
          <TemplateRepoAccess
            repoUrl={template.repo_url}
            repoAccess={template.repo_access}
            templateName={template.name}
          />
        )}

        {related.length > 0 && (
          <section className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/30">Explore também</p>
            <h2 className="mt-2 font-[var(--font-oswald)] text-3xl font-bold uppercase">
              Blueprints relacionados
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blueprints/${item.slug}`}
                  className="group rounded-2xl border border-white/[0.07] bg-[#111111] p-5 transition-colors hover:border-white/[0.14]"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{item.niche}</p>
                  <h3 className="mt-2 font-[var(--font-oswald)] text-2xl uppercase leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-white/45">{item.tagline}</p>
                  <span className="mt-4 inline-block text-xs text-[#00d4ff] transition-opacity group-hover:opacity-80">
                    Ver blueprint →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
