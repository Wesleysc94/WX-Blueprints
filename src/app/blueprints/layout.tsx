import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catálogo de Blueprints",
  description:
    "Biblioteca de blueprints técnicos para AI coding: filtre por nicho, plano e stack. Preview ao vivo e prompts universais prontos para copiar.",
  alternates: { canonical: "/blueprints" },
};

export default function BlueprintsLayout({ children }: { children: ReactNode }) {
  return children;
}
