/**
 * Gera 7 arquivos README.md — um por template — em docs/template-readmes/.
 * Cada README é pronto para colar no repo correspondente no GitHub.
 *
 * Uso: npx tsx scripts/generate-template-readmes.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { templates, type Template } from "../src/data/templates";

const OUT_DIR = resolve(process.cwd(), "docs/template-readmes");
mkdirSync(OUT_DIR, { recursive: true });

const stackCommand = (stack: string[]): string => {
  const lower = stack.map((s) => s.toLowerCase());
  if (lower.some((s) => s.startsWith("next"))) return "npm install && npm run dev";
  if (lower.some((s) => s.includes("vite"))) return "npm install && npm run dev";
  if (lower.includes("html") && lower.includes("css")) return "Abra `index.html` no navegador (ou use `npx serve .`)";
  return "npm install && npm run dev";
};

const tierLine = (tier: string): string =>
  tier === "premium"
    ? "🏆 **Premium** — só assinantes Premium e Founding do [WX Blueprints](https://blueprints.wxdigitalstudio.com.br) têm acesso."
    : "✨ **Free** — disponível para todos os membros do [WX Blueprints](https://blueprints.wxdigitalstudio.com.br).";

const renderReadme = (t: Template): string => {
  const repoUrl = t.repo_url ?? "https://github.com/Wesleysc94/REPO-NAME";
  const repoFolder = repoUrl.split("/").pop() ?? "repo";
  return `# ${t.name}

${t.tagline}

${tierLine(t.tier)}

---

## 🎯 Demo ao vivo

**Deploy:** ${t.deploy_url}

Este é um dos 7 templates oficiais do **WX Blueprints** — marketplace de blueprints prontos para IA coding (Lovable, Bolt, Cursor, Claude).

## 📦 Stack

${t.stack.map((s) => `- ${s}`).join("\n")}

## 🧩 Seções incluídas

${t.sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

## 🎨 Identidade visual

| Papel | Cor |
|-------|-----|
| Background | \`${t.colors.background}\` |
| Primary | \`${t.colors.primary}\` |
| Accent | \`${t.colors.accent}\` |
| Muted | \`${t.colors.muted}\` |

**Tipografia**
- Display: \`${t.fonts.display}\`
- Body: \`${t.fonts.body}\`

## 🚀 Como rodar localmente

\`\`\`bash
git clone ${repoUrl}.git
cd ${repoFolder}
${stackCommand(t.stack)}
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) (ou a porta que o dev server informar).

## 🎨 Como customizar para outro cliente

O blueprint técnico completo (com prompt universal, design tokens, spec de animações e checklist de QA) está disponível em:

👉 **https://blueprints.wxdigitalstudio.com.br/blueprints/${t.slug}**

Resumo rápido do que alterar:

1. **Cores** — edite as CSS vars em \`src/styles/globals.css\` (ou equivalente)
2. **Fontes** — ${t.fonts.display} para títulos, ${t.fonts.body} para corpo
3. **Textos** — cada seção tem dados hardcoded ou em \`src/data/*.ts\`
4. **Imagens** — substitua em \`public/images/\` mantendo as proporções
5. **Seções** — manter a ordem e a anatomia, alterar apenas conteúdo

${
  t.tier === "premium"
    ? "> ⚠️ **Você está com o código-fonte:** isso só é possível porque você é assinante Premium/Founding do WX Blueprints. Não redistribua o código."
    : ""
}

## 🤖 Usando com IA coding

Copie o prompt universal completo em [WX Blueprints — ${t.name}](https://blueprints.wxdigitalstudio.com.br/blueprints/${t.slug}) e cole em:

- **Lovable** — cria a estrutura em minutos com design fiel
- **Bolt.new** — ideal para MVP rápido
- **Cursor / Claude Code** — melhor para clonagem 1:1 com alta fidelidade

## 📜 Licença

Uso **individual e comercial** permitido para o assinante (1 projeto por cliente). **Proibido redistribuir**, revender ou publicar o código em repositórios públicos. Detalhes em https://blueprints.wxdigitalstudio.com.br/licenca.

## 🔗 Links

- **Blueprint técnico completo:** https://blueprints.wxdigitalstudio.com.br/blueprints/${t.slug}
- **Demo ao vivo:** ${t.deploy_url}
- **WX Blueprints (marketplace):** https://blueprints.wxdigitalstudio.com.br
- **Suporte:** wxdigitalstudio@gmail.com

---

Criado por [WX Digital Studio](https://blueprints.wxdigitalstudio.com.br) · Qualidade ${"★".repeat(t.quality_score)}${"☆".repeat(5 - t.quality_score)}
`;
};

let count = 0;
for (const t of templates) {
  const filename = `${t.slug}.md`;
  const filepath = resolve(OUT_DIR, filename);
  writeFileSync(filepath, renderReadme(t), "utf-8");
  console.log(`✓ ${filename}`);
  count++;
}

console.log(`\n📝 ${count} READMEs gerados em docs/template-readmes/`);
console.log("Cole cada arquivo no repo correspondente como README.md e faça push.");
