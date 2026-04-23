# WX Blueprints

Marketplace de blueprints de sites prontos pra IA coding (Lovable, Bolt, Cursor, Claude). 7 templates com deploy ao vivo, blueprint técnico completo e repositório GitHub como entregável.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Firebase · Asaas · Resend · PostHog · Netlify

---

## 🚀 Setup local em 10 minutos

```bash
# 1. Clone
git clone <este-repo>
cd wx-blueprints

# 2. Instala deps
npm install

# 3. Copia template de env
cp .env.local.example .env.local

# 4. Valida quais envs faltam
npm run check:env

# 5. Roda em dev
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

**Modo dev sem Firebase:** se você deixar as envs Firebase vazias, o app ativa `NEXT_PUBLIC_USE_MOCK_AUTH=true` automaticamente e usa um mock de auth em `localStorage`. Suficiente pra navegar catálogo e ver painel. Pagamentos precisam de Asaas real.

---

## 📋 Checklist de produção

Tudo abaixo precisa estar OK antes de vender de verdade.

### 1. Firebase (auth + firestore)

1. Console: https://console.firebase.google.com → **Criar projeto** `wx-blueprints`
2. **Authentication** → Sign-in method → habilitar Email/Senha e Google
3. **Firestore Database** → Criar banco (modo produção, região `us-east1` ou `southamerica-east1`)
4. **Firestore Rules** → cole o conteúdo de `firestore.rules` e publique
5. Project Settings → **General** → Seus apps → Web → copie config e cole em `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. Project Settings → **Service Accounts** → Generate new private key → baixa JSON
7. Cole o **JSON inteiro em uma linha** em `FIREBASE_SERVICE_ACCOUNT` (mantém as aspas simples externas)

### 2. Asaas (pagamentos brasileiros)

1. Cria conta sandbox: https://sandbox.asaas.com
2. Painel Asaas → **Integrações** → Chave API → copia e cola em `ASAAS_API_KEY`
3. Define um token forte em `ASAAS_WEBHOOK_TOKEN` (qualquer string aleatória, você escolhe)
4. Painel Asaas → **Webhooks** → Adicionar:
   - URL: `https://SEU-DOMINIO/api/asaas/webhook`
   - Token de auth: mesmo valor de `ASAAS_WEBHOOK_TOKEN`
   - Eventos: `PAYMENT_CREATED`, `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `SUBSCRIPTION_CREATED`, `SUBSCRIPTION_UPDATED`, `SUBSCRIPTION_DELETED`
5. `ASAAS_ENVIRONMENT="sandbox"` até validar com pagamento real. Troca para `production` quando migrar a chave.

### 3. Resend (emails transacionais)

1. https://resend.com → criar conta → **API Keys** → copia em `RESEND_API_KEY`
2. Adiciona domínio (ou usa `onboarding@resend.dev` para testes)
3. `EMAIL_FROM="WX Blueprints <noreply@seudominio.com>"`
4. `EMAIL_ADMIN="seuemail@gmail.com"` — recebe cópia de eventos importantes

### 4. PostHog (analytics) — opcional mas recomendado

1. https://app.posthog.com → Project settings → Project API key
2. Cola em `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST`

### 5. Admin (seu email)

```
ADMIN_EMAILS="seuemail@gmail.com"
NEXT_PUBLIC_ADMIN_EMAILS="seuemail@gmail.com"
```

Emails listados aqui ganham Founding Lifetime automático ao logar — útil pra você testar o fluxo premium sem pagar.

### 6. Verificar

```bash
npm run check:env
```

Saída verde em todas as OBRIGATÓRIAS = pronto pra buildar.

---

## 🌐 Deploy na Netlify

Você já tem conta e GitHub vinculado. Fluxo:

1. **Push** deste projeto para um repo no seu GitHub
2. Netlify → **Add new site** → Import from GitHub → selecione o repo
3. Build settings (auto-detectados pelo `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Environment variables** → cole TODAS as envs do `.env.local` (Netlify tem import em massa colando um `.env`)
5. **Deploy site**
6. Depois de publicar, troque `NEXT_PUBLIC_APP_URL` e `APP_URL` para o domínio real da Netlify
7. Volte ao Asaas e atualize a URL do webhook: `https://SEU-SITE.netlify.app/api/asaas/webhook`

---

## 📦 Os 7 repositórios de templates (entregáveis)

Cada blueprint tem um repo GitHub próprio. Assinantes **Premium** recebem link de acesso; **Founding** recebem convite como colaborador.

