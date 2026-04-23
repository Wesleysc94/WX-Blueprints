import { requireAuth } from "@/lib/firebase/auth-server";
import { getAdminDb, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { cancelAsaasSubscription } from "@/lib/asaas/client";
import { getUserDocument } from "@/lib/access/server";
import { AppError, toApiErrorPayload } from "@/lib/utils/errors";

export const POST = async (request: Request): Promise<Response> => {
  try {
    if (!hasFirebaseAdminConfig()) {
      throw new AppError(
        "Firebase Admin não configurado.",
        "FIREBASE_ADMIN_NOT_CONFIGURED",
        503,
      );
    }

    const auth = await requireAuth(request);
    const user = await getUserDocument(auth.uid);
    if (!user) {
      throw new AppError("Usuário não encontrado.", "USER_NOT_FOUND", 404);
    }

    if (user.plan === "founding_lifetime" && user.subscriptionStatus === "lifetime") {
      throw new AppError(
        "O acesso vitalício não pode ser cancelado.",
        "LIFETIME_NOT_CANCELABLE",
        400,
      );
    }

    const subscriptionId = user.billing?.asaasSubscriptionId;
    if (!subscriptionId) {
      throw new AppError(
        "Nenhuma assinatura ativa encontrada.",
        "SUBSCRIPTION_NOT_FOUND",
        404,
      );
    }

    await cancelAsaasSubscription(subscriptionId);

    const nowIso = new Date().toISOString();
    await getAdminDb().collection("users").doc(auth.uid).set(
      {
        subscriptionStatus: "canceled",
        updatedAt: nowIso,
        billing: {
          ...(user.billing || {}),
          asaasSubscriptionStatus: "INACTIVE",
        },
      },
      { merge: true },
    );

    return Response.json({ ok: true });
  } catch (error) {
    const { status, body } = toApiErrorPayload(error);
    return Response.json(body, { status });
  }
};
