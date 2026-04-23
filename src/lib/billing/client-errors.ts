/**
 * Traduz códigos de erro da API de billing (checkout/cancel/webhook) para
 * mensagens amigáveis em PT. Códigos vêm do AppError no servidor + mensagens
 * cruas do Asaas (normalmente já em PT, mas às vezes em EN ou genéricas).
 */

interface ApiErrorPayload {
  error?: string;
  code?: string;
}

const CODE_MAP: Record<string, string> = {
  // Infra / estado do sistema
  FIREBASE_ADMIN_NOT_CONFIGURED:
    "Pagamentos indisponíveis no momento. Tente novamente em alguns minutos.",
  ASAAS_NOT_CONFIGURED:
    "Integração de pagamento em manutenção. Volte em instantes ou fale com o suporte.",
  INTERNAL_ERROR:
    "Algo deu errado do nosso lado. Tente novamente — se persistir, nos avise pelo suporte.",

  // Auth
  AUTH_REQUIRED: "Faça login para continuar.",
  USER_NOT_FOUND: "Sua conta não foi encontrada. Entre novamente e tente outra vez.",

  // Plano / assinatura
  PLAN_INVALID: "Esse plano não está disponível. Recarregue a página e tente de novo.",
  LIFETIME_SOLD_OUT:
    "As 100 vagas Founding Lifetime foram preenchidas. Garanta o Premium e avise quando abrirmos vagas.",
  LIFETIME_NOT_CANCELABLE: "O acesso vitalício Founding não pode ser cancelado.",
  SUBSCRIPTION_NOT_FOUND: "Nenhuma assinatura ativa encontrada na sua conta.",
  VALIDATION_ERROR: "Confira os dados informados e tente novamente.",

  // Rate limit
  RATE_LIMITED: "Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.",

  // Asaas
  ASAAS_REQUEST_FAILED:
    "O gateway de pagamento recusou a operação. Confira CPF/e-mail e tente novamente.",
};

const ASAAS_MESSAGE_MAP: Array<[RegExp, string]> = [
  [/cpf.*inv/i, "CPF inválido. Confira os números e tente novamente."],
  [/email.*inv/i, "E-mail inválido. Verifique o endereço digitado."],
  [
    /customer.*not.*found/i,
    "Cadastro do cliente não encontrado no gateway. Atualize seus dados e tente novamente.",
  ],
  [
    /invalid.*billing.*type/i,
    "Forma de pagamento indisponível no momento. Tente Pix ou cartão.",
  ],
  [
    /subscription.*already/i,
    "Já existe uma assinatura ativa para essa conta. Verifique em 'Meu plano'.",
  ],
  [
    /duplicate|já.*existe/i,
    "Já existe uma operação igual em andamento. Aguarde alguns instantes.",
  ],
  [/network|fetch failed|timeout/i, "Falha de conexão com o gateway. Tente novamente."],
];

export const mapBillingError = (error: unknown, fallback = "Não foi possível concluir a operação."): string => {
  if (!error) return fallback;

  // AppError-ish payload vindo do fetch (`{ error, code }`)
  if (typeof error === "object") {
    const payload = error as ApiErrorPayload;
    if (payload.code && CODE_MAP[payload.code]) return CODE_MAP[payload.code];
    if (payload.error) {
      const hit = ASAAS_MESSAGE_MAP.find(([re]) => re.test(payload.error!));
      if (hit) return hit[1];
      return payload.error;
    }
  }

  if (error instanceof Error) {
    const hit = ASAAS_MESSAGE_MAP.find(([re]) => re.test(error.message));
    if (hit) return hit[1];
    return error.message || fallback;
  }

  if (typeof error === "string") {
    const hit = ASAAS_MESSAGE_MAP.find(([re]) => re.test(error));
    if (hit) return hit[1];
    return error;
  }

  return fallback;
};

/**
 * Helper: dado um response que falhou, extrai o payload JSON e gera a mensagem PT.
 * Uso:
 *   const res = await fetch(...);
 *   if (!res.ok) throw new Error(await readBillingError(res));
 */
export const readBillingError = async (res: Response, fallback?: string): Promise<string> => {
  try {
    const payload = (await res.json()) as ApiErrorPayload;
    return mapBillingError(payload, fallback);
  } catch {
    return mapBillingError(null, fallback);
  }
};
