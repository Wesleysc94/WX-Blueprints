import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link as EmailLink,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

const colors = {
  background: "#080808",
  surface: "#111111",
  accent: "#00d4ff",
  gold: "#c9a84c",
  purple: "#a855f7",
  text: "#f0f0f0",
  textMuted: "rgba(240,240,240,0.6)",
  border: "rgba(255,255,255,0.08)",
};

function Layout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: "Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "32px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: colors.surface,
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
            maxWidth: "560px",
            padding: "32px",
          }}
        >
          <Text
            style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              color: colors.textMuted,
              fontSize: "18px",
              margin: 0,
              marginBottom: "28px",
            }}
          >
            WX Blueprints
          </Text>
          {children}
          <Hr style={{ borderColor: colors.border, margin: "28px 0 16px" }} />
          <Text style={{ color: "rgba(240,240,240,0.35)", fontSize: "11px", margin: 0 }}>
            Dúvidas? Responda este email ou escreva para{" "}
            <EmailLink href="mailto:wxdigitalstudio@gmail.com" style={{ color: colors.accent }}>
              wxdigitalstudio@gmail.com
            </EmailLink>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function Button({ href, children, color = colors.accent }: { href: string; children: ReactNode; color?: string }) {
  return (
    <Section style={{ textAlign: "left", marginTop: "24px" }}>
      <EmailLink
        href={href}
        style={{
          backgroundColor: color,
          color: "#000",
          fontWeight: "bold",
          padding: "12px 24px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "14px",
          display: "inline-block",
        }}
      >
        {children}
      </EmailLink>
    </Section>
  );
}

export function WelcomeEmail({ name, appUrl }: { name: string; appUrl: string }) {
  return (
    <Layout preview="Sua conta WX Blueprints está pronta. 3 blueprints gratuitos esperando você.">
      <Heading style={{ fontSize: "26px", color: colors.text, margin: "0 0 12px" }}>
        Bem-vindo, {name}!
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px" }}>
        Sua conta foi criada com sucesso. Você já tem acesso a 3 blueprints gratuitos — sites reais,
        deployados em produção, com prompt universal pronto para colar no Lovable, Bolt ou Cursor.
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px", marginTop: "12px" }}>
        Quando quiser liberar o catálogo completo, veja os planos a partir de R$29/mês.
      </Text>
      <Button href={`${appUrl}/blueprints`}>Ver blueprints grátis →</Button>
    </Layout>
  );
}

export function PaymentConfirmedEmail({
  name,
  planLabel,
  expiresAt,
  appUrl,
}: {
  name: string;
  planLabel: string;
  expiresAt?: string;
  appUrl: string;
}) {
  return (
    <Layout preview={`Pagamento confirmado. Acesso ${planLabel} liberado.`}>
      <Heading style={{ fontSize: "26px", color: colors.text, margin: "0 0 12px" }}>
        Pagamento confirmado 🎉
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px" }}>
        Oi {name}, seu acesso <strong style={{ color: colors.accent }}>{planLabel}</strong> está ativo.
        Todo o catálogo de blueprints já está desbloqueado no seu painel.
      </Text>
      {expiresAt && (
        <Text style={{ color: colors.textMuted, fontSize: "13px", marginTop: "8px" }}>
          Próximo ciclo: {new Date(expiresAt).toLocaleDateString("pt-BR")}
        </Text>
      )}
      <Button href={`${appUrl}/painel`}>Abrir painel →</Button>
    </Layout>
  );
}

export function FoundingWelcomeEmail({
  name,
  seatNumber,
  appUrl,
}: {
  name: string;
  seatNumber?: number;
  appUrl: string;
}) {
  return (
    <Layout preview="Acesso vitalício Founding Member confirmado.">
      <Heading style={{ fontSize: "26px", color: colors.text, margin: "0 0 12px" }}>
        Vaga #{seatNumber ?? "—"} garantida
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px" }}>
        Parabéns {name}, você acaba de garantir uma das 100 vagas Founding Lifetime. Seu acesso ao
        catálogo completo — atual e futuro — está liberado <strong>para sempre</strong>, sem
        mensalidade.
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px", marginTop: "12px" }}>
        No painel você verá o selo Founding Member com o número da sua vaga.
      </Text>
      <Button href={`${appUrl}/painel`} color={colors.purple}>
        Abrir painel →
      </Button>
    </Layout>
  );
}

export function PaymentOverdueEmail({
  name,
  dueDate,
  checkoutUrl,
}: {
  name: string;
  dueDate?: string;
  checkoutUrl?: string;
}) {
  return (
    <Layout preview="Cobrança em atraso — regularize para manter o acesso.">
      <Heading style={{ fontSize: "26px", color: colors.text, margin: "0 0 12px" }}>
        Pagamento em atraso
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px" }}>
        Oi {name}, a última cobrança da sua assinatura não foi confirmada
        {dueDate ? ` (vencimento ${new Date(dueDate).toLocaleDateString("pt-BR")})` : ""}. Para evitar
        a interrupção do acesso, regularize o pagamento.
      </Text>
      {checkoutUrl && <Button href={checkoutUrl} color={colors.gold}>Regularizar agora →</Button>}
    </Layout>
  );
}

export function SubscriptionCanceledEmail({ name, appUrl }: { name: string; appUrl: string }) {
  return (
    <Layout preview="Assinatura cancelada — acesso continua até o fim do ciclo.">
      <Heading style={{ fontSize: "26px", color: colors.text, margin: "0 0 12px" }}>
        Assinatura cancelada
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px" }}>
        Oi {name}, confirmamos o cancelamento da sua assinatura. Você continua com acesso premium até
        o fim do ciclo já pago. Depois disso, sua conta volta ao plano gratuito — e você mantém os 3
        blueprints gratuitos.
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: "15px", lineHeight: "24px", marginTop: "12px" }}>
        Quando quiser voltar, seu histórico de conta fica preservado.
      </Text>
      <Button href={`${appUrl}/planos`}>Ver planos →</Button>
    </Layout>
  );
}

export function AdminPaymentNotifyEmail({
  uid,
  email,
  planLabel,
  eventType,
  value,
}: {
  uid: string;
  email: string;
  planLabel: string;
  eventType: string;
  value?: number;
}) {
  return (
    <Layout preview={`[WX Admin] ${eventType} — ${email}`}>
      <Heading style={{ fontSize: "22px", color: colors.text, margin: "0 0 12px" }}>
        {eventType}
      </Heading>
      <Text style={{ color: colors.textMuted, fontSize: "14px", lineHeight: "22px" }}>
        <strong>Email:</strong> {email}
        <br />
        <strong>UID:</strong> {uid}
        <br />
        <strong>Plano:</strong> {planLabel}
        {value !== undefined && (
          <>
            <br />
            <strong>Valor:</strong> R$ {value.toFixed(2)}
          </>
        )}
      </Text>
    </Layout>
  );
}
