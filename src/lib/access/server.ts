import "server-only";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { buildEmptyUserDocument, deriveUserAccess } from "./index";
import { devGetUser, devUpsertUser } from "./dev-store";
import type { UserAccess, UserDocument } from "./types";

export const getUserDocument = async (uid: string): Promise<UserDocument | null> => {
  if (!hasFirebaseAdminConfig()) {
    return devGetUser(uid);
  }
  const snapshot = await getAdminDb().collection("users").doc(uid).get();
  if (!snapshot.exists) return null;
  return snapshot.data() as UserDocument;
};

export const ensureUserDocument = async (params: {
  uid: string;
  email: string;
  name?: string;
  locale?: "pt-BR" | "en";
}): Promise<UserDocument> => {
  if (!hasFirebaseAdminConfig()) {
    return devUpsertUser(params);
  }
  const db = getAdminDb();
  const ref = db.collection("users").doc(params.uid);
  const snapshot = await ref.get();
  if (snapshot.exists) return snapshot.data() as UserDocument;

  const doc = buildEmptyUserDocument(params);
  await ref.set(doc);
  return doc;
};

export const getUserAccess = async (uid: string): Promise<UserAccess> => {
  const user = await getUserDocument(uid);
  if (!user) {
    return deriveUserAccess({
      plan: "free",
      subscriptionStatus: "none",
      email: "",
    });
  }
  return deriveUserAccess(user);
};
