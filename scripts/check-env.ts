/**
 * Valida se todas as variáveis de ambiente necessárias estão configuradas.
 * Uso: npx tsx scripts/check-env.ts
 * Saída 0 = tudo ok. Saída 1 = algo faltando.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Carrega .env.local manualmente (tsx não faz isso por padrão).
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i.exec(line);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    // Remove aspas envoltas (duplas ou simples) se presentes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

type Severity = "required" | "recommended" | "optional";

interface Check {
  key: string;
  severity: Severity;
  description: string;
  validate?: (value: string) => string | null;
}

const CHECKS: Check[] = [
  // ---- App ----
  {
    key: "NEXT_PUBLIC_APP_URL",
    severity: "required",
    description: "URL pública do app (http://localhost:3000 em dev)",
  },
  {
    key: "APP_URL",
    severity: "required",
    description: "URL interna usada pelo backend (igual a NEXT_PUBLIC_APP_URL em dev)",
  },

  // ---- Firebase Client ----
  {
    key: "NEXT_PUBLIC_FIREBASE_API_KEY",
    severity: "required",
    description: "API key Firebase Web (Project Settings → General)",
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    severity: "required",
    description: "Domínio de autenticação Firebase (ex: wx-blueprints.firebaseapp.com)",
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    severity: "required",
    description: "ID do projeto Firebase",
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    severity: "required",
    description: "Bucket de storage Firebase",
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    severity: "required",
    description: "Sender ID Firebase",
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_APP_ID",
    severity: "required",
    description: "App ID Firebase Web",
  },

  // ---- Firebase Admin ----
  {
    key: "FIREBASE_SERVICE_ACCOUNT",
    severity: "required",
    description: "JSON completo da service account (Project Settings → Service Accounts)",
    validate: (value) => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
          return "JSON faltando project_id, client_email ou private_key";
        }
        return null;
      } catch {
        return "Não é JSON válido. Cole o JSON inteiro entre aspas simples.";
      }
    },
  },

  // ---- Asaas ----
  {
    key: "ASAAS_ENVIRONMENT",
    severity: "required",
    description: "'sandbox' para testes, 'production' para produção",
    validate: (value) =>
      ["sandbox", "production"].includes(value)
        ? null
        : "Deve ser 'sandbox' ou 'production'",
  },
  {
    key: "ASAAS_API_KEY",
    severity: "required",
    description: "API key Asaas (Integrações → Chave API)",
  },
  {
    key: "ASAAS_WEBHOOK_TOKEN",
    severity: "required",
    description: "Token arbitrário usado para validar webhooks do Asaas",
  },

  // ---- Resend ----
  {
    key: "RESEND_API_KEY",
    severity: "recommended",
    description: "API key Resend para emails transacionais",
  },
  {
    key: "EMAIL_FROM",
    severity: "recommended",
    description: "Remetente dos emails (ex: WX Blueprints <noreply@seudominio.com>)",
  },
  {
    key: "EMAIL_ADMIN",
    severity: "recommended",
    description: "Email de admin que recebe notificações",
  },

  // ---- PostHog ----
  {
    key: "NEXT_PUBLIC_POSTHOG_KEY",
    severity: "recommended",
    description: "Project API key PostHog",
  },
  {
    key: "NEXT_PUBLIC_POSTHOG_HOST",
    severity: "optional",
    description: "Host PostHog (default: https://us.i.posthog.com)",
  },

  // ---- Sentry ----
  {
    key: "NEXT_PUBLIC_SENTRY_DSN",
    severity: "optional",
    description: "DSN Sentry para tracking de erros",
  },

  // ---- Admin ----
  {
    key: "ADMIN_EMAILS",
    severity: "required",
    description: "Emails com acesso privilegiado, separados por vírgula",
  },
];

const SEVERITY_LABEL: Record<Severity, string> = {
  required: "\x1b[31mOBRIGATÓRIO\x1b[0m",
  recommended: "\x1b[33mRECOMENDADO\x1b[0m",
  optional: "\x1b[90mOPCIONAL   \x1b[0m",
};

const main = () => {
  console.log("\n🔍 Verificando variáveis de ambiente...\n");

  const missing: Check[] = [];
  const invalid: Array<{ check: Check; error: string }> = [];
  const present: Check[] = [];

  for (const check of CHECKS) {
    const value = process.env[check.key];
    if (!value || value.trim() === "") {
      missing.push(check);
      continue;
    }
    if (check.validate) {
      const err = check.validate(value);
      if (err) {
        invalid.push({ check, error: err });
        continue;
      }
    }
    present.push(check);
  }

  console.log(`✅ ${present.length} variáveis configuradas`);

  const requiredMissing = missing.filter((c) => c.severity === "required");
  const requiredInvalid = invalid.filter((i) => i.check.severity === "required");

  if (missing.length > 0) {
    console.log(`\n❌ ${missing.length} faltando:\n`);
    for (const check of missing) {
      console.log(`  ${SEVERITY_LABEL[check.severity]}  ${check.key}`);
      console.log(`               ${check.description}\n`);
    }
  }

  if (invalid.length > 0) {
    console.log(`\n⚠️  ${invalid.length} com formato inválido:\n`);
    for (const { check, error } of invalid) {
      console.log(`  ${SEVERITY_LABEL[check.severity]}  ${check.key}`);
      console.log(`               ${error}\n`);
    }
  }

  const hasBlockers = requiredMissing.length + requiredInvalid.length > 0;

  if (hasBlockers) {
    console.log("\n🚫 Há variáveis OBRIGATÓRIAS ausentes ou inválidas.");
    console.log("   O app não funcionará em produção enquanto não forem preenchidas.");
    console.log("   Consulte .env.local.example e o README.\n");
    process.exit(1);
  }

  if (missing.length > 0 || invalid.length > 0) {
    console.log("\n⚠️  Build vai funcionar, mas features podem ficar degradadas.");
    console.log("   Recomendado preencher as variáveis recomendadas antes de publicar.\n");
    process.exit(0);
  }

  console.log("\n🎉 Tudo certo! Pronto pra publicar.\n");
  process.exit(0);
};

main();
