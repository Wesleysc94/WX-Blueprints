import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/firebase/auth-server";
import { ensureUserDocument, getUserDocument } from "@/lib/access/server";
import { toApiErrorPayload } from "@/lib/utils/errors";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getBaseAppUrl } from "@/lib/asaas/client";
import { sendTransactionalEmail } from "@/lib/email/client";
import { WelcomeEmail } from "@/lib/email/templates";
import { getClientKey, rateLimit } from "@/lib/utils/rate-limit";

export async function POST(request: Request) {
  try {
    rateLimit({ key: getClientKey(request, "auth-sync"), limit: 20, windowMs: 60_000 });
    const auth = await requireAuth(request);
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      name?: string;
      locale?: string;
    };

    const email = auth.email || body.email || "";
    if (!email) {
      return NextResponse.json(
        { error: "Usuário sem email válido.", code: "EMAIL_REQUIRED" },
        { status: 400 },
      );
    }

    const locale: Locale | undefined = isLocale(body.locale) ? body.locale : undefined;
    const existed = Boolean(await getUserDocument(auth.uid));

    const user = await ensureUserDocument({
      uid: auth.uid,
      email,
      name: body.name || auth.name,
      locale,
    });

    if (!existed) {
      const appUrl = getBaseAppUrl(request) || "https://wxblueprints.com";
      const displayName = user.name || email.split("@")[0] || "Membro";
      await sendTransactionalEmail({
        to: email,
        subject: "Bem-vindo ao WX Blueprints",
        template: WelcomeEmail({ name: displayName, appUrl }),
        tags: [{ name: "type", value: "welcome" }],
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.name || null,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
      },
    });
  } catch (error) {
    const payload = toApiErrorPayload(error);
    return NextResponse.json(payload.body, { status: payload.status });
  }
}
