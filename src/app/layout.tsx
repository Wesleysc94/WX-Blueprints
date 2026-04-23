import type { Metadata } from "next";
import { Suspense } from "react";
import { Barlow, Oswald } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { PostHogProvider, PostHogPageView } from "@/lib/analytics/posthog";
import { getLocaleFromCookies } from "@/lib/i18n/server";
import { Toaster } from "sonner";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blueprints.wxdigitalstudio.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WX Blueprints — Biblioteca de replicação premium",
    template: "%s · WX Blueprints",
  },
  description:
    "Blueprints técnicos completos para recriar sites premium reais com AI coding. Funciona no Lovable, Bolt, Cursor e Claude.",
  keywords: [
    "AI coding",
    "Lovable",
    "Bolt",
    "Cursor",
    "blueprint",
    "templates",
    "sites premium",
    "freelancer",
  ],
  authors: [{ name: "WX Digital Studio" }],
  openGraph: {
    title: "WX Blueprints",
    description: "Sites premium. Blueprints prontos. Recrie com IA.",
    siteName: "WX Blueprints",
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "WX Blueprints",
    description: "Sites premium. Blueprints prontos. Recrie com IA.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromCookies();

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <I18nProvider initialLocale={locale}>
          <AuthProvider>
            <PostHogProvider>
              <Suspense fallback={null}>
                <PostHogPageView />
              </Suspense>
              <Navbar />
              {children}
              <Footer />
              <Toaster theme="dark" position="top-center" richColors />
            </PostHogProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
