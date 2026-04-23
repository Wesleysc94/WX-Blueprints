import "server-only";
import { AppError } from "@/lib/utils/errors";
import { ASAAS_WEBHOOK_EVENTS } from "./events";
import type {
  AsaasCheckoutSession,
  AsaasCustomer,
  AsaasEnvironment,
  AsaasSubscription,
  AsaasWebhookConfig,
} from "./types";

const sanitizeEnvSecret = (value = ""): string =>
  String(value || "")
    .replace(/\\r\\n/g, "")
    .replace(/\\n/g, "")
    .replace(/\\r/g, "")
    .trim();

export const getAsaasEnvironment = (): AsaasEnvironment =>
  (process.env.ASAAS_ENVIRONMENT === "production" ? "production" : "sandbox");

export const getAsaasBaseUrl = (): string => {
  if (process.env.ASAAS_API_BASE_URL) return process.env.ASAAS_API_BASE_URL;
  return getAsaasEnvironment() === "sandbox"
    ? "https://api-sandbox.asaas.com/v3"
    : "https://api.asaas.com/v3";
};

export const getAsaasCheckoutHost = (): string =>
  process.env.ASAAS_CHECKOUT_HOST || "https://asaas.com/checkoutSession/show";

export const getAsaasWebhookToken = (): string =>
  sanitizeEnvSecret(process.env.ASAAS_WEBHOOK_TOKEN || "");

export const getAsaasApiKey = (): string => {
  const apiKey = sanitizeEnvSecret(process.env.ASAAS_API_KEY || "");
  if (!apiKey) {
    throw new AppError(
      "A integração com o Asaas ainda não foi configurada.",
      "ASAAS_NOT_CONFIGURED",
      503,
    );
  }
  return apiKey;
};

export const getBaseAppUrl = (request?: Request): string => {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (request) {
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  }
  return "";
};

interface AsaasRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export const asaasRequest = async <T = unknown>(
  path: string,
  options: AsaasRequestOptions = {},
): Promise<T> => {
  const apiKey = getAsaasApiKey();
  const method = options.method || "GET";

  const qs = options.query
    ? new URLSearchParams(
        Object.entries(options.query)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";

  const url = `${getAsaasBaseUrl()}${path}${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      access_token: apiKey,
      ...(options.headers || {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const raw = await response.text();
  let data: unknown = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }
  }

  if (!response.ok) {
    const errorBody = data as { errors?: Array<{ description?: string }>; message?: string };
    const message =
      errorBody?.errors?.[0]?.description ||
      errorBody?.message ||
      "Não foi possível concluir a operação no Asaas.";
    throw new AppError(message, "ASAAS_REQUEST_FAILED", response.status, data);
  }

  return data as T;
};

interface EnsureCustomerArgs {
  customerId?: string;
  name: string;
  email?: string;
  cpf?: string;
  phone?: string;
}

export const ensureAsaasCustomer = async ({
  customerId,
  name,
  email,
  cpf,
  phone,
}: EnsureCustomerArgs): Promise<AsaasCustomer> => {
  const payload = {
    name,
    ...(cpf ? { cpfCnpj: cpf } : {}),
    ...(email ? { email } : {}),
    ...(phone ? { mobilePhone: phone, phone } : {}),
  };

  if (customerId) {
    try {
      return await asaasRequest<AsaasCustomer>(`/customers/${customerId}`, {
        method: "PUT",
        body: payload,
      });
    } catch (error) {
      if (!(error instanceof AppError) || error.statusCode !== 404) throw error;
    }
  }

  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: payload,
  });
};

interface CheckoutCallbacks {
  successUrl: string;
  cancelUrl?: string;
  expiredUrl?: string;
}

interface CreateSubscriptionCheckoutArgs {
  customerId: string;
  value: number;
  cycle: "MONTHLY" | "YEARLY";
  description: string;
  nextDueDate?: string;
  billingTypes?: Array<"CREDIT_CARD" | "PIX" | "BOLETO">;
  callbacks: CheckoutCallbacks;
  externalReference?: string;
}

export const createSubscriptionCheckout = async ({
  customerId,
  value,
  cycle,
  description,
  nextDueDate,
  billingTypes,
  callbacks,
  externalReference,
}: CreateSubscriptionCheckoutArgs): Promise<AsaasCheckoutSession> => {
  const today = new Date();
  const dueDate =
    nextDueDate ||
    new Date(today.getTime() + 60 * 60 * 1000).toISOString().slice(0, 10);

  return asaasRequest<AsaasCheckoutSession>("/checkouts", {
    method: "POST",
    body: {
      billingTypes: billingTypes || ["CREDIT_CARD", "PIX"],
      chargeTypes: ["RECURRENT"],
      minutesToExpire: 60,
      customer: customerId,
      subscription: {
        cycle,
        value,
        description,
        nextDueDate: dueDate,
      },
      callback: {
        successUrl: callbacks.successUrl,
        cancelUrl: callbacks.cancelUrl,
        expiredUrl: callbacks.expiredUrl,
      },
      ...(externalReference ? { externalReference } : {}),
    },
  });
};

interface CreateOneTimeCheckoutArgs {
  customerId: string;
  value: number;
  description: string;
  dueDate?: string;
  billingTypes?: Array<"CREDIT_CARD" | "PIX" | "BOLETO">;
  callbacks: CheckoutCallbacks;
  externalReference?: string;
}

export const createOneTimeCheckout = async ({
  customerId,
  value,
  description,
  dueDate,
  billingTypes,
  callbacks,
  externalReference,
}: CreateOneTimeCheckoutArgs): Promise<AsaasCheckoutSession> => {
  const target =
    dueDate ||
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return asaasRequest<AsaasCheckoutSession>("/checkouts", {
    method: "POST",
    body: {
      billingTypes: billingTypes || ["CREDIT_CARD", "PIX"],
      chargeTypes: ["DETACHED"],
      minutesToExpire: 60,
      customer: customerId,
      items: [
        {
          name: description,
          description,
          value,
          quantity: 1,
        },
      ],
      dueDateLimitDays: 3,
      value,
      dueDate: target,
      callback: {
        successUrl: callbacks.successUrl,
        cancelUrl: callbacks.cancelUrl,
        expiredUrl: callbacks.expiredUrl,
      },
      ...(externalReference ? { externalReference } : {}),
    },
  });
};

export const cancelAsaasSubscription = async (
  subscriptionId: string,
): Promise<AsaasSubscription> =>
  asaasRequest<AsaasSubscription>(`/subscriptions/${subscriptionId}`, {
    method: "DELETE",
  });

export const getAsaasWebhookUrl = (request?: Request): string => {
  const base = getBaseAppUrl(request);
  return base ? `${base}/api/webhooks/asaas` : "";
};

export const getRequiredAsaasWebhookConfig = (params: {
  request?: Request;
  email: string;
}): AsaasWebhookConfig => ({
  name: "WX Blueprints Billing",
  url: getAsaasWebhookUrl(params.request),
  email: params.email,
  enabled: true,
  interrupted: false,
  authToken: getAsaasWebhookToken(),
  sendType: "SEQUENTIALLY",
  events: [...ASAAS_WEBHOOK_EVENTS],
});