| Template | Slug | Repo |
|----------|------|------|
| Aura Motors V2 | `aura-motors-v2` | [Aura-Motors-V2-Blueprint-WX](https://github.com/Wesleysc94/Aura-Motors-V2-Blueprint-WX) |
| Aura Motors V1 | `aura-motors-v1` | [Aura-Motors-V1-Blueprint-WX](https://github.com/Wesleysc94/Aura-Motors-V1-Blueprint-WX) |
| Barbearia Bravus | `barbearia-bravus` | [Barbearia-Bravus-Blueprint-WX](https://github.com/Wesleysc94/Barbearia-Bravus-Blueprint-WX) |
| Aura Burger | `aura-burger` | [Aura-Burger-Blueprint-WX](https://github.com/Wesleysc94/Aura-Burger-Blueprint-WX) |
| Lumina Odontologia | `lumina-odontologia` | [-Lumina-Odontologia-Blueprint-WX](https://github.com/Wesleysc94/-Lumina-Odontologia-Blueprint-WX) |
| Maison Aura Estética | `maison-aura-estetica` | [-Maison-Aura-Est-tica-Blueprint-WX](https://github.com/Wesleysc94/-Maison-Aura-Est-tica-Blueprint-WX) |
| Aura Veterinária | `aura-veterinaria` | [Aura-Veterin-ria-Blueprint-WX](https://github.com/Wesleysc94/Aura-Veterin-ria-Blueprint-WX) |

### Como subir o código de cada template

Para **cada** dos 7 repos (os repos já existem, estão vazios):

```bash
# Dentro da pasta do projeto template
cd /caminho/para/aura-motors-v2

git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/Wesleysc94/Aura-Motors-V2-Blueprint-WX.git
git push -u origin main
```

Adicione também em cada repo um `README.md` mínimo explicando:
- Stack usada
- Como rodar localmente
- Como customizar cores/textos principais
- Link para o blueprint em `https://SEU-SITE/blueprints/{slug}`

### Dar acesso aos assinantes

**Premium** (só visualizar o repo):
- Torne o repo privado (já vêm assim por padrão)
- Adicione o email do assinante como **Outside collaborator** com permissão **Read**
- Ou, mais escalável: crie um GitHub App que recebe webhook do Asaas e adiciona automaticamente

**Founding** (colaborador completo):
- Adicione como **Outside collaborator** com permissão **Write** em todos os 7 repos
- Nos templates com `repo_access: "collaborator"`, a UI do blueprint mostra badge "Founding" e menciona envio do convite em 24h

> **Atalho manual recomendado pro MVP:** ao receber webhook de pagamento confirmado, o Asaas te notifica por email. Você entra no GitHub e convida o cliente manualmente. Funciona até ~50 assinantes antes de doer.

---

## 🧪 Smoke test end-to-end

Antes de divulgar, faça 1 fluxo completo em sandbox:

1. `npm run dev`
2. Abre `/criar-conta`, cria conta com email ≠ do ADMIN_EMAILS
3. Abre `/planos` → clica "Assinar Premium Mensal"
4. Checkout Asaas abre → paga via Pix sandbox (Asaas gera QR de teste)
5. Volta para `/painel` → verifica se o plano virou "Ativo"
6. Abre um blueprint premium (`/blueprints/aura-motors-v1`) → confere se a seção "Repositório do projeto" mostra link verde (acesso liberado)
7. Testa "Cancelar assinatura" no painel
8. Webhook recebido em `/api/asaas/webhook` deve ter sido logado

Se qualquer passo falhar, checa os logs no terminal + Firestore + painel Asaas (seção Webhooks → histórico).

---

## 📂 Estrutura do projeto

```
src/
├── app/                    # App Router (Next.js 16)
│   ├── api/               # /api/me, /api/billing/*, /api/asaas/webhook
│   ├── blueprints/        # Catálogo + detalhe
│   ├── painel/            # Dashboard do membro
│   └── planos/            # Página de pricing
├── components/
│   ├── auth/              # SignIn / SignUp forms
│   ├── dashboard/         # DashboardClient
│   ├── sections/          # PricingPage, HeroSection etc.
│   └── templates/         # TemplateCard, TemplateRepoAccess, UniversalPromptBox
├── data/
│   └── templates.ts       # Fonte única dos 7 blueprints
├── lib/
│   ├── access/            # deriveUserAccess, isAdminEmail
│   ├── asaas/             # createSubscriptionCheckout, cancelAsaasSubscription
│   ├── auth/              # Firebase + dev-mock
│   ├── billing/           # client-errors (mapeamento PT)
│   ├── firebase/          # client + admin SDKs
│   └── i18n/              # PT/EN dicts
└── scripts/
    ├── check-env.ts       # npm run check:env
    └── seed-blueprints.ts # Seed Firestore (se precisar)
```

---

## 🛠️ Comandos úteis

```bash
npm run dev              # dev server
npm run build            # build produção
npm run start            # roda build localmente
npm run lint             # eslint
npm run check:env        # valida envs obrigatórias
npx tsc --noEmit         # type-check sem emitir JS
```

---

## 🎯 Modelo de produto (referência)

| Plano | Preço | Blueprint (texto) | Repositório | Convite colaborador | Vídeos |
|-------|-------|-------------------|-------------|---------------------|--------|
| Free | R$ 0 | ✅ 3 blueprints free | ❌ | ❌ | ❌ |
| Premium | R$ 29/mês ou R$ 290/ano | ✅ Todos os 7 | ✅ Ler | ❌ | ✅ |
| Founding (100 vagas) | R$ 997 vitalício | ✅ Todos + futuros | ✅ Ler | ✅ Todos 7 | ✅ |

---

## ⚠️ Observações importantes

- **Next.js 16** é novo e tem breaking changes. Antes de editar, dá uma lida em `AGENTS.md` e `node_modules/next/dist/docs/`.
- **Dev mock de auth** só é ativado quando as envs Firebase estão vazias. Nunca publique com mock ligado — sempre preencha as envs em produção.
- **Asaas sandbox ≠ produção**: chave, painel e dinheiro são separados. Não esqueça de migrar `ASAAS_API_KEY` e `ASAAS_ENVIRONMENT="production"` quando for vender de verdade.
- **`FIREBASE_SERVICE_ACCOUNT`** precisa do JSON INTEIRO em UMA linha, entre aspas simples. Se colar formatado (multi-linha), quebra o parser.

---

## 📞 Suporte

Dúvidas sobre o projeto: **fontedasabedoria4@gmail.com** / **wxdigitalstudio@gmail.com**
