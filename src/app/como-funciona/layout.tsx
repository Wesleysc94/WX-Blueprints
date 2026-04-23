import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Como funciona",
  description:
    "Do blueprint ao site no ar em quatro passos: escolha, copie o prompt, rode na ferramenta de AI coding e publique.",
  alternates: { canonical: "/como-funciona" },
};

export default function ComoFuncionaLayout({ children }: { children: ReactNode }) {
  return children;
}
