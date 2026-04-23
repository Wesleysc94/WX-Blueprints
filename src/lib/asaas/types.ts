import type { AsaasWebhookEvent } from "./events";

export type AsaasEnvironment = "sandbox" | "production";

export interface AsaasCustomer {
  id: string;
  name: string;
  email?: string;
  cpfCnpj?: string;
  phone?: string;
  mobilePhone?: string;
  dateCreated?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string | { id: string };
  subscription?: string | { id: string };
  value: number;
  netValue?: number;
  status?: string;
  billingType?: string;
  dueDate?: string;
  paymentDate?: string;
  confirmedDate?: string;
  creditDate?: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  transactionReceiptUrl?: string;
}

export interface AsaasSubscription {
  id: string;
  customer: string | { id: string };
  value: number;
  cycle?: string;
  status?: string;
  nextDueDate?: string;
  endDate?: string | null;
  description?: string;
  billingType?: string;
}

export interface AsaasCheckoutSession {
  id: string;
  url?: string;
  expirationDateTime?: string;
  status?: string;
  customer?: string | AsaasCustomer;
  subscription?: string | AsaasSubscription;
  link?: string;
  billingTypes?: string[];
  chargeTypes?: string[];
}

export interface AsaasWebhookPayload {
  id: string;
  event: AsaasWebhookEvent;
  dateCreated?: string;
  payment?: AsaasPayment;
  subscription?: AsaasSubscription;
  checkout?: AsaasCheckoutSession;
}

export interface AsaasWebhookConfig {
  id?: string;
  name: string;
  url: string;
  email: string;
  enabled: boolean;
  interrupted?: boolean;
  authToken: string;
  sendType: "SEQUENTIALLY" | "NON_SEQUENTIALLY";
  events: AsaasWebhookEvent[];
}
