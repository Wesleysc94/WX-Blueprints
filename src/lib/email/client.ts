import "server-only";
import { Resend } from "resend";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const getResend = (): Resend | null => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export const getFromAddress = (): string =>
  process.env.EMAIL_FROM_ADDRESS || "WX Blueprints <contato@wxblueprints.com>";

export const getReplyToAddress = (): string | undefined =>
  process.env.EMAIL_REPLY_TO || undefined;

export const getAdminNotifyAddress = (): string =>
  process.env.ADMIN_EMAIL || "wxdigitalstudio@gmail.com";

interface SendEmailArgs {
  to: string | string[];
  subject: string;
  template: ReactElement;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export const sendTransactionalEmail = async ({
  to,
  subject,
  template,
  replyTo,
  tags,
}: SendEmailArgs): Promise<{ sent: boolean; reason?: string }> => {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "RESEND_NOT_CONFIGURED" };

  const html = await render(template);
  const text = await render(template, { plainText: true });

  try {
    await resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      html,
      text,
      replyTo: replyTo || getReplyToAddress(),
      tags,
    });
    return { sent: true };
  } catch (error) {
    console.error("[email] send failed", error);
    return { sent: false, reason: error instanceof Error ? error.message : "UNKNOWN" };
  }
};
