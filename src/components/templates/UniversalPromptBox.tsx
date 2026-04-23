"use client";

import { useState } from "react";

interface UniversalPromptBoxProps {
  prompt: string;
}

export function UniversalPromptBox({ prompt }: UniversalPromptBoxProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm uppercase tracking-wider text-[var(--text-secondary)]">Prompt universal mestre</h3>
        <button onClick={onCopy} className="rounded-md border border-[var(--border-subtle)] px-3 py-1 text-xs">
          {copied ? "Copiado" : "Copiar prompt"}
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto rounded-md border border-[var(--border-subtle)] bg-[var(--bg-base)] p-4 text-sm whitespace-pre-wrap">
        {prompt}
      </pre>
    </article>
  );
}
