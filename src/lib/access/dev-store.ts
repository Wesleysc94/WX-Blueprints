import "server-only";
import { buildEmptyUserDocument } from "./index";
import type { UserDocument } from "./types";

declare global {
  var __wxDevUserStore: Map<string, UserDocument> | undefined;
}

const store: Map<string, UserDocument> =
  globalThis.__wxDevUserStore || (globalThis.__wxDevUserStore = new Map());

export const devGetUser = (uid: string): UserDocument | null => store.get(uid) || null;

export const devUpsertUser = (params: {
  uid: string;
  email: string;
  name?: string;
  locale?: "pt-BR" | "en";
}): UserDocument => {
  const existing = store.get(params.uid);
  if (existing) return existing;
  const doc = buildEmptyUserDocument(params);
  store.set(params.uid, doc);
  return doc;
};

export const devUpdateUser = (uid: string, patch: Partial<UserDocument>) => {
  const current = store.get(uid);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  store.set(uid, next);
  return next;
};

export const devClearUsers = () => store.clear();
