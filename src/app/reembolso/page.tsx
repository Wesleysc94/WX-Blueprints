import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Política de Reembolso — WX Blueprints",
  description:
    "Como solicitar reembolso nos planos Premium e Founding Lifetime da WX Blueprints (CDC art. 49 — 7 dias).",
};

export default function ReembolsoRoute() {
  return (
    <LegalPage
      eyebrow="Reembolso"
      title="Política de Reembolso"
      updatedAt="20 de abril de 2026"
    >
      <Section title="1. Direito de arrependimento (CDC art. 49)">
        <p>
          Por se tratar de contratação fora do estabelecimento físico, você tem{" "}
          <strong className="text-white/85">7 dias corridos</strong> a contar da data da compra
          para solicitar reembolso integral, sem necessidade de justificativa.
        </p>
      </Section>

      <Section title="2. Quando o reembolso é integral">
        <p>• Plano Premium Mensal ou Anual — dentro dos 7 dias, desde que você tenha baixado
          ou visualizado na íntegra até 2 blueprints premium.</p>
        <p>• Plano Founding Lifetime — dentro dos 7 dias, desde que você tenha baixado ou
          visualizado na íntegra até 2 blueprints premium. A vaga é liberada ao próximo da fila.</p>
      </Section>

      <Section title="3. Quando o reembolso é parcial ou negado">
        <p>
          Se você já baixou/visualizou na íntegra mais de 2 blueprints premium dentro dos 7 dias,
          poderemos aplicar um desconto proporcional ao conteúdo consumido. Após o 7º dia, não há
          direito de arrependimento; reembolsos seguem análise de boa-fé para casos específicos
          (ex.: cobrança duplicada, falha técnica não sanada).
        </p>
      </Section>

      <Section title="4. Renovações automáticas">
        <p>
          Renovações recorrentes do Premium (mensal/anual) não disparam novo prazo de 7 dias, pois
          não são contratação nova. Se você esqueceu de cancelar e a renovação ocorreu nos últimos
          2 dias, nós reembolsamos integralmente por boa-fé, desde que não tenha havido uso
          adicional após a renovação.
        </p>
      </Section>

      <Section title="5. Como solicitar">
        <p>
          Envie um email para{" "}
          <a href="mailto:wxdigitalstudio@gmail.com" className="text-[#00d4ff]">
            wxdigitalstudio@gmail.com
          </a>{" "}
          com o assunto &ldquo;Reembolso&rdquo; informando o email da conta e o motivo (opcional).
          Respondemos em até 2 dias úteis e processamos o estorno pelo mesmo método de pagamento em
          até 7 dias úteis após aprovação.
        </p>
      </Section>

      <Section title="6. Pix e cartão">
        <p>
          Pagamentos por Pix são reembolsados via transferência bancária para a chave do pagador.
          Pagamentos por cartão de crédito são estornados pela operadora — o prazo de
          visualização no extrato depende da bandeira e do emissor (geralmente 1 a 2 faturas).
        </p>
      </Section>

      <Section title="7. Cancelamento sem reembolso">
        <p>
          Após o 7º dia, você pode cancelar a assinatura a qualquer momento pelo painel. Seu acesso
          permanece ativo até o fim do ciclo já pago e não há estorno proporcional do período não
          utilizado.
        </p>
      </Section>
    </LegalPage>
  );
}
