import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso — WX Blueprints",
  description:
    "Termos e condições de uso da plataforma WX Blueprints: biblioteca de replicação premium para AI coding.",
};

export default function TermosRoute() {
  return (
    <LegalPage eyebrow="Termos" title="Termos de Uso" updatedAt="20 de abril de 2026">
      <Section title="1. Aceitação">
        <p>
          Ao criar uma conta ou assinar um plano na WX Blueprints (
          <a href="https://blueprints.wxdigitalstudio.com.br" className="text-[#00d4ff]">blueprints.wxdigitalstudio.com.br</a>),
          você declara estar de acordo com estes Termos de Uso e com nossa Política de Privacidade.
          Se você não concorda com qualquer cláusula, não utilize o serviço.
        </p>
      </Section>

      <Section title="2. Sobre a plataforma">
        <p>
          A WX Blueprints é uma biblioteca de blueprints (documentações técnicas + prompts
          universais) voltada para recriar sites premium com ferramentas de AI coding como Lovable,
          Bolt, Cursor e Claude. A plataforma não presta serviço de desenvolvimento sob demanda;
          entregamos exclusivamente o material técnico para replicação.
        </p>
      </Section>

      <Section title="3. Conta">
        <p>
          Você é responsável pela veracidade dos dados informados e pela confidencialidade das
          credenciais de acesso. A conta é pessoal e intransferível. Podemos suspender contas que
          compartilhem credenciais ou burlem limites de acesso.
        </p>
      </Section>

      <Section title="4. Planos e pagamento">
        <p>
          Oferecemos (i) plano gratuito com 3 blueprints selecionados; (ii) plano Premium mensal
          (R$29/mês) ou anual (R$247/ano); (iii) plano Founding Lifetime (R$397, pagamento único,
          limitado a 100 vagas). Pagamentos são processados pelo Asaas e liberam o acesso apenas
          após confirmação.
        </p>
        <p>
          Assinaturas Premium são renovadas automaticamente até cancelamento. Você pode cancelar a
          qualquer momento pelo painel — o acesso permanece ativo até o fim do ciclo já pago. O
          plano Founding Lifetime não é renovado e seu acesso é vitalício ao catálogo atual e
          futuro.
        </p>
      </Section>

      <Section title="5. Licença de uso do conteúdo">
        <p>
          A compra de um blueprint concede licença não exclusiva, intransferível e para uso
          comercial próprio ou de clientes do assinante — você pode usar o material como base para
          entregar sites a clientes finais. É vedado redistribuir, revender, republicar ou compartilhar
          os blueprints em sua forma original (PDF, prompts, assets originais da WX). A licença
          detalhada está descrita na página <a href="/licenca" className="text-[#00d4ff]">Licença
          de Uso</a>.
        </p>
      </Section>

      <Section title="6. Cancelamento e reembolso">
        <p>
          Nos termos do art. 49 do Código de Defesa do Consumidor, você tem o direito de solicitar
          reembolso integral em até 7 dias corridos após a compra, desde que não tenha baixado mais
          de 2 blueprints premium. Regras específicas estão em <a href="/reembolso"
          className="text-[#00d4ff]">Política de Reembolso</a>.
        </p>
      </Section>

      <Section title="7. Limitações">
        <p>
          Os blueprints descrevem arquitetura, copy, design e prompts — a qualidade do site final
          depende da ferramenta de AI coding utilizada e da execução do assinante. Não garantimos
          compatibilidade perfeita com todas as versões de modelos de IA nem resultados de negócio.
        </p>
      </Section>

      <Section title="8. Propriedade intelectual">
        <p>
          Todo o material do catálogo — textos, imagens, estruturas, prompts, copy, design e
          documentações — é de titularidade da WX Digital Studio, exceto trechos expressamente
          atribuídos a terceiros. O uso fora do escopo da licença sujeita o infrator às sanções
          cíveis e criminais cabíveis.
        </p>
      </Section>

      <Section title="9. Alterações">
        <p>
          Podemos alterar estes Termos para refletir ajustes no serviço ou exigências legais. Mudanças
          relevantes serão comunicadas por email ao assinante com antecedência mínima de 15 dias.
        </p>
      </Section>

      <Section title="10. Foro">
        <p>
          Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca do
          domicílio do consumidor para dirimir questões oriundas destes Termos.
        </p>
      </Section>
    </LegalPage>
  );
}
