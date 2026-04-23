"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import type { Template } from "@/data/templates";

interface TemplateCardProps {
  template: Template;
}

function CardPreview({ template }: { template: Template }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const hasVideo = Boolean(template.preview_video_url);

  useEffect(() => {
    if (!hasVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setVideoReady(true);
    video.addEventListener("loadeddata", onLoaded);
    return () => video.removeEventListener("loadeddata", onLoaded);
  }, [hasVideo]);

  const tierColor = template.tier === "free" ? "#22c55e" : "#c9a84c";
  const badgeLabel = template.tier === "free" ? "FREE" : "PREMIUM";

  return (
    <div
      className="relative aspect-video overflow-hidden rounded-xl"
      style={{
        background: `radial-gradient(circle at 20% 25%, ${template.colors.primary}30 0%, transparent 55%), radial-gradient(circle at 80% 75%, ${template.colors.accent}20 0%, transparent 50%), ${template.colors.background}`,
      }}
    >
      {hasVideo && (
        <video
          ref={videoRef}
          src={template.preview_video_url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: videoReady ? 1 : 0 }}
        />
      )}

      {!videoReady && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="select-none font-[var(--font-oswald)] text-5xl font-bold uppercase opacity-[0.08]"
              style={{ color: template.colors.primary }}
            >
              {template.name.split(" ")[0]}
            </p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        </>
      )}

      <div className="absolute left-3 top-3">
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
          style={{
            backgroundColor: `${tierColor}22`,
            color: tierColor,
            border: `1px solid ${tierColor}44`,
          }}
        >
          {badgeLabel}
        </span>
      </div>

      <div className="absolute bottom-3 right-3">
        <div className="flex gap-1">
          {Array.from({ length: template.quality_score }).map((_, i) => (
            <span key={i} className="text-[8px] text-white/30">★</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[#111111] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-colors hover:border-white/[0.12]">
      <CardPreview template={template} />

      <div className="mt-4 flex-1 px-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-[var(--font-oswald)] text-[1.3rem] font-semibold uppercase tracking-wide leading-tight">
              {template.name}
            </h3>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-white/35">
              {template.niche}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/45">
          {template.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.stack.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/[0.07] px-2.5 py-0.5 text-[10px] text-white/35"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] px-1 pt-4">
        <a
          href={template.deploy_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-white/25 transition-colors hover:text-white/50"
          onClick={(e) => e.stopPropagation()}
        >
          Preview ao vivo ↗
        </a>
        <Link
          href={`/blueprints/${template.slug}`}
          className="rounded-full bg-[#00d4ff] px-4 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
        >
          Ver blueprint →
        </Link>
      </div>
    </article>
  );
}
