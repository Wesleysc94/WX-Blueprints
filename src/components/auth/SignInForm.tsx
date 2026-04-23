"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";
import { useT } from "@/lib/i18n/context";
import { mapAuthError } from "@/lib/auth/client-errors";
import { syncUserProfile } from "@/lib/auth/post-login";
import { AuthLayout } from "./AuthLayout";
import { FormField } from "./FormField";
import { GoogleButton } from "./GoogleButton";

export function SignInForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("from") || "/painel";
  const { user, ready, signInWithEmail, signInWithGoogle, sendResetEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(redirect);
  }, [ready, user, router, redirect]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      const signedIn = await signInWithEmail(email.trim(), password);
      await syncUserProfile(signedIn);
      router.replace(redirect);
    } catch (error) {
      toast.error(t(mapAuthError(error)));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setSubmitting(true);
    try {
      const signedIn = await signInWithGoogle();
      await syncUserProfile(signedIn);
      router.replace(redirect);
    } catch (error) {
      toast.error(t(mapAuthError(error)));
    } finally {
      setSubmitting(false);
    }
  };

  const onForgot = async () => {
    if (!email) {
      toast.info(t("auth.email"));
      return;
    }
    try {
      await sendResetEmail(email.trim());
      toast.success("Email de redefinição enviado.");
    } catch (error) {
      toast.error(t(mapAuthError(error)));
    }
  };

  return (
    <AuthLayout
      title={t("auth.sign_in_title")}
      footer={
        <p className="text-center text-sm text-white/50">
          <Link href="/criar-conta" className="text-[#00d4ff] transition-opacity hover:opacity-80">
            {t("auth.sign_up_switch")}
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <GoogleButton onClick={onGoogle} disabled={submitting}>
          {t("auth.google_continue")}
        </GoogleButton>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/25">
          <span className="h-px flex-1 bg-white/10" />
          <span>{t("auth.divider")}</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <FormField
          label={t("auth.email")}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormField
          label={t("auth.password")}
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          trailing={
            <button
              type="button"
              onClick={onForgot}
              className="text-[10px] font-medium text-white/35 transition-colors hover:text-white/70"
            >
              {t("auth.forgot_password")}
            </button>
          }
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-xl bg-[#00d4ff] text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "…" : t("auth.sign_in_submit")}
        </button>
      </form>
    </AuthLayout>
  );
}
