"use client";

import type { AuthUser } from "./context";

export const syncUserProfile = async (user: AuthUser): Promise<void> => {
  const token = await user.getIdToken();
  await fetch("/api/auth/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: user.email,
      name: user.displayName,
    }),
  }).catch(() => null);
};
