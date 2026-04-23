import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade — WX Blueprints",
  description:
    "Como a WX Blueprints coleta, armazena e utiliza dados pessoais em conformidade com a LGPD.",
};

export default function PrivacidadeRoute() {
  return (
    <LegalPage
      eyebrow="Privacidade"
      title="Política de Privacidade"
      updatedAt="20 de abril de 2026"
    >
      <Section title="1. Controlador">
        <p>
          A WX Digital Studio é a controladora dos dados pessoais tratados na plataforma
          wxblueprints.com, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 —
          LGPD). Contato do encarregado:{" "}
          <a href="mailto:wxdigitalstudio@gmail.com" className="text-[#00d4ff]">
            wxdigitalstudio@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section title="2. Dados que coletamos">
        <p>
          <strong className="text-white/85">Cadastro:</strong> nome, email e (quando fornecido)
          CPF e telefone — necessários para emitir cobrança via Asaas.
        </p>
        <p>
          <strong className="text-white/85">Autenticação:</strong> identificadores do Firebase
          Authentication (UID, provedor, timestamps de login).
        </p>
        <p>
          <strong className="text-white/85">Pagamento:</strong> dados da cobrança e assinatura
          retornados pelo Asaas (status, valor, próximo vencimento). Não armazenamos dados de
          cartão — esse processamento é feito diretamente pelo Asaas.
        </p>
        <p>
          <strong className="text-white/85">Uso:</strong> registros de acesso (data, IP, user-agent)
          e analytics agregado via PostHog para melhorar a experiência.
        </p>
      </Section>

      <Section title="3. Bases legais (art. 7º LGPD)">
        <p>
          Tratamos seus dados com base na (i) execução de contrato, (ii) cumprimento de obrigação
          legal/regulatória, (iii) legítimo interesse para segurança e prevenção a fraude e (iv)
          seu consentimento para comunicação de marketing.
        </p>
      </Section>

      <Section title="4. Compartilhamento">
        <p>
          Compartilhamos o mínimo necessário com operadores contratuais: Firebase (Google) para
          autenticação e banco, Asaas para cobrança, Resend para email transacional, Netlify para
          hospedagem e PostHog para analytics. Não vendemos dados pessoais.
        </p>
      </Section>

      <Section title="5. Retenção">
        <p>
          Mantemos seus dados de conta enquanto houver relação ativa e por até 5 anos após o
          encerramento, conforme prazos prescricionais aplicáveis. Logs de segurança são mantidos
          por 6 meses. Você pode solicitar exclusão antecipada (ver item 7).
        </p>
      </Section>

      <Section title="6. Segurança">
        <p>
          Usamos HTTPS, criptografia em trânsito, regras restritivas no Firestore (escrita
          bloqueada do cliente) e autenticação baseada em tokens. Incidentes de segurança são
          comunicados à ANPD e aos titulares afetados quando houver risco relevante.
        </p>
      </Section>

      <Section title="7. Seus direitos">
        <p>
          Você pode, a qualquer momento, solicitar (i) confirmação de tratamento; (ii) acesso aos
          dados; (iii) correção; (iv) anonimização ou eliminação; (v) portabilidade; (vi)
          informações sobre compartilhamento; (vii) revogação do consentimento. Envie um email para
          wxdigitalstudio@gmail.com com o assunto &ldquo;LGPD&rdquo; — respondemos em até 15 dias.
        </p>
      </Section>

      <Section title="8. Cookies">
        <p>
          Usamos cookies essenciais (sessão, idioma) e analíticos (PostHog). Você pode bloqueá-los
          no navegador — algumas funcionalidades podem ser afetadas.
        </p>
      </Section>

      <Section title="9. Alterações">
        <p>
          Atualizações nesta Política são comunicadas nesta página. Mudanças materiais são
          comunicadas por email ao assinante.
        </p>
      </Section>
    </LegalPage>
  );
}
