import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Licença de Uso — WX Blueprints",
  description:
    "O que você pode e não pode fazer com os blueprints da WX Blueprints em projetos próprios e de clientes.",
};

export default function LicencaRoute() {
  return (
    <LegalPage
      eyebrow="Licença"
      title="Licença de Uso"
      updatedAt="20 de abril de 2026"
    >
      <Section title="1. Escopo da licença">
        <p>
          A licença é <strong className="text-white/85">não exclusiva, mundial, intransferível</strong>,
          concedida por blueprint adquirido (ou pelo período da assinatura ativa, para planos
          Premium/Founding) e destinada a uso comercial pelo próprio assinante ou por clientes
          finais contratados por ele.
        </p>
      </Section>

      <Section title="2. O que você PODE fazer">
        <p>✓ Usar os blueprints como base para sites próprios ou de clientes finais.</p>
        <p>✓ Adaptar copy, cores, imagens, conteúdo e estrutura para o seu projeto.</p>
        <p>✓ Cobrar seus clientes pelo serviço de implementação baseado no blueprint.</p>
        <p>✓ Publicar o site resultante em qualquer provedor de hospedagem (Vercel, Netlify, etc.).</p>
        <p>✓ Reutilizar o mesmo blueprint para múltiplos clientes do mesmo nicho.</p>
      </Section>

      <Section title="3. O que você NÃO PODE fazer">
        <p>✗ Redistribuir, revender ou disponibilizar o blueprint original (PDF, prompt, assets
          originais) a terceiros.</p>
        <p>✗ Republicar o conteúdo textual dos blueprints (copy, tutoriais, prompts) em outra
          plataforma, blog, curso ou produto digital.</p>
        <p>✗ Afirmar autoria do material técnico ou remover créditos da WX Digital Studio quando
          replicados em cursos/aulas.</p>
        <p>✗ Usar o acervo para treinar modelos de IA ou gerar datasets derivados para
          comercialização.</p>
        <p>✗ Compartilhar credenciais da conta WX Blueprints com terceiros não assinantes.</p>
      </Section>

      <Section title="4. Encerramento da assinatura">
        <p>
          Quando a assinatura Premium é encerrada (cancelamento ou inadimplência), o acesso ao
          catálogo completo cessa, mas você mantém o direito de uso de sites já publicados baseados
          em blueprints baixados durante a vigência da assinatura. O plano Founding Lifetime
          concede acesso vitalício ao catálogo e, portanto, não sofre essa limitação.
        </p>
      </Section>

      <Section title="5. Plano gratuito">
        <p>
          Os 3 blueprints gratuitos seguem as mesmas regras desta licença. O acesso continua
          enquanto a conta estiver ativa.
        </p>
      </Section>

      <Section title="6. Atribuição (opcional)">
        <p>
          A atribuição &ldquo;Baseado em blueprint WX&rdquo; não é obrigatória nos sites finais.
          Em conteúdos educativos (aulas, vídeos, posts) que detalhem o processo, pedimos citação
          de fonte.
        </p>
      </Section>

      <Section title="7. Violação">
        <p>
          A violação desta licença pode resultar em (i) suspensão da conta sem reembolso; (ii)
          notificação extrajudicial; (iii) ações cíveis e criminais pela lei de direitos autorais
          (Lei nº 9.610/98) e pela LGPD quando aplicável.
        </p>
      </Section>
    </LegalPage>
  );
}
