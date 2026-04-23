import { AppError } from "@/lib/utils/errors";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export const rateLimit = ({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) => {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (existing.count >= limit) {
    const retry = Math.ceil((existing.resetAt - now) / 1000);
    throw new AppError(
      `Muitas requisições. Tente novamente em ${retry}s.`,
      "RATE_LIMITED",
      429,
    );
  }
  existing.count += 1;
};

export const getClientKey = (request: Request, prefix: string): string => {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
};
