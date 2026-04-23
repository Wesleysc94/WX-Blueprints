import "server-only";
import admin from "firebase-admin";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

const databaseId =
  process.env.FIREBASE_FIRESTORE_DATABASE_ID || "(default)";

export const hasFirebaseAdminConfig = () =>
  Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);

class ConfigError extends Error {
  statusCode: number;
  code: string;
  constructor(message: string, code: string, statusCode = 503) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

interface ServiceAccountJson {
  project_id: string;
  client_email: string;
  private_key: string;
  [key: string]: unknown;
}

const parseServiceAccount = (): ServiceAccountJson => {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new ConfigError(
      "FIREBASE_SERVICE_ACCOUNT não configurado.",
      "FIREBASE_ADMIN_NOT_CONFIGURED",
    );
  }

  const parsed = JSON.parse(raw) as ServiceAccountJson;

  if (typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  return parsed;
};

export const getFirebaseAdminApp = (): admin.app.App => {
  if (admin.apps.length > 0 && admin.apps[0]) return admin.apps[0] as admin.app.App;
  return admin.initializeApp({
    credential: admin.credential.cert(parseServiceAccount() as admin.ServiceAccount),
  });
};

export const getAdminDb = (): Firestore => {
  const app = getFirebaseAdminApp();
  if (databaseId && databaseId !== "(default)") {
    return getFirestore(app, databaseId);
  }
  return getFirestore(app);
};

export const getAdminAuth = (): Auth => getAuth(getFirebaseAdminApp());
