"use client";

import { useEffect, type ReactNode } from "react";
import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

const apiKey =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  process.env.NEXT_PUBLIC_POSTHOG_API_KEY ||
  "";
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

const ensureInit = () => {
  if (initialized || !apiKey || typeof window === "undefined") return;
  posthog.init(apiKey, {
    api_host: apiHost,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") ph.debug(false);
    },
  });
  initialized = true;
};

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    ensureInit();
  }, []);
  return <>{children}</>;
}

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (!apiKey || typeof window === "undefined") return;
    ensureInit();
    if (user?.uid) {
      posthog.identify(user.uid, {
        email: user.email || undefined,
        name: user.displayName || undefined,
      });
    }
  }, [user?.uid, user?.email, user?.displayName]);

  useEffect(() => {
    if (!apiKey || typeof window === "undefined" || !initialized) return;
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export const captureEvent = (event: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture(event, properties);
};
