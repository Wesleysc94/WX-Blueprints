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

export function SignUpForm() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("from") || "/painel";
  const { user, ready, signUpWithEmail, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(redirect);
  }, [ready, user, router, redirect]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email || !password) return;
    if (password.length < 8) {
      toast.error(t("errors.password_short"));
      return;
    }

    setSubmitting(true);
    try {
      const signedUp = await signUpWithEmail({
        email: email.trim(),
        password,
        name: name.trim(),
      });
      await syncUserProfile(signedUp);
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
      const signedUp = await signInWithGoogle();
      await syncUserProfile(signedUp);
      router.replace(redirect);
    } catch (error) {
      toast.error(t(mapAuthError(error)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.sign_up_title")}
      subtitle="3 blueprints gratuitos incluídos. Sem cartão de crédito."
      footer={
        <p className="text-center text-sm text-white/50">
          <Link href="/entrar" className="text-[#00d4ff] transition-opacity hover:opacity-80">
            {t("auth.sign_in_switch")}
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
          label={t("auth.name")}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 rounded-xl bg-[#00d4ff] text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "…" : t("auth.sign_up_submit")}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-white/30">
          Ao criar conta você concorda com os{" "}
          <Link href="/termos" className="underline underline-offset-4 hover:text-white/60">
            termos
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" className="underline underline-offset-4 hover:text-white/60">
            política de privacidade
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
