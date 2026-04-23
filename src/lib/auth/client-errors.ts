import type { DictKey } from "@/lib/i18n/dict";

const MAP: Record<string, DictKey> = {
  "auth/invalid-credential": "errors.invalid_credentials",
  "auth/user-not-found": "errors.invalid_credentials",
  "auth/wrong-password": "errors.invalid_credentials",
  "auth/invalid-email": "errors.email_invalid",
  "auth/weak-password": "errors.password_short",
  "auth/email-already-in-use": "errors.invalid_credentials",
};

export const mapAuthError = (error: unknown): DictKey => {
  const code = (error as { code?: string })?.code;
  if (code && MAP[code]) return MAP[code];
  return "errors.generic";
};
