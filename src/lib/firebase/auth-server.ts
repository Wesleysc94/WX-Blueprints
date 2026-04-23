import "server-only";
import { getAdminAuth, hasFirebaseAdminConfig } from "./admin";
import { AppError } from "@/lib/utils/errors";
import { isDevToken, parseDevToken } from "@/lib/auth/dev-mock";

export interface AuthContext {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  token: string;
}

export const getBearerToken = (request: Request): string | null => {
  const header = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
};

export const verifyIdToken = async (token: string): Promise<AuthContext> => {
  if (isDevToken(token)) {
    const payload = parseDevToken(token);
    if (!payload) throw new AppError("Sessão inválida.", "AUTH_INVALID", 401);
    return {
      uid: payload.uid,
      email: payload.email,
      emailVerified: true,
      name: payload.name,
      token,
    };
  }

  if (!hasFirebaseAdminConfig()) {
    throw new AppError(
      "Firebase Admin não configurado no servidor.",
      "FIREBASE_ADMIN_NOT_CONFIGURED",
      503,
    );
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email || "",
      emailVerified: Boolean(decoded.email_verified),
      name: decoded.name,
      token,
    };
  } catch {
    throw new AppError("Sessão inválida.", "AUTH_INVALID", 401);
  }
};

export const requireAuth = async (request: Request): Promise<AuthContext> => {
  const token = getBearerToken(request);
  if (!token) {
    throw new AppError("Sessão necessária.", "AUTH_REQUIRED", 401);
  }
  return verifyIdToken(token);
};

export const tryAuth = async (request: Request): Promise<AuthContext | null> => {
  const token = getBearerToken(request);
  if (!token) return null;
  try {
    return await verifyIdToken(token);
  } catch {
    return null;
  }
};
