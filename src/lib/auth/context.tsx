"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, hasFirebaseClientConfig } from "@/lib/firebase/client";
import {
  devSignIn,
  devSignInWithGoogleStub,
  devSignOut,
  devSignUp,
  getDevSession,
  isDevAuthEnabled,
  makeDevToken,
  type DevUser,
} from "./dev-mock";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  getIdToken: (force?: boolean) => Promise<string>;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  ready: boolean;
  devMode: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthUser>;
  signUpWithEmail: (params: { email: string; password: string; name: string }) => Promise<AuthUser>;
  signInWithGoogle: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  getIdToken: (force?: boolean) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const wrapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  getIdToken: (force?: boolean) => user.getIdToken(force),
});

const wrapDevUser = (dev: DevUser): AuthUser => ({
  uid: dev.uid,
  email: dev.email,
  displayName: dev.displayName,
  getIdToken: async () =>
    makeDevToken({ uid: dev.uid, email: dev.email, name: dev.displayName || undefined }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const devMode = isDevAuthEnabled();
  const configured = hasFirebaseClientConfig();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(configured || devMode);

  /* eslint-disable react-hooks/set-state-in-effect --
     Sync com sistemas externos (localStorage dev-mock / Firebase Auth SDK).
     setState aqui é intencional — refletindo estado externo no React. */
  useEffect(() => {
    if (devMode) {
      const session = getDevSession();
      setUser(session ? wrapDevUser(session) : null);
      setLoading(false);
      return;
    }
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = onIdTokenChanged(getFirebaseAuth(), (next) => {
      setUser(next ? wrapFirebaseUser(next) : null);
      setLoading(false);
    });
    return unsub;
  }, [configured, devMode]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      if (devMode) {
        const dev = devSignIn({ email, password });
        const wrapped = wrapDevUser(dev);
        setUser(wrapped);
        return wrapped;
      }
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      return wrapFirebaseUser(credential.user);
    },
    [devMode],
  );

  const signUpWithEmail = useCallback(
    async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }): Promise<AuthUser> => {
      if (devMode) {
        const dev = devSignUp({ email, password, name });
        const wrapped = wrapDevUser(dev);
        setUser(wrapped);
        return wrapped;
      }
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      return wrapFirebaseUser(credential.user);
    },
    [devMode],
  );

  const signInWithGoogle = useCallback(async (): Promise<AuthUser> => {
    if (devMode) {
      const email = window.prompt(
        "Dev mode: informe seu email para entrar com Google (sem senha):",
      );
      if (!email) throw Object.assign(new Error("Cancelado"), { code: "auth/popup-closed-by-user" });
      const name = email.split("@")[0] || "Membro";
      const dev = devSignInWithGoogleStub(email, name);
      const wrapped = wrapDevUser(dev);
      setUser(wrapped);
      return wrapped;
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(getFirebaseAuth(), provider);
    return wrapFirebaseUser(credential.user);
  }, [devMode]);

  const handleSignOut = useCallback(async () => {
    if (devMode) {
      devSignOut();
      setUser(null);
      return;
    }
    await signOut(getFirebaseAuth());
  }, [devMode]);

  const sendResetEmail = useCallback(
    async (email: string) => {
      if (devMode) {
        return;
      }
      await sendPasswordResetEmail(getFirebaseAuth(), email);
    },
    [devMode],
  );

  const getIdToken = useCallback(
    async (force = false) => {
      if (!user) return null;
      return user.getIdToken(force);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      ready: !loading,
      devMode,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut: handleSignOut,
      sendResetEmail,
      getIdToken,
    }),
    [
      user,
      loading,
      devMode,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      handleSignOut,
      sendResetEmail,
      getIdToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
