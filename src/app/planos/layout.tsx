import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Planos e preços",
  description:
    "Gratuito, Premium R$29/mês (ou R$247/ano) e Founding Lifetime R$397 (100 vagas). Pagamento via Pix ou cartão.",
  alternates: { canonical: "/planos" },
};

export default function PlanosLayout({ children }: { children: ReactNode }) {
  return children;
}
