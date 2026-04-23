import { requireAuth } from "@/lib/firebase/auth-server";
import { ensureUserDocument, getUserDocument } from "@/lib/access/server";
import { deriveUserAccess } from "@/lib/access";
import { toApiErrorPayload } from "@/lib/utils/errors";

export const GET = async (request: Request): Promise<Response> => {
  try {
    const auth = await requireAuth(request);
    let user = await getUserDocument(auth.uid);
    if (!user) {
      user = await ensureUserDocument({
        uid: auth.uid,
        email: auth.email,
        name: auth.name,
      });
    }
    const access = deriveUserAccess(user);
    return Response.json({ user, access });
  } catch (error) {
    const { status, body } = toApiErrorPayload(error);
    return Response.json(body, { status });
  }
};
