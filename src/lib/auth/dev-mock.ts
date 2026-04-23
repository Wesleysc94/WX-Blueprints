/**
 * Dev-only mock auth.
 *
 * Ativado automaticamente quando Firebase client não está configurado
 * (API keys vazias em .env.local). Permite criar conta, logar e navegar
 * sem credenciais Firebase para testes locais. NÃO use em produção.
 */

import { hasFirebaseClientConfig } from "@/lib/firebase/client";

export const isDevAuthEnabled = (): boolean => {
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true") return true;
  if (process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "false") return false;
  return !hasFirebaseClientConfig();
};

export interface DevUser {
  uid: string;
  email: string;
  displayName: string | null;
  passwordHash: string;
  createdAt: string;
}

export interface DevToken {
  uid: string;
  email: string;
  name?: string;
  exp: number;
}

const STORAGE_KEY = "wx_dev_users";
const SESSION_KEY = "wx_dev_session";
const TOKEN_PREFIX = "dev:";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const encode = (value: string): string => {
  if (typeof window !== "undefined") return window.btoa(unescape(encodeURIComponent(value)));
  return Buffer.from(value, "utf-8").toString("base64");
};

const decode = (value: string): string => {
  if (typeof window !== "undefined") return decodeURIComponent(escape(window.atob(value)));
  return Buffer.from(value, "base64").toString("utf-8");
};

const hashPassword = (password: string): string => {
  let h = 5381;
  for (let i = 0; i < password.length; i++) h = ((h << 5) + h + password.charCodeAt(i)) | 0;
  return `dev-${(h >>> 0).toString(36)}`;
};

const uidFromEmail = (email: string): string => {
  const normalized = email.trim().toLowerCase();
  let h = 0;
  for (let i = 0; i < normalized.length; i++) h = (h * 31 + normalized.charCodeAt(i)) | 0;
  return `dev-${(h >>> 0).toString(36)}`;
};

export const makeDevToken = (user: { uid: string; email: string; name?: string }): string => {
  const payload: DevToken = {
    uid: user.uid,
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  return TOKEN_PREFIX + encode(JSON.stringify(payload));
};

export const parseDevToken = (token: string): DevToken | null => {
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  try {
    const payload = JSON.parse(decode(token.slice(TOKEN_PREFIX.length))) as DevToken;
    if (!payload.uid || !payload.email) return null;
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

export const isDevToken = (token: string): boolean => token.startsWith(TOKEN_PREFIX);

const readUsers = (): Record<string, DevUser> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, DevUser>) : {};
  } catch {
    return {};
  }
};

const writeUsers = (users: Record<string, DevUser>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const devSignUp = ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): DevUser => {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  if (users[normalized]) {
    const err: Error & { code?: string } = new Error("Conta já existe com esse email.");
    err.code = "auth/email-already-in-use";
    throw err;
  }
  const user: DevUser = {
    uid: uidFromEmail(normalized),
    email: normalized,
    displayName: name || null,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users[normalized] = user;
  writeUsers(users);
  writeSession(user);
  return user;
};

const isAdminDevEmail = (email: string): boolean => {
  const list = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
};

export const devSignIn = ({
  email,
  password,
}: {
  email: string;
  password: string;
}): DevUser => {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  let user = users[normalized];
  if (!user && isAdminDevEmail(normalized)) {
    user = {
      uid: uidFromEmail(normalized),
      email: normalized,
      displayName: normalized.split("@")[0] || "Admin",
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    users[normalized] = user;
    writeUsers(users);
  }
  if (!user) {
    const err: Error & { code?: string } = new Error("Email ou senha inválidos.");
    err.code = "auth/invalid-credential";
    throw err;
  }
  if (isAdminDevEmail(normalized) && user.passwordHash !== hashPassword(password)) {
    user = { ...user, passwordHash: hashPassword(password) };
    users[normalized] = user;
    writeUsers(users);
  } else if (user.passwordHash !== hashPassword(password)) {
    const err: Error & { code?: string } = new Error("Email ou senha inválidos.");
    err.code = "auth/invalid-credential";
    throw err;
  }
  writeSession(user);
  return user;
};

export const devSignInWithGoogleStub = (email: string, name?: string): DevUser => {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  let user = users[normalized];
  if (!user) {
    user = {
      uid: uidFromEmail(normalized),
      email: normalized,
      displayName: name || normalized.split("@")[0] || "Membro",
      passwordHash: "google-stub",
      createdAt: new Date().toISOString(),
    };
    users[normalized] = user;
    writeUsers(users);
  }
  writeSession(user);
  return user;
};

export const devSignOut = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const getDevSession = (): DevUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DevUser) : null;
  } catch {
    return null;
  }
};

const writeSession = (user: DevUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const devSendResetStub = async () => {
  return;
};
