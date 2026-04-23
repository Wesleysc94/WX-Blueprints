import { AppError } from "./errors";
import { normalizeEmail } from "./normalizers";

export const getAdminEmails = (): string[] => {
  const raw = process.env.ADMIN_EMAILS || "";
  if (!raw.trim()) return [];
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
};

export const isAdminEmail = (email: string): boolean =>
  getAdminEmails().includes(normalizeEmail(email));

export const requireAdminEmail = (email: string): void => {
  if (!isAdminEmail(email)) {
    throw new AppError(
      "Apenas administradores podem acessar este recurso.",
      "ADMIN_REQUIRED",
      403,
    );
  }
};
