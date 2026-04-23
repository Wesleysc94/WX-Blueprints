export type TemplateTier = "free" | "premium";

export interface Template {
  id: string;
  slug: string;
  name: string;
  niche: string;
  tier: TemplateTier;
  tagline: string;
  deploy_url: string;
  preview_video_url?: string;
  repo_url?: string;
  repo_access?: "public" | "private" | "collaborator";
  stack: string[];
  sections: string[];
  colors: { background: string; primary: string; accent: string; muted: string };
  fonts: { display: string; body: string };
  quality_score: number;
  blueprint?: {
    version: string;
    concept: string;
    sections_map: string[];
    design_tokens: {
      colors: { role: string; hex: string; usage: string }[];
      typography: { role: string; config: string; usage: string }[];
    };
    implementation_spec: string[];
    animations_spec: string[];
    assets_references: { type: string; description: string; required: boolean }[];
    qa_checklist: string[];
    universal_prompt: string;
    customization_notes: string;
  };
}

export const templates: Template[] = [
  {
    id: "auto-01",
    slug: "aura-motors-v2",
    name: "Aura Motors V2",
    niche: "Automotivo",
    tier: "free",
    tagline: "Showroom automotivo dark-premium com hero cinematográfico e inventário filtrável.",
    deploy_url: "https://aura-motors-v2.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/Aura-Motors-V2-Blueprint-WX",
    repo_access: "private",
    stack: ["React 19", "Vite", "Tailwind", "Framer Motion", "React Router"],
    sections: ["SiteHeader", "HeroShowcase", "FeaturedVehicles", "ProcessStrip", "ConciergeShowcase", "SiteFooter"],
    colors: { background: "#0a0a0a", primary: "#ea0029", accent: "#21145f", muted: "#404040" },
    fonts: { display: "Bebas Neue", body: "Plus Jakarta Sans" },
    quality_score: 5,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Showroom automotivo editorial com linguagem visual agressiva e sistemas de navegação sofisticados. Hero com mídia fullscreen, grade de fundo sutil e animações de entrada com easing cinematográfico posicionam a operação como referência de alto ticket.",
      sections_map: [
        "SiteHeader — navbar fixa transparente → blur ao scroll; esconde ao scroll para baixo (150px), reaparece ao subir",
        "HeroShowcase — hero fullscreen com imagem/vídeo, 5 camadas de gradient overlay, dock de busca de veículos (desktop)",
        "FeaturedVehicles — grid 3 colunas, cards com barra de acento #ea0029, hover translateY(-4px)",
        "ProcessStrip — 4 etapas horizontais separadas por linha pontilhada vermelha",
        "ConciergeShowcase — seção split com texto institucional e formulário de contato",
        "SiteFooter — logo + links + redes sociais + copyright",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#0a0a0a", usage: "Base global e --color-bg" },
          { role: "Paper", hex: "#050505", usage: "Background do hero e seções de destaque" },
          { role: "Surface", hex: "#141414", usage: "Background de cards e containers" },
          { role: "Primary Red", hex: "#ea0029", usage: "CTAs, barras de acento, scrollbar, active states" },
          { role: "Indigo", hex: "#21145f", usage: "Gradiente secundário nos accents" },
          { role: "Border Subtle", hex: "rgba(255,255,255,0.06)", usage: "Bordas padrão de cards" },
          { role: "Border Hover", hex: "rgba(255,255,255,0.12)", usage: "Bordas no hover" },
        ],
        typography: [
          { role: "Display", config: "Bebas Neue 400 — clamp(2.8rem, 9vw, 6.5rem)", usage: "Todas as headlines" },
          { role: "Body", config: "Plus Jakarta Sans 400/500/700/800", usage: "Texto, labels, navegação" },
          { role: "Eyebrow", config: "Plus Jakarta Sans 800, 11px, letter-spacing 0.26em, uppercase", usage: "Labels de seção acima de títulos" },
        ],
      },
      implementation_spec: [
        "CSS Variables no :root: --color-bg:#0a0a0a; --color-paper:#050505; --color-surface:#141414; --color-red:#ea0029; --color-indigo:#21145f; --font-heading:'Bebas Neue',sans-serif; --font-body:'Plus Jakarta Sans',sans-serif",
        "PageVeil: div fixed inset-0 z-0 pointer-events-none opacity-[0.1] com background-image de linhas horizontais rgba(255,255,255,0.05) 1px e verticais de 88×88px; mask: linear-gradient(180deg, transparent, black 10%, black 90%, transparent)",
        "Navbar: position fixed, inset-x-0 top-0 z-50, padding px-4 py-4, max-w-[88rem] mx-auto border-radius-[1.7rem]. Scrolled (>50px): bg rgba(10,10,10,0.95), border-bottom 1px solid rgba(255,255,255,0.10), backdrop-blur-xl, shadow 0 18px 60px rgba(0,0,0,0.4). Ocultar scroll-down >150px: translateY(-100%) transition 0.8s cubic-bezier(0.76,0,0.24,1)",
        "Hero breakout: ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] w-screen. Background paper #050505. border-bottom 1px solid rgba(234,0,41,0.2). rounded-b-[4rem] desktop",
        "Hero overlays (desktop): esquerda linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 40%, transparent 75%); base-inferior h-[14rem] linear-gradient(to top, rgba(0,0,0,0.90), rgba(0,0,0,0.50) 40%, transparent); radial central radial-gradient(ellipse at center, transparent, rgba(0,0,0,0.6)) opacity-[0.80]",
        "3 linhas verticais (desktop, pointer-events-none) em 25%, 50%, 75%: width 1px, bg rgba(255,255,255,0.03)",
        "VehicleCard: border-radius 1.25rem; bg linear-gradient(180deg, rgba(30,30,30,0.98), rgba(15,15,15,0.98)); border 1px solid rgba(255,255,255,0.06); shadow 0 18px 44px rgba(0,0,0,0.22). Hover: translateY(-4px), shadow 0 24px 56px rgba(0,0,0,0.34), border rgba(255,255,255,0.12). Barra topo: 88×5px linear-gradient(90deg,#ea0029,#21145f,transparent)",
        "Imagem do card: h-80 (320px), hover scale(1.05) 700ms; overlay to-t from-black/80 via-black/20 to-transparent",
        "Scrollbar: width 8px; track rgba(20,20,20,0.8); thumb rgba(234,0,41,0.5) border-radius 999px",
      ],
      animations_spec: [
        "Easing padrão hero: [0.22, 1, 0.36, 1] (cubic-bezier) — use este em TODAS as animações de entrada",
        "Badge hero: opacity 0→1, y +24→0, blur 8px→0; duration 1.35s, delay 0.1s",
        "Headline hero: opacity 0→1, y +52→0, blur 16px→0; duration 1.7s, delay 0.25s",
        "Subtítulo hero: opacity 0→1, y +24→0; duration 1.55s, delay 0.45s",
        "CTA botões: opacity 0→1, y +24→0; duration 1.55s, delay 0.6s",
        "Imagem de fundo hero: opacity 0→1; duration 1.8s, easeOut, no delay",
        "Cards de veículos (whileInView): opacity 0→1, y +20→0; stagger 0.08s por card, duration 0.6s",
        "Navbar ocultar: translateY(-100%), transition 0.8s cubic-bezier(0.76,0,0.24,1); revelar: translateY(0) mesma transição",
        "Hover no botão CTA: translateY(-2px), box-shadow 0 20px 40px rgba(234,0,41,0.4); transition 220ms ease",
        "Logo/imagem glide keyframe: scale(1.02) translate3d(0,0,0) → scale(1.06) translate3d(-1.25%,-0.8%,0); 18s ease-in-out infinite alternate",
      ],
      assets_references: [
        { type: "Foto/vídeo hero", description: "Imagem ou vídeo de carro em ambiente escuro 1920×1080, object-position: 80% center", required: true },
        { type: "Fotos de veículos", description: "Mínimo 8 fotos em fundo neutro escuro, proporção 4:3, 1200×900px", required: true },
        { type: "Logotipo", description: "SVG monocromático branco + versão com acento vermelho", required: true },
        { type: "Ícone favicon", description: "32×32px e 192×192px PNG", required: false },
      ],
      qa_checklist: [
        "Navbar some ao scroll para baixo e aparece ao subir — testar em iOS Safari",
        "Hero gradients cobrem texto em todos os tamanhos de tela (375px, 768px, 1440px)",
        "Cards de veículos: hover translateY funcionando em touch devices (pointer-coarse)",
        "Dock de busca: oculto em mobile, visível apenas em md:",
        "Scrollbar vermelha presente em Windows Chrome — verificar",
        "Animações de entrada só disparam uma vez (viewport once:true)",
      ],
      universal_prompt: `Crie um website automotivo dark-premium completo para uma concessionária chamada '[NOME_NEGOCIO]' usando React + Vite + TypeScript + Tailwind CSS + Framer Motion + React Router DOM.

PACOTES NPM: framer-motion, react-router-dom, lucide-react
FONTES GOOGLE (adicione no index.html): Bebas Neue (400), Plus Jakarta Sans (300, 400, 500, 600, 700, 800)

---

1. TOKENS DE DESIGN — adicione no index.css:
:root {
  --color-bg: #0a0a0a; --color-paper: #050505; --color-surface: #141414;
  --color-elevated: #1c1c1c; --color-red: #ea0029; --color-indigo: #21145f;
  --font-heading: 'Bebas Neue', sans-serif; --font-body: 'Plus Jakarta Sans', sans-serif;
}
body { background: #0a0a0a; font-family: var(--font-body); color: rgba(255,255,255,0.92); }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: rgba(20,20,20,0.8); }
::-webkit-scrollbar-thumb { background: rgba(234,0,41,0.5); border-radius: 999px; }

2. GRADE DE FUNDO GLOBAL (componente PageVeil):
Div fixed inset-0 z-0 pointer-events-none opacity-[0.1]:
background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
background-size: 88px 88px
mask-image: linear-gradient(180deg, transparent, black 10%, black 90%, transparent)

3. NAVBAR (SiteHeader):
- position: fixed inset-x-0 top-0 z-50; padding: px-4 py-4 md:px-6
- Interno: mx-auto max-w-[88rem] → div rounded-[1.7rem] border px-4 py-3 md:py-4 md:px-6 transition-all duration-500
- Padrão: border-transparent bg-transparent shadow-none
- Rolado (scrollY > 50, dark mode): border-white/10 bg-[rgba(10,10,10,0.95)] shadow-[0_18px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl
- Ocultar ao rolar para baixo >150px via Framer Motion: y='-100%' transition duration 0.8s ease [0.76,0,0.24,1]; reaparecer ao rolar para cima: y=0
- Logo: 3 barras horizontais empilhadas (h-[3px] md:h-[4px] rounded-full) nas cores #ea0029 (w-8/w-10), #21145f (w-5/w-6), forest-green (w-11/w-14) + texto "Aura Motors" em Bebas Neue 1.5rem md:2.1rem tracking-[0.08em]
- Links: Plus Jakarta Sans 11px weight-800 tracking-[0.22em] uppercase; ativo: #ea0029; padrão: rgba(255,255,255,0.6) hover: white
- Botão CTA: rounded-[0.9rem] bg-[#ea0029] text-white px-5 py-3 text-[11px] font-extrabold tracking-[0.08em] hover:translate-y-[-2px] hover:bg-[#b0001e]
- Mobile: hambúrguer → painel lateral; bg rgba(10,10,10,0.98) border-white/10; links em coluna; fechar ao navegar

4. SEÇÃO HERO:
- Destaque tela cheia: left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] w-screen
- Background: #050505; border-b border-[#ea0029]/20; rounded-b-[2.5rem] md:rounded-b-[4rem]; z-20 shadow-2xl
- Mídia (mobile: relative h-[45svh] min-h-[340px]; desktop: absolute inset-0 h-[100svh]): object-cover, md:object-[80%_center], md:brightness-100 dark:md:brightness-[0.70] md:contrast-[1.1]
- Entrada da imagem: Framer Motion opacity 0→1, duration 1.8s ease easeOut
- CAMADAS DE GRADIENTE (todos hidden em mobile, block em md+):
  * Radial central: radial-gradient(ellipse at center, transparent, rgba(0,0,0,0.6)) opacity-80
  * Esquerda: w-3/4 xl:w-2/3 linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.80), transparent)
  * Inferior: h-56 linear-gradient(to top, rgba(0,0,0,0.90), rgba(0,0,0,0.50) 40%, transparent)
- Fades mobile: inset-x-0 bottom-0 h-[28svh] gradient-to-t from-[#050505] via-[#050505]/85 to-transparent; top-0 h-24 gradient-to-b from-[#050505]/75
- Conteúdo: mx-auto max-w-[90rem] px-6 pb-12 md:px-8 md:pb-[11rem] md:pt-[8.5rem] xl:px-12
- Badge/chip: inline-flex gap-3 rounded-full border border-white/[0.15] bg-black/[0.4] px-5 py-3.5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl; Framer: opacity 0→1, y +34→0, blur 10px→0, duration 1.35s ease [0.22,1,0.36,1]
- Eyebrow: Plus Jakarta Sans 10px extrabold uppercase tracking-[0.28em] text-white/65 + linha h-px w-6 sm:w-10 bg-[#ea0029]/60; Framer: opacity 0→1, y +34→0, blur 10px→0, duration 1.35s delay 0.15s
- Título principal: Bebas Neue text-[clamp(2.8rem,9vw,6.5rem)], leading-[0.85], tracking-[0.01em]; Framer: opacity 0→1, y +52→0, filter blur(16px)→0, duration 1.7s delay 0.25s ease [0.22,1,0.36,1]
- Subtítulo: Plus Jakarta Sans 1.05rem md:1.15rem text-white/80 max-w-[34rem] leading-[1.65]; Framer: opacity 0→1, y +36→0, blur 10px→0, duration 1.55s delay 0.45s
- Botão primário: min-h-[3.5rem] rounded-[0.9rem] bg-[#ea0029] px-8 py-4 text-[0.86rem] font-extrabold uppercase tracking-[0.08em] shadow-[0_16px_34px_rgba(234,0,41,0.28)] hover:translate-y-[-2px] hover:bg-[#b0001e] hover:shadow-[0_20px_42px_rgba(234,0,41,0.32)]; Framer: opacity 0→1, y +36→0, blur 10px→0, duration 1.55s delay 0.65s
- Botão secundário: min-h-[3.5rem] rounded-[0.9rem] border border-white/[0.18] bg-black/40 backdrop-blur-md hover:bg-black/60
- Painel de busca (apenas md+): grid 3 colunas + 1 botão; bg linear-gradient(180deg,rgba(20,20,20,0.82),rgba(15,15,15,0.72)) backdrop-blur-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl; células px-[1.65rem] py-[1.2rem] separadas por div w-px bg-white/[0.08]

5. CARD DE VEÍCULO:
- Container article.premium-card (adicione classe CSS): rounded-[1.45rem] bg-[var(--color-cream)] border border-white/[0.06] shadow-[0_18px_44px_rgba(0,0,0,0.22)] transition hover:shadow-[0_24px_56px_rgba(0,0,0,0.34)] hover:border-white/[0.12]
- Link de imagem: rounded-[1.45rem] m-3 mb-0 overflow-hidden h-80 block
- Imagem: h-80 w-full object-cover group-hover:scale-105 transition duration-700
- Overlay imagem: absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
- Sobre a imagem (abs bottom-4): marca em 11px extrabold uppercase tracking-[0.24em] text-white/80 + nome em Bebas Neue clamp(1.5rem,5vw,2.5rem) leading-[0.9] tracking-[0.04em]
- Botão ícone (abs bottom-4 right-4): rounded-full bg-[#ea0029] p-3 shadow-[0_8px_20px_rgba(234,0,41,0.3)] group-hover:scale-110 transition duration-500
- Preço: Plus Jakarta Sans extrabold clamp(1.55rem,3.2vw,2.2rem) leading-none tracking-[-0.04em] (NÃO Bebas Neue)
- Stats tiles (3 cols): rounded-[1rem] border border-white/5 bg-white/[0.02] p-3.5 — Quilometragem | Potência | Ano
- Sem barra de acento topo — o destaque vermelho está no botão circular da imagem

6. GRADE DE VEÍCULOS: grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[88rem] mx-auto py-24 px-6 md:px-12
   Entrada dos cards: whileInView opacity 0→1 y +20→0, stagger 0.08s, duration 0.6s, ease [0.22,1,0.36,1]

7. ESPAÇAMENTO DE SEÇÃO: py-24 px-6 sm:px-8 lg:px-12, max-w-[88rem] mx-auto
   Rótulo acima do título: Plus Jakarta Sans 11px weight-800 tracking-[0.26em] uppercase color-[#ea0029]
   Título da seção: Bebas Neue clamp(2rem,5vw,4rem) tracking-[0.01em]

8. PÁGINAS: / → Início | /estoque → Grade filtrável | /estoque/:id → Ficha do veículo | /financiamento → Simulador | /contato → Formulário+Mapa | /sobre → História+Equipe

9. MÍDIAS OBRIGATÓRIAS: foto/vídeo hero 1920×1080 escuro, 8+ fotos de veículos 1200×900, logo SVG branco

10. PERSONALIZE: substitua [NOME_NEGOCIO], #ea0029 pela cor da marca, fotos por fotos reais do estoque, dados de contato`,
      customization_notes:
        "Troque [NOME_NEGOCIO] pelo nome real. Para mudar a cor primária, substitua #ea0029 em todo o projeto (CSS vars + Tailwind classes). A fonte Bebas Neue pode ser substituída por Oswald 700 para tom mais comercial. O dock de busca do hero requer dados de estoque reais — adapte os campos para o inventário do cliente.",
    },
  },
  {
    id: "barber-01",
    slug: "barbearia-bravus",
    name: "Barbearia Bravus",
    niche: "Barbearia",
    tier: "free",
    tagline: "Atmosfera cinematográfica com scroll coreografado.",
    deploy_url: "https://barbearia-bravus-ofc.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/Barbearia-Bravus-Blueprint-WX",
    repo_access: "private",
    stack: ["HTML", "CSS", "JS", "GSAP", "Lenis"],
    sections: ["Hero", "Apple Sequence", "About", "Services", "Experts", "Contact"],
    colors: { background: "#0f0f0f", primary: "#d61c1c", accent: "#f5f5f5", muted: "#b3b3b3" },
    fonts: { display: "Chakra Petch", body: "Montserrat" },
    quality_score: 5,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Experiência cinematográfica com transições coreografadas e linguagem visual masculina premium. O ritmo do scroll conduz narrativa de autoridade e estilo.",
      sections_map: [
        "Header com navegação compacta",
        "Hero de impacto com CTA central",
        "Sequência cinematográfica por scroll",
        "Serviços com destaque de ticket",
        "Equipe e prova social",
        "Contato com mapa e WhatsApp",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#0f0f0f", usage: "Base dramática principal" },
          { role: "Primary", hex: "#d61c1c", usage: "Botões, ícones e estados ativos" },
          { role: "Text", hex: "#f5f5f5", usage: "Headlines e conteúdo principal" },
          { role: "Muted", hex: "#b3b3b3", usage: "Subtítulos e apoio" },
        ],
        typography: [
          { role: "Display", config: "Chakra Petch 700", usage: "Títulos e labels de seção" },
          { role: "Body", config: "Montserrat 400/500", usage: "Conteúdo e descrições" },
        ],
      },
      implementation_spec: [
        "Estruturar sequência de hero + portal scroll em wrapper dedicado para controle de pinning.",
        "Seção de serviços com cards de preço e destaque de oferta principal.",
        "Equipe com cards e estados hover para redes sociais.",
        "Contato com mapa embutido e CTA WhatsApp em destaque.",
      ],
      animations_spec: [
        "Preloader com progress bar e saída vertical (0.8s).",
        "Sequência cinematográfica em três frames com GSAP ScrollTrigger.",
        "Reveal de cards com offsets direcionais por seção.",
        "Cursor customizado apenas em dispositivos pointer:fine.",
      ],
      assets_references: [
        { type: "Frames da sequência", description: "Conjunto de imagens para canvas/scroll sequence", required: true },
        { type: "Fotos de trabalhos", description: "Galeria de cortes e barbas (mínimo 10)", required: true },
        { type: "Logotipo", description: "PNG transparente e versão compacta", required: true },
      ],
      qa_checklist: [
        "Validar suavidade da sequência em desktop e fallback adequado em mobile.",
        "Checar legibilidade de texto sobre imagem em todos os breakpoints.",
        "Confirmar funcionamento de CTA WhatsApp em iOS e Android.",
      ],
      universal_prompt: `Crie um website de barbearia premium de página única (single-page) para '[NOME_BARBEARIA]' com estética dark cinematográfica. Arquitetura: HTML + CSS + JavaScript vanilla + GSAP 3 + Lenis (scroll suave). Estrutura do arquivo: index.html + assets/css/styles.css + assets/js/main.js.

LIBS VIA CDN (adicione no final do body antes de main.js):
gsap@3.14.1/dist/gsap.min.js
gsap@3.14.1/dist/ScrollTrigger.min.js
swiper@12/swiper-bundle.min.js
lenis@1/dist/lenis.min.js
remixicon 4.6.0 (no <head>)

FONTES GOOGLE (no <head>): Chakra Petch (400, 500, 700) | Montserrat (300..900 + italic) | Playfair Display (400, 400 italic)

---

1. TOKENS DE DESIGN — adicione no início do styles.css:
:root {
  --first-color: #d61c1c; --first-color-alt: #b31717;
  --first-color-glow: rgba(214, 28, 28, 0.3);
  --body-color: hsl(0, 0%, 6%);
  --container-color: hsl(0, 0%, 10%);
  --title-color: hsl(0, 0%, 95%);
  --text-color: hsl(0, 0%, 70%);
  --text-color-light: hsl(0, 0%, 55%);
  --glass-bg: hsla(0, 0%, 10%, .7);
  --glass-border: hsla(0, 0%, 100%, .1);
  --border-color: hsla(0, 0%, 30%, .4);
  --body-font: "Montserrat", sans-serif;
  --second-font: "Chakra Petch", sans-serif;
  --serif-font: "Playfair Display", serif;
  --transition-fast: .3s ease;
  --transition-smooth: .5s cubic-bezier(.4, 0, .2, 1);
}
body { background: var(--body-color); color: var(--text-color); font-family: var(--body-font); overflow-x: hidden; }
h1,h2,h3,h4 { font-family: var(--second-font); font-weight: 700; color: var(--title-color); line-height: 120%; }
.container { max-width: 1120px; margin-inline: 1.5rem; }
.section { padding-block: 5rem 1rem; }

2. PRELOADER:
.preloader { position:fixed; inset:0; z-index:9999; background:var(--body-color); display:flex; align-items:center; justify-content:center; }
Dentro: logo PNG (400px max 75vw) + barra abaixo (margin-top 2.5rem).
Logo: animation preloader-breathe 2.5s ease-in-out infinite — scale 1↔1.05 + filter drop-shadow(0 0 20px→50px rgba(214,28,28,0.3→0.6)).
Barra: 180×2px, bg rgba(255,255,255,0.08), overflow-hidden. Preenchimento interno: linear-gradient(90deg, #d61c1c, #ff6b6b), animation preloader-fill 2s ease-in-out forwards (width 0%→100%).
Saída: .preloader--hide { animation: preloader-exit 0.8s cubic-bezier(.4,0,.2,1) forwards } — translateY(-100%).

3. CURSOR CUSTOMIZADO (pointer:fine — desativar em touch):
Dois divs fixed pointer-events-none z-[9998]: .cursor-dot (8×8px, border-radius 50%, bg #d61c1c) + .cursor-outline (36×36px, border-radius 50%, border 1px solid rgba(214,28,28,0.5)).
Dot: segue mouse imediatamente (mousemove). Outline: lerp 0.12 em requestAnimationFrame.
Hover sobre a/button: dot scale 1.6 + outline scale 1.4, transition 0.2s.

4. HEADER (.header):
position:fixed; width:100%; top:0; left:0; z-index:1000.
Padrão: background transparent.
Classe .scroll-header (JS: scrollY > 80):
  .scroll-header::before { position:absolute; inset:0; background:var(--glass-bg); backdrop-filter:blur(16px); z-index:-1 }
  .scroll-header::after { position:absolute; bottom:0; left:0; width:100%; height:1px; background:linear-gradient(90deg, transparent, var(--first-color), transparent); background-size:200% 100%; animation:header-shimmer 3s ease-in-out infinite }
@keyframes header-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
Logo (.nav__logo): Chakra Petch 700, letter-spacing 3px, cor branca. Hover: cor #d61c1c.
Links (.nav__link): Chakra Petch, small, weight 500, letter-spacing 2px, MAIÚSCULAS, cor var(--text-color). Hover/ativo: cor #d61c1c. Sublinhado animado: ::after { height:2px; bg:#d61c1c; width 0→100% no hover }.
Mobile (<1150px): .nav__menu { position:fixed; top:0; right:-100%; width:80%; height:100vh; padding:6rem 3rem 0; background:var(--body-color); border-left:1px solid var(--glass-border); transition:right var(--transition-smooth) }. .show-menu { right:0 }.

5. HERO (.home):
position:sticky; top:0; height:100vh; overflow:hidden.
Imagem de fundo (.home__bg-img): absolute inset-0, object-cover, filter:brightness(0.65).
Overlay lateral (.home__bg::after): linear-gradient(105deg, rgba(10,8,3,0.78) 0%, rgba(10,8,3,0.5) 40%, rgba(10,8,3,0.2) 65%, transparent).
Fade inferior (.home::after): absolute bottom-0, height:180px, linear-gradient(to top, #000 0%, transparent).
Grain (.home::before): SVG fractalNoise inset-0, opacity:0.03.
Título (.home__title): linear-gradient(135deg, #fff 0%, #d61c1c 50%, #b31717 100%) text-gradient; letter-spacing:4px; line-height:110%; mobile: clamp(2rem,8vw,3.5rem).
Descrição (.home__description): cor hsl(0,0%,85%), max-w 540px, line-height:170%; text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.7).
Logo flutuante (.home__logo): 350px, filter:drop-shadow(0 0 50px rgba(214,28,28,0.3)); @keyframes floatLogo { 0%,100%{translateY(0)} 50%{translateY(-15px)} } 6s ease-in-out infinite.
Botão (.button): linear-gradient(135deg, #d61c1c, #b31717); Chakra Petch 700, small, letter-spacing:2px, maiúsculas; padding:1rem 2rem; rounded 0.5rem; box-shadow:0 4px 24px rgba(214,28,28,0.3); hover: translateY(-3px) shadow 0 8px 32px rgba(214,28,28,0.3).
Brilho botão (.button::before): left:-100%→100% transition 0.7s ease; linear-gradient(90deg, transparent, hsla(0,0%,100%,.3), transparent).

6. WRAPPER HERO+SEQUÊNCIA (.hero-sequence-wrapper):
Envolva .home E .apple-sequence-wrapper juntos em div.hero-sequence-wrapper (sem CSS próprio, apenas contêiner).
.apple-sequence-wrapper { position:relative; height:460vh; margin-top:-100vh; z-index:2 } (mobile:650dvh).
.apple-sequence { position:sticky; top:0; height:100vh; background:#000; overflow:hidden; clip-path:circle(0% at 50% 100%); will-change:clip-path }.
Canvas (.apple-sequence__bg-canvas): absolute inset-0, 100%×100%, will-change:contents. Carregue via JS um array de frames PNG em public/assets/video-frames/ (nomeados 0001.png a 0090.png ou similares). No ScrollTrigger onUpdate, calcule o índice do frame pela porcentagem do scroll e desenhe no canvas via ctx.drawImage.
Overlay (.apple-sequence__bg-overlay): absolute inset-0; radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, hsla(0,0%,6%,0.7) 60%, var(--body-color) 90%) + box-shadow:inset 0 0 100px 60px var(--body-color).
3 frames de texto (.apple-sequence__frame): position absolute, centralizados, opacity:0 por padrão.
  Frame 1: eyebrow "ARTE · PRECISÃO · TRADIÇÃO" + headline "A arte da <em>precisão</em>". Headline em: gradient metálico linear-gradient(135deg, #fff 0%, #c4c4c4 40%, #fff 80%) text-gradient.
  Frame 2: 3 estatísticas ("+5.000 Clientes Satisfeitos | 7+ Anos de Tradição | 4 Barbeiros Experts"). Divisores: w-1px h-70px bg:linear-gradient(180deg, transparent, #d61c1c, transparent) opacity:0.35.
  Frame 3: ornamento ✦ + tagline "ONDE CADA CORTE É UMA <strong>OBRA-PRIMA</strong>". Strong .tagline-big: Playfair Display italic clamp(2.8rem,10vw,4.5rem); background:linear-gradient(135deg, #d61c1c 0%, #ff4545 25%, #fff 50%, #ff4545 75%, #d61c1c 100%) background-size:200% auto; @keyframes bloodShine { 0%{bg-pos:200% center} 100%{bg-pos:-200% center} } 5s linear infinite.
JS ScrollTrigger scrub:1 para clip-path e fade dos frames. Barra de progresso no rodapé (3px, linear-gradient(90deg, #d61c1c, #ff6b6b)).

7. SOBRE (.about):
Parallax: background-image url('...'), background-attachment:fixed, position:relative.
Overlay escuro: ::before rgba(0,0,0,0.45); ::after degradê top 350px de --body-color para transparent.
Duas colunas em desktop: dados (texto, counters, CTA) + imagem com frame decorativo.
Rótulo (.about__eyebrow): Chakra Petch, smaller size, letter-spacing:4px, MAIÚSCULAS, cor #d61c1c.
Descrição: font-family var(--serif-font), font-style:italic, line-height:180%.
Números: Chakra Petch 700, big size, cor #d61c1c, text-shadow:0 4px 16px rgba(0,0,0,0.8). Divisor: w-1px h-56px linear-gradient(180deg, transparent, #d61c1c, transparent) opacity:0.35.
Imagem: border-radius:1rem; box-shadow:0 0 40px rgba(214,28,28,0.3), 0 8px 30px rgba(0,0,0,0.4). Frame decorativo (.about__img-frame): inset:-10px, border:1px solid #d61c1c, opacity:0.18→0.35 no hover.
Badge sobre a imagem: "BRAVUS / BARBEARIA PREMIUM"; bg rgba(10,8,3,0.82) backdrop-blur(10px) border rgba(214,28,28,0.35) border-radius:2rem.
Reveal: .about__data { transform:translateX(-60px); opacity:0 → visible:opacity:1 translateX(0) 0.65s ease }.

8. TRABALHOS (.work) — galeria Swiper:
Swiper horizontal, loop:true, slidesPerView 1.2 (mobile) / 2.5 (768px) / 3.5 (1150px+), spaceBetween 16, grabCursor:true.
Card (.work__card): border-radius:1rem, overflow:hidden; hover: border-color rgba(214,28,28,0.3), box-shadow:0 0 20px rgba(214,28,28,0.12).
Imagem: height:350px, object-cover; hover: scale(1.08) brightness(0.65) transition 0.5s.
Overlay: linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.78) 100%).
Tag (.work__tag): bg #d61c1c, Chakra Petch 700, smaller, letter-spacing:1.5px, MAIÚSCULAS, padding:.35rem .9rem, rounded .35rem; hover: translateY(-3px) shadow 0 4px 20px rgba(214,28,28,0.45).
Botões de navegação: 48×48px circle, bg:var(--container-color), border:var(--border-color); hover: bg:#d61c1c, border:#d61c1c, shadow:0 4px 20px rgba(214,28,28,0.3).

9. SERVIÇOS (.service) — parallax-bg:
5 cards de serviço em coluna (desktop: 2 colunas: lista + testimonials).
Card (.service__card): padding:1.6rem 2rem; background:rgba(10,8,3,0.35); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.05); border-left:3px solid #d61c1c; border-radius:.75rem.
Hover: translateY(-4px) translateX(4px); box-shadow:0 0 20px rgba(214,28,28,0.3), 0 4px 16px rgba(0,0,0,0.3).
Ícone: 48×48px, linear-gradient(135deg, #d61c1c, #b31717), rounded .5rem, cor fundo da barbearia.
Preço: Chakra Petch 700, h2 size, cor #d61c1c.
Card em destaque (.service__card--featured): border:#d61c1c, box-shadow:0 0 0 1px rgba(214,28,28,0.3). Badge "POPULAR": bg:#d61c1c, Chakra Petch 700, 0.625rem, abs top-.5rem right-.75rem.
Serviços padrão (substitua pelos reais): CORTE ADULTO R$60 | CORTE INFANTIL R$35 | BARBA COMPLETA R$45 | PEZINHO R$25 | CORTE + BARBA R$90 (POPULAR).
Testimonials (.service__testimonials): bg:var(--container-color), border:var(--border-color), border-radius:1rem, padding:2rem. Swiper de 3 depoimentos com paginação — bullet ativo: bg:#d61c1c, width:24px, border-radius:4px.

10. BARBEIROS (.expert):
Grade 2 colunas (mobile) / 4 colunas (1150px+).
Card (.expert__card): overflow:hidden, text-align:center; hover: translateY(-8px), box-shadow:0 10px 30px rgba(0,0,0,0.5).
Foto: object-cover. Ao hover: scale(1.05) 0.5s ease.
Overlay glow: linear-gradient(to top, rgba(214,28,28,0.25), transparent 60%); opacity:0→1 no hover 0.3s.
Overlay social (.expert__overlay): absolute inset-0, flex itens centralizados; ícones LinkedIn + Instagram + Facebook em #d61c1c, opacity:0→1 no hover.
Nome (.expert__name): Chakra Petch 700. Cargo (.expert__profession): text-color-light, smaller, letter-spacing.
Barbeiros padrão: Jonh Deep (Mestre Barbeiro) | Max Pell (Estilista Sênior) | João Silva (Barbeiro) | Carlos Mendes (Barbeiro).

11. CONTATO (.contact):
2 colunas (desktop): CTA+mapa | info.
Botão WhatsApp: .button.button--whatsapp; texto "Agende Via WhatsApp <ícone>".
Mapa: Google Maps iframe 100% width, height:300px, border-radius:1rem, border:0.
3 unidades com endereço + telefone + horário. Ícones RemixIcon.
Horário geral: Seg-Sáb 9h-20h | Dom 9h-18h.

12. RODAPÉ (.footer):
4 colunas: brand (logo + descrição + e-mail) | menu | fale conosco | redes sociais.
Redes: Facebook, Instagram, X, YouTube. Copyright: © [ano] [NOME_BARBEARIA].

13. ANIMAÇÕES REVEAL (IntersectionObserver):
.reveal { opacity:0; transform:translateY(22px); transition:opacity 0.65s ease, transform 0.65s ease }
.reveal.visible { opacity:1; transform:translateY(0) }
About data: translateX(-60px) em vez de Y.

14. MÍDIAS OBRIGATÓRIAS: pasta public/assets/video-frames/ com frames PNG sequenciais (mín. 60 frames) para a sequência cinematográfica; hero-barbearia.png 1920×1080; 10+ work-img-N.png de trabalhos realizados; logo-sem-fundo.png + favicon.png; backgrounds/background-1.png para parallax; expert-img-N.png fotos dos barbeiros.

15. PERSONALIZE: substitua [NOME_BARBEARIA], #d61c1c pela cor da marca, endereços e telefones reais, WhatsApp real (api.whatsapp.com/send?phone=55...), fotos reais da equipe e trabalhos, preços reais.`,
      customization_notes:
        "Atualize preços e localização. Mantenha a hierarquia visual e o contraste forte para preservar percepção premium.",
    },
  },
  {
    id: "food-01",
    slug: "aura-burger",
    name: "Aura Burger",
    niche: "Alimentação",
    tier: "free",
    tagline: "Identidade urbana para food brand premium.",
    deploy_url: "https://aura-burger.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/Aura-Burger-Blueprint-WX",
    repo_access: "private",
    stack: ["React", "Vite", "Tailwind", "Motion"],
    sections: ["Hero", "Menu", "Sobre", "Contato"],
    colors: { background: "#080808", primary: "#c8102e", accent: "#e85d04", muted: "#888888" },
    fonts: { display: "Oswald", body: "Barlow" },
    quality_score: 4,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Food brand com energia urbana, contraste alto e foco em produto. Visual editorial com texturas e grão.",
      sections_map: [
        "Hero com produto em destaque",
        "Menu com blocos de combos",
        "Prova social curta",
        "Bloco de localização e CTA",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#080808", usage: "Base escura principal" },
          { role: "Primary", hex: "#c8102e", usage: "Chamadas e microdestaques" },
          { role: "Accent", hex: "#e85d04", usage: "Destaques de produto e preço" },
          { role: "Muted", hex: "#888888", usage: "Elementos secundários" },
        ],
        typography: [
          { role: "Display", config: "Oswald 700", usage: "Títulos e nomes de produto" },
          { role: "Body", config: "Barlow 400", usage: "Descrição e apoio" },
        ],
      },
      implementation_spec: [
        "Hero com produto principal e CTA imediato para pedido.",
        "Grid de menu com categorias e cards de combos.",
        "Faixa de diferenciais com 3 argumentos de valor.",
        "Bloco final com contato e links de pedido.",
      ],
      animations_spec: [
        "Fade-up de entrada por seção.",
        "Hover em cards de menu com escala 1.02.",
        "Microtransição no CTA principal com glow suave.",
      ],
      assets_references: [
        { type: "Fotos de produto", description: "Imagens de hambúrgueres em alta resolução", required: true },
        { type: "Vídeo curto", description: "Loop de chapa/produção para hero opcional", required: false },
      ],
      qa_checklist: [
        "Checar legibilidade dos preços no mobile.",
        "Validar tamanho e nitidez das imagens de produto.",
        "Testar links externos de pedido.",
      ],
      universal_prompt: `Crie um website de hamburgueria premium de página única para '[NOME_HAMBURGERIA]'. Stack: React + Vite + TypeScript + Tailwind CSS v4 + Framer Motion (motion/react) + React Router DOM.

PACOTES NPM: motion, react-router-dom, lucide-react
FONTES GOOGLE (no index.html): Oswald (400, 700, 900), Inter (300, 400, 500, 700)

---

1. TOKENS DE DESIGN — adicione no index.css:
@import "tailwindcss";
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-oswald: "Oswald", sans-serif;
  --color-black: #080808; --color-dark: #111111;
  --color-card: #161616; --color-border: #222222;
  --color-red: #C8102E; --color-orange: #E85D04;
  --color-yellow: #FFB703; --color-white: #F5F5F5; --color-gray: #888888;
}
body { @apply bg-black text-white font-sans antialiased overflow-x-hidden; }
h1,h2,h3,h4,h5,h6 { @apply font-oswald uppercase tracking-[-0.02em]; }
Grain overlay (body::after): fixed inset-0 z-[9999] pointer-events-none opacity-[0.04] SVG fractalNoise background-size 180px 180px.
Grade de fundo (.bg-grid-lines): linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px) + 90deg; background-size 64px 64px.

2. NAVBAR:
fixed inset-x-0 top-0 z-50; bg-black/90 backdrop-blur-sm border-b border-border.
Logo: Oswald 700, 1.5rem uppercase tracking-[0.15em], branco.
Links: Inter 500, 13px, uppercase, tracking-[0.12em], text-gray; hover: text-white transition 220ms.
Botão CTA: bg-red text-white font-oswald font-bold uppercase tracking-widest; SEM border-radius (cantos retos — identidade editorial urbana).

3. SEÇÃO HERO:
min-h-[90vh] flex items-center justify-center relative overflow-hidden.
Fundo: div absolute inset-0 bg-black com imagem de hambúrguer em chapa opacity-40 object-cover.
Gradiente superior: absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent.
Gradiente lateral: absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent.
Badge local: border border-border bg-dark/50 backdrop-blur-sm px-4 py-2; Inter 700 tracking-widest uppercase text-sm text-orange.
Título: Oswald font-black text-[clamp(4rem,10vw,9rem)] leading-[0.9] tracking-tighter uppercase branco; segunda linha com classe .text-stroke-orange (-webkit-text-stroke: 1px #E85D04; color: transparent); Framer: opacity 0→1 y +50→0 duration 0.8s delay 0.2s.
Subtítulo: Inter 400 text-xl md:text-2xl text-gray max-w-2xl; Framer: opacity 0→1 y +30→0 duration 0.8s delay 0.4s.
Botão CTA: bg-red hover:bg-orange text-white px-10 py-5 font-oswald font-bold uppercase tracking-widest text-lg transition-colors; SEM border-radius; flex items-center gap-3; ícone ChevronRight group-hover:translate-x-1.

4. MARQUEE STRIP:
bg-orange py-4 overflow-hidden border-y border-border.
Dois divs com animate-marquee (ambos animam translateX 0→-50% em 25s linear infinite): texto "AURA BURGER • [TEXTO]" em Oswald font-black 3xl uppercase tracking-widest text-black. Bolinha separadora: w-3 h-3 bg-black rounded-full.

5. SEÇÃO DESTAQUES:
py-32 bg-black bg-grid-lines.
Título: Oswald font-black text-5xl md:text-7xl uppercase + span text-red.
Grade 2 colunas em md: cards com bg-card border border-border overflow-hidden.
Card de produto: imagem h-80 object-cover w-full group-hover:scale-105 transition duration-700; overlay to-t from-black/80 to-transparent; nome do produto em Oswald 700 + preço em text-orange.

6. MENU (Página separada /menu):
Filtros por categoria: botões Oswald 700 uppercase; ativo: bg-red text-white; inativo: border border-border text-gray.
Grade: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.
Card: bg-card border border-border; imagem object-cover h-56; info: nome Oswald 700, descrição Inter text-gray text-sm, preço text-orange font-oswald font-bold text-2xl.

7. SEÇÃO SOBRE:
Split: imagem (aspect-square md:aspect-auto) + texto.
Fundo com bg-grid-lines. Títulos Oswald font-black. Parágrafos Inter text-gray.
3 estatísticas: número em Oswald font-black text-5xl text-orange + rótulo em Inter uppercase tracking-widest text-gray text-sm.

8. SEÇÃO CONTATO:
bg-dark. Endereço, redes sociais, horários. Botão para pedido externo (iFood/WhatsApp): bg-red sem border-radius.

9. RODAPÉ: bg-black border-t border-border. Logo + texto sobre a hamburgueria + links + copyright.

10. PÁGINAS: / → Início | /menu → Cardápio com filtros | /sobre → Equipe e história | /contato → Endereço e horários

11. MÍDIAS OBRIGATÓRIAS: 1 foto hero (hambúrguer em chapa escura, 1920×1080), 10+ fotos de produtos para o menu, fotos do ambiente, logo SVG.

12. PERSONALIZE: substitua [NOME_HAMBURGERIA], #C8102E e #E85D04 pela identidade visual da marca, textos de descrição dos produtos, preços reais e link de pedido online.`,
      customization_notes:
        "Substitua paleta pelo branding do cliente e inclua pratos assinados com fotos reais.",
    },
  },
  {
    id: "dental-01",
    slug: "lumina-odontologia",
    name: "Lumina Odontologia",
    niche: "Odontologia",
    tier: "premium",
    tagline: "Clínica premium com foco em confiança e clareza.",
    deploy_url: "https://lumina-odontologia.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/-Lumina-Odontologia-Blueprint-WX",
    repo_access: "private",
    stack: ["Next.js", "Tailwind", "Framer Motion", "GSAP"],
    sections: ["Hero", "Treatments", "Team", "Technology", "FAQ"],
    colors: { background: "#050505", primary: "#0284c7", accent: "#e5e4e2", muted: "#94a3b8" },
    fonts: { display: "Cormorant", body: "Inter" },
    quality_score: 4,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Clínica premium com composição limpa e foco em confiança clínica. Visual sofisticado com densidade baixa e alto controle de contraste.",
      sections_map: [
        "Hero institucional",
        "Tratamentos em cards",
        "Equipe e credenciais",
        "Tecnologia e diferenciais",
        "FAQ e CTA final",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#050505", usage: "Base escura institucional" },
          { role: "Primary", hex: "#0284c7", usage: "Ação e elementos de confiança" },
          { role: "Accent", hex: "#e5e4e2", usage: "Detalhes elegantes" },
          { role: "Muted", hex: "#94a3b8", usage: "Texto de apoio" },
        ],
        typography: [
          { role: "Display", config: "Cormorant 600", usage: "Títulos institucionais" },
          { role: "Body", config: "Inter 400/500", usage: "Conteúdo clínico" },
        ],
      },
      implementation_spec: [
        "Hero com proposta de valor clínica e CTA de consulta.",
        "Seção de tratamentos com resumo técnico por card.",
        "Bloco de equipe com credenciais.",
      ],
      animations_spec: [
        "Entradas sutis com fade-up curto.",
        "Transições suaves entre blocos e cards.",
      ],
      assets_references: [
        { type: "Fotos da clínica", description: "Recepção, consultório e equipe", required: true },
        { type: "Ícones de especialidades", description: "Conjunto vetorial consistente", required: true },
      ],
      qa_checklist: [
        "Validar clareza de conteúdo clínico em mobile.",
        "Checar consistência entre CTA e formulário.",
      ],
      universal_prompt: `Crie um website para clínica odontológica premium '[NOME_CLINICA]'. Stack: Next.js 15 (App Router) + Tailwind CSS v4 + Framer Motion + Lenis (scroll suave) + next/font (Cormorant Garamond + Inter).

PACOTES NPM: framer-motion, lenis, @next/font, lucide-react
FONTES (next/font/google em layout.tsx): Cormorant_Garamond (400, 500, 600, 700 + italic), Inter (400, 500, 600)

---

1. TOKENS DE DESIGN — adicione no globals.css:
@import "tailwindcss";
@theme {
  --color-brand-accent: #0284C7;
  --color-brand-platinum: #E5E4E2;
  --font-serif: var(--font-cormorant);
  --font-sans: var(--font-inter);
}
:root {
  --background: #F8F9FA; --foreground: #1A1A1A;
  --muted: #64748B;
  --glass-bg: rgba(255,255,255,0.7);
  --glass-border: rgba(0,0,0,0.05);
}
.dark {
  --background: #050505; --foreground: #F5F5F5;
  --muted: #94A3B8;
  --glass-bg: rgba(255,255,255,0.03);
  --glass-border: rgba(255,255,255,0.08);
}
body { background: var(--background); color: var(--foreground); font-family: var(--font-inter); }
Utility: .glass { bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md }
Gradient text: .text-gradient-accent { bg-gradient-to-r from-[#0284C7] to-blue-400 bg-clip-text text-transparent }

2. LAYOUT (layout.tsx):
Carregue Cormorant Garamond (variáveis: --font-cormorant) e Inter (--font-inter) via next/font.
Inclua Lenis para scroll suave (inicialize em 'use client' wrapper).
Navbar fixa + Footer globais.

3. NAVBAR:
fixed inset-x-0 top-0 z-50; padrão: bg-transparent; scrolled (>60px): glass + border-b border-[var(--glass-border)] shadow-sm.
Logo: Cormorant Garamond 600, 1.5rem; "Lumina Odontologia" ou variante.
Links: Inter 500, 13px, tracking-[0.08em]; hover: text-[#0284C7] transition 220ms.
Botão CTA "Agendar Consulta": bg-[#0284C7] text-white rounded-full px-6 py-2.5 text-sm font-semibold; hover: brightness(1.1) translateY(-1px).
Toggle modo claro/escuro.

4. SEÇÃO HERO:
min-h-[100svh] flex items-center relative overflow-hidden.
Fundo: imagem da clínica + gradiente to-t from-background/90 to-transparent.
Badge: glass rounded-full px-5 py-2.5; ícone + "Odontologia Premium · [CIDADE]" em Inter 12px uppercase tracking-widest text-[#0284C7].
Título: Cormorant Garamond 700 text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-tight; palavra de destaque em italic; Framer: opacity 0→1 y +40→0 blur 12px→0 duration 1.4s ease [0.16,1,0.3,1].
Subtítulo: Inter 400 text-lg md:text-xl text-muted max-w-[36rem] leading-[1.7]; Framer: opacity 0→1 y +24→0 duration 1.2s delay 0.3s.
Botões: primário bg-[#0284C7] rounded-full + secundário glass rounded-full; Framer: opacity 0→1 y +24→0 duration 1.2s delay 0.5s.
3 chips de confiança abaixo dos botões: glass rounded-full px-4 py-2 text-sm flex items-center gap-2 ícone CheckCircle2 text-[#0284C7].

5. TRATAMENTOS (grid de cards):
Título seção: Cormorant Garamond 700 text-4xl md:text-5xl; subtítulo Inter text-muted.
Grade: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.
Card: glass rounded-2xl p-6 hover:shadow-md hover:border-[#0284C7]/30 transition-all 300ms.
Ícone: 48×48px rounded-xl bg-[#0284C7]/10 flex items-center justify-center text-[#0284C7].
Nome: Cormorant Garamond 600 text-xl. Descrição: Inter text-muted text-sm leading-relaxed.

6. EQUIPE:
Grid 2 colunas (md: 3 ou 4 colunas). Card: foto circular ou quadrada arredondada + nome Cormorant + cargo Inter text-muted + CRO.
Reveal: Framer whileInView opacity 0→1 y +30→0 stagger 0.1s por card.

7. FAQ (Accordion):
Use Radix UI Accordion ou implementação manual. Cada pergunta: Inter 500 text-base; resposta: Inter text-muted text-sm leading-relaxed. Separador: border-b border-[var(--glass-border)].

8. CTA FINAL:
glass rounded-3xl p-10 md:p-16 text-center. Título grande Cormorant. Botão "Agendar Consulta" bg-[#0284C7] rounded-full px-8 py-4 text-lg.

9. PÁGINAS (App Router): / → Homepage | /tratamentos → Lista completa | /tratamentos/[slug] → Detalhe | /equipe → Profissionais | /contato → Formulário + Mapa

10. MÍDIAS OBRIGATÓRIAS: foto hero da clínica (fachada ou recepção), fotos dos consultórios, fotos da equipe, ícones SVG dos tratamentos.

11. PERSONALIZE: substitua [NOME_CLINICA], [CIDADE], #0284C7 pela cor da especialidade (azul dental = #0284C7 padrão), textos e preços reais, médicos reais com CRO.`,
      customization_notes:
        "Trocar paleta para identidade da clínica e inserir credenciais reais dos profissionais.",
    },
  },
  {
    id: "auto-02",
    slug: "aura-motors-v1",
    name: "Aura Motors V1",
    niche: "Automotivo",
    tier: "premium",
    tagline: "Showroom institucional com acabamento luxo e tom editorial.",
    deploy_url: "https://auramotors-v1.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/Aura-Motors-V1-Blueprint-WX",
    repo_access: "private",
    stack: ["Next.js", "Tailwind", "Framer Motion", "Lenis"],
    sections: ["Hero", "Inventory", "Services", "Testimonials", "About", "Contact"],
    colors: { background: "#050505", primary: "#d4af37", accent: "#ffd700", muted: "#a1a1aa" },
    fonts: { display: "Playfair Display", body: "Inter" },
    quality_score: 5,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Showroom institucional premium com linguagem de luxo e foco em credibilidade. Movimento sutil, superfícies escuras e acento dourado para percepção de alto valor.",
      sections_map: [
        "Hero editorial com CTA duplo",
        "Inventário com destaque de veículos",
        "Serviços financeiros e trade-in",
        "Depoimentos e autoridade",
        "Contato consultivo final",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#050505", usage: "Fundo principal" },
          { role: "Primary", hex: "#d4af37", usage: "CTAs e detalhes de luxo" },
          { role: "Accent", hex: "#ffd700", usage: "Highlights e microdetalhes" },
          { role: "Muted", hex: "#a1a1aa", usage: "Texto auxiliar" },
        ],
        typography: [
          { role: "Display", config: "Playfair Display 700", usage: "Titulação de luxo" },
          { role: "Body", config: "Inter 400/500", usage: "Corpo e suporte" },
        ],
      },
      implementation_spec: [
        "CSS Variables no :root: --color-bg:#050505; --color-paper:#0a0a0a; --color-surface:#111111; --color-gold:#d4af37; --color-gold-bright:#ffd700; --color-muted:#a1a1aa; --font-display:'Playfair Display',serif; --font-body:'Inter',sans-serif",
        "Lenis scroll smooth configurado no root layout (Next.js App Router). Duration 1.2, easing t => Math.min(1, 1.001 - Math.pow(2,-10*t))",
        "Navbar: position fixed, inset-x-0 top-0 z-50, max-w-[84rem] mx-auto. Padrão: bg-transparent. Scrolled (>40px): bg-[rgba(5,5,5,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.12)]. Logo em Playfair Display 700 1.4rem com acento em gold. Links Inter 500 13px tracking-[0.12em] uppercase",
        "Hero: h-screen min-h-[720px] com background fixed (parallax sutil). Foto de showroom cobrindo inset-0 com filter brightness(0.45) contrast(1.08). Overlay linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.95) 100%)",
        "Hero conteúdo: eyebrow em Inter 800 10px tracking-[0.32em] uppercase color gold + linha 40px bg gold/40; título Playfair Display italic 400 clamp(3rem,8vw,6.5rem) leading-[0.95] (não bold — o peso italic regular é mais editorial); subtítulo Inter 400 1.1rem text-muted max-w-[36rem] leading-[1.7]; CTA duplo — primário bg gold text-black hover:bg-gold-bright, secundário border-gold/40 text-gold hover:bg-gold/5",
        "Inventário (VehicleGrid): grid 1/2/3 colunas, gap-8. Cards com border-radius 0.5rem (não arredondados demais — estética editorial). Hover: translateY(-6px), border gold/30, shadow 0 24px 48px rgba(212,175,55,0.08)",
        "VehicleCard anatomia: imagem h-72 object-cover + overlay gradient-to-t from-paper; badge de ano em Inter 800 10px uppercase tracking-[0.24em] text-gold; nome em Playfair Display 500 italic 1.75rem; especificações em linha (km · potência · ano) separadas por · em text-muted 13px; preço em Inter 700 1.5rem tabular-nums; CTA rodapé 'Ver ficha completa' com seta →",
        "Seção Serviços (Financiamento, Trade-in, Garantia estendida): 3 colunas com ícone outline gold 32×32 + título Playfair italic 1.5rem + descrição 3 linhas. Separadores verticais border-l border-gold/10",
        "Seção Depoimentos: carrossel horizontal com snap. Cada card bg-surface padding 2.5rem, aspas ornamentais em Playfair Display 4rem italic gold/30 no topo, depoimento em Playfair italic 1.125rem leading-[1.7], assinatura Inter 600 13px + nome em Playfair 500 italic",
        "Seção Sobre: split 60/40. Lado texto com eyebrow + título Playfair italic + 3 parágrafos Inter. Lado imagem (foto do showroom) com overlay gold linear-gradient ao hover (opacity 0.08)",
        "Contato: formulário (nome, email, telefone, mensagem) em grid 2 cols. Inputs bg-paper border-white/5 focus:border-gold padding 1rem 1.25rem. Botão submit full-width gold. Lado direito com infos (endereço, horário, WhatsApp) em lista",
        "Footer: 4 colunas (brand + links + contato + social). Linha superior border-gold/10. Copyright em Inter 12px text-muted centralizado",
      ],
      animations_spec: [
        "Easing padrão: [0.22, 1, 0.36, 1] (cubic-bezier expo-out) em TODAS as entradas",
        "Hero eyebrow: opacity 0→1, y +20→0; duration 1.2s, delay 0.1s",
        "Hero título: opacity 0→1, y +40→0, blur 12px→0; duration 1.6s, delay 0.25s",
        "Hero subtítulo: opacity 0→1, y +24→0; duration 1.4s, delay 0.5s",
        "Hero CTAs: opacity 0→1, y +24→0; duration 1.3s, delay 0.7s (stagger 0.08s entre os dois botões)",
        "Vehicle cards (whileInView, once:true, margin '-100px'): opacity 0→1, y +30→0; stagger 0.1s, duration 0.7s",
        "Navbar entrada: opacity 0→1, y -10→0; duration 0.5s",
        "Hover cards: translateY(-6px) + border/shadow; transition 400ms ease-out",
        "Hover CTA primário: translateY(-2px) + shadow 0 18px 40px rgba(212,175,55,0.22); transition 280ms",
        "Parallax sutil hero: useTransform do scroll Framer → imagem moves y 0→-40px entre scroll 0→500px",
        "Carrossel depoimentos: auto-advance 6s, pausa no hover",
      ],
      assets_references: [
        { type: "Foto hero showroom", description: "Interior de showroom com carro em destaque, tons neutros/escuros, 1920×1080 ou maior, landscape", required: true },
        { type: "Foto sobre", description: "Foto ambiente/equipe do showroom, 1200×1600 portrait", required: true },
        { type: "Fotos de veículos", description: "Mínimo 6 fotos em fundo neutro escuro (preferencialmente o próprio showroom), 1600×1200, proporção 4:3", required: true },
        { type: "Logotipo", description: "SVG monocromático branco + variação em gold #d4af37", required: true },
        { type: "Favicon", description: "32×32 e 192×192 PNG, fundo transparente ou paper", required: false },
      ],
      qa_checklist: [
        "Navbar transparente no topo, fica sólida + blur ao scrollar >40px",
        "Contraste do gold #d4af37 sobre paper #0a0a0a passa AA (ratio ≥4.5 para texto 14px+)",
        "Playfair Display italic carrega e não tem flash de fonte (preload no <head>)",
        "Parallax do hero desabilitado em mobile (prefers-reduced-motion ou <768px)",
        "Carrossel de depoimentos acessível via teclado (setas, escape)",
        "Formulário de contato valida email e telefone, envia via API route",
        "Preços em tabular-nums alinhados verticalmente entre cards",
      ],
      universal_prompt: `Crie um website completo para concessionária automotiva PREMIUM INSTITUCIONAL '[NOME_CONCESSIONARIA]'. Tom editorial de luxo (não esportivo), estética de joalheria + revista de arquitetura. Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Framer Motion + Lenis (scroll suave) + next/font.

PACOTES NPM: framer-motion, lenis, lucide-react
FONTES (via next/font/google): Playfair Display (400, 400 italic, 500 italic, 700) | Inter (300, 400, 500, 600, 700, 800)

---

1. TOKENS DE DESIGN — adicione em globals.css:
:root {
  --color-bg: #050505;
  --color-paper: #0a0a0a;
  --color-surface: #111111;
  --color-elevated: #1a1a1a;
  --color-gold: #d4af37;
  --color-gold-bright: #ffd700;
  --color-gold-muted: rgba(212, 175, 55, 0.4);
  --color-muted: #a1a1aa;
  --color-text: rgba(255, 255, 255, 0.92);
  --border-hairline: rgba(212, 175, 55, 0.12);
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
body { background: var(--color-bg); color: var(--color-text); font-family: var(--font-body); }
h1,h2,h3 { font-family: var(--font-display); font-weight: 400; font-style: italic; line-height: 0.95; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-paper); }
::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 999px; }

2. LENIS (scroll suave) — em app/layout.tsx como client component:
'use client'; import { useEffect } from 'react'; import Lenis from 'lenis';
useEffect(() => {
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  return () => lenis.destroy();
}, []);

3. NAVBAR (components/Navbar.tsx):
- position fixed inset-x-0 top-0 z-50, padding px-6 py-5 md:px-10
- Interno: mx-auto max-w-[84rem] flex items-center justify-between
- Padrão: bg-transparent
- Scrolled (useScroll > 40px via Framer ou scroll listener): bg-[rgba(5,5,5,0.92)] backdrop-blur-xl border-b border-[rgba(212,175,55,0.12)] transition-all duration-500
- Logo: Playfair Display 700 1.5rem italic — '[NOME_CONCESSIONARIA]' em branco com última letra ou inicial em text-[var(--color-gold)]
- Links: Inter 500 12px tracking-[0.24em] uppercase text-white/60 hover:text-[var(--color-gold)] transition-colors duration-300. Links: Início, Estoque, Serviços, Sobre, Contato
- CTA direito: Link 'Agendar test drive' em botão outline border border-[var(--color-gold)] text-[var(--color-gold)] px-5 py-2.5 rounded-[2px] hover:bg-[var(--color-gold)] hover:text-black transition 400ms
- Mobile (<md): hambúrguer ícone lucide → painel fullscreen bg-paper com links empilhados centralizados em Playfair 2rem italic

4. HERO (components/Hero.tsx):
- Section min-h-screen relative overflow-hidden
- Background: absolute inset-0, foto hero via next/image com fill + priority + sizes='100vw'. className='object-cover scale-[1.02]' + brightness-[0.45] contrast-[1.08]
- Parallax: useScroll + useTransform → y: ['0%', '-10%']; aplique em motion.div wrapper da imagem
- Overlay 1 (absolute inset-0): linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 50%, rgba(5,5,5,0.95) 100%)
- Overlay 2 (absolute inset-0): radial-gradient(ellipse at 30% 50%, transparent 0%, rgba(5,5,5,0.4) 80%)
- Conteúdo: container max-w-[84rem] mx-auto px-6 md:px-10 pt-40 pb-20, z-10 relative
- Eyebrow: flex items-center gap-3 → <div className='h-px w-10 bg-[var(--color-gold)]/50' /> + <span className='text-[var(--color-gold)] text-[10px] font-extrabold tracking-[0.32em] uppercase font-[var(--font-body)]'>Concessionária Premium</span>. Framer: opacity 0→1 y +20→0 duration 1.2s delay 0.1s ease [0.22,1,0.36,1]
- Título: h1 em Playfair Display italic 400 clamp(2.8rem, 7vw, 6.5rem) leading-[0.95] tracking-[-0.02em] max-w-[18ch]. Conteúdo: 'Automóveis que <span className=italic text-[var(--color-gold)]>definem</span> gerações.' Framer: opacity 0→1 y +40→0 blur(12px)→0 duration 1.6s delay 0.25s
- Subtítulo: p em Inter 400 clamp(1rem, 1.4vw, 1.2rem) text-[var(--color-muted)] max-w-[38rem] leading-[1.7] mt-8. Framer: opacity 0→1 y +24→0 duration 1.4s delay 0.5s
- CTA duplo (flex gap-4 mt-12):
  Primário: bg-[var(--color-gold)] text-black px-8 py-4 rounded-[2px] text-sm font-semibold tracking-[0.1em] uppercase hover:bg-[var(--color-gold-bright)] hover:-translate-y-0.5 transition duration-400 shadow-[0_18px_40px_rgba(212,175,55,0.18)]. Texto: 'Ver estoque completo'
  Secundário: border border-[var(--color-gold)]/40 text-[var(--color-gold)] px-8 py-4 rounded-[2px] text-sm tracking-[0.1em] uppercase hover:bg-[var(--color-gold)]/5 transition duration-400. Texto: 'Agendar visita'
- Scroll indicator (absolute bottom-8 left-1/2 -translate-x-1/2): lucide ChevronDown em gold animação bounce 2s infinite

5. INVENTÁRIO EM DESTAQUE (components/Inventory.tsx):
- Section py-32 px-6 md:px-10 max-w-[84rem] mx-auto
- Header seção: eyebrow 'Estoque selecionado' + h2 Playfair italic clamp(2rem,4vw,3.5rem) 'Peças de coleção, <span italic gold>disponíveis agora</span>.' + linha em baixo border-b border-[var(--border-hairline)] pb-12
- Grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16
- VehicleCard:
  article className='group relative overflow-hidden bg-[var(--color-surface)] border border-white/5 rounded-[2px] transition-all duration-400 hover:border-[var(--color-gold)]/30 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(212,175,55,0.08)]'
  Container imagem: relative h-72 overflow-hidden → next/image fill className='object-cover transition-transform duration-700 group-hover:scale-105'
  Overlay no bottom da imagem: absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent
  Badge ano (absolute top-4 left-4): bg-[var(--color-gold)]/90 text-black text-[10px] font-extrabold tracking-[0.24em] uppercase px-2.5 py-1 rounded-[1px]
  Corpo: p-6 space-y-3
    Linha marca: Inter 11px tracking-[0.28em] uppercase text-white/40 → 'BMW' / 'Audi' / etc
    Nome: Playfair Display italic 500 1.75rem leading-[1.1] text-white → 'M4 Competition'
    Specs (flex gap-3 items-center): Inter 13px text-[var(--color-muted)] → '38.500 km · 510 cv · 2023' (separados por · literais)
    Footer (flex items-center justify-between pt-4 border-t border-white/5):
      Preço: Inter 700 1.5rem tabular-nums text-white → 'R$ 684.900'
      Link 'Ver ficha →': Inter 500 12px tracking-[0.08em] text-[var(--color-gold)] group-hover:translate-x-1 transition

6. SERVIÇOS (components/Services.tsx):
- Section py-32 bg-[var(--color-paper)] border-y border-[var(--border-hairline)]
- Container max-w-[84rem] mx-auto px-6 md:px-10
- Header: eyebrow 'O que entregamos' + h2 Playfair italic 'Consultoria de aquisição, do primeiro olhar à entrega da chave.'
- Grid md:grid-cols-3 gap-0 mt-16 divide-x divide-[var(--border-hairline)] (em mobile, empilhar com divide-y)
- ServiceCol: p-10 space-y-5
  Ícone: lucide (Wallet, RefreshCw, ShieldCheck) tamanho 28, stroke gold, strokeWidth 1.3
  Título: Playfair italic 1.5rem white → 'Financiamento sob medida' / 'Troca por avaliação imediata' / 'Garantia estendida 24 meses'
  Descrição: Inter 14px leading-[1.7] text-[var(--color-muted)] 3-4 linhas

7. DEPOIMENTOS (components/Testimonials.tsx):
- Section py-32 px-6 md:px-10 max-w-[84rem] mx-auto overflow-hidden
- Header: eyebrow 'Clientes' + h2 Playfair italic 'A palavra de quem já fez parte desta casa.'
- Carrossel horizontal com snap (useEmblaCarousel OU simples overflow-x-auto snap-x com scroll-snap-align:start em cada item)
- TestimonialCard: flex-shrink-0 w-[min(460px,85vw)] bg-[var(--color-surface)] p-10 rounded-[2px] snap-start mr-6
  Aspas no topo: Playfair Display italic 4rem text-[var(--color-gold)]/30 leading-none → '"'
  Texto: Playfair italic 1.125rem text-white leading-[1.7] mt-2 (4-6 linhas)
  Divisor: h-px w-12 bg-[var(--color-gold)]/40 my-6
  Assinatura: Inter 600 13px white uppercase tracking-[0.2em] + linha de baixo Playfair italic 14px text-[var(--color-muted)]

8. SOBRE (components/About.tsx):
- Section py-32 bg-[var(--color-paper)] border-t border-[var(--border-hairline)]
- Grid md:grid-cols-[1.2fr_1fr] gap-16 max-w-[84rem] mx-auto px-6 md:px-10 items-center
- Coluna texto: eyebrow 'Nossa casa' + h2 Playfair italic clamp(2rem,4vw,3.5rem) 'Três décadas servindo <span italic gold>os mais exigentes</span> do país.' + 3 parágrafos Inter 16px leading-[1.75] text-[var(--color-muted)] + CTA link 'Conheça nossa história →'
- Coluna imagem: relative aspect-[4/5] overflow-hidden rounded-[2px] → next/image fill object-cover + overlay gradient-to-t from-[var(--color-gold)]/10 via-transparent to-transparent

9. CONTATO (components/Contact.tsx):
- Section py-32 px-6 md:px-10 max-w-[84rem] mx-auto
- Grid md:grid-cols-[1.5fr_1fr] gap-16
- Formulário:
  Eyebrow 'Atendimento consultivo'
  h2 Playfair italic 2.5rem 'Fale com um consultor.'
  Inputs: bg-[var(--color-paper)] border border-white/5 focus:border-[var(--color-gold)] rounded-[2px] px-5 py-4 text-white placeholder:text-white/30 transition-colors duration-300 w-full
  Grid md:grid-cols-2 gap-4 para nome/email, linha separada para telefone, textarea full
  Submit: bg-[var(--color-gold)] text-black px-8 py-4 rounded-[2px] text-sm uppercase tracking-[0.1em] font-semibold hover:bg-[var(--color-gold-bright)] hover:-translate-y-0.5 transition duration-400 w-full md:w-auto
- Coluna info:
  Bloco para endereço (MapPin ícone gold + texto Playfair italic + Inter pequeno)
  Bloco horário (Clock ícone)
  Bloco WhatsApp (MessageCircle ícone) com link wa.me/55...

10. FOOTER (components/Footer.tsx):
- border-t border-[var(--border-hairline)] bg-[var(--color-paper)] py-16 px-6 md:px-10
- Grid md:grid-cols-4 gap-12 max-w-[84rem] mx-auto
- Coluna 1 (brand): logo Playfair italic + linha Inter 13px 'Concessionária premium · desde [ANO]' + redes (Instagram, Facebook, YouTube — lucide em gold/60 hover:gold)
- Coluna 2 (Navegação): título Inter 600 11px tracking-[0.28em] uppercase text-[var(--color-gold)] + links Inter 14px text-white/60
- Coluna 3 (Serviços): mesmo padrão
- Coluna 4 (Contato): endereço, telefone, email em Inter 14px
- Linha rodapé: border-t border-white/5 mt-12 pt-8 flex justify-between items-center text-xs text-[var(--color-muted)] → '© [ANO] [NOME]. Todos os direitos reservados.' | 'Política de privacidade · Termos'

11. ROTAS (App Router): / → Home completa | /estoque → grade filtrável | /estoque/[id] → ficha detalhada | /servicos → expansão dos 3 serviços | /sobre → história + equipe | /contato → formulário + mapa

12. MÍDIAS OBRIGATÓRIAS: hero-showroom.jpg 1920×1080 (interior escuro), about-ambient.jpg 1200×1600 (foto retrato do ambiente/equipe), 6+ fotos de veículos 1600×1200 em fundo neutro, logo.svg monocromático branco + gold, favicon 32/192px

13. PERSONALIZE: substitua [NOME_CONCESSIONARIA], troque #d4af37 pela cor da marca (se não for dourado, ajuste também --color-gold-bright e transparências relacionadas), fotos reais do showroom + estoque, dados de contato reais, depoimentos reais (pelo menos 4 para o carrossel), ANO de fundação no footer`,
      customization_notes:
        "Para tom mais esportivo, troque Playfair Display por Teko (sans-serif condensada) e reduza o uso do italic. Para luxo máximo, mantenha Playfair e escureça mais o background para #000000. O gold #d4af37 pode virar bronze #a07c35 para marcas com pegada mais industrial. Evite border-radius grande — a estética editorial pede cantos quase retos (rounded-[2px]).",
    },
  },
  {
    id: "beauty-01",
    slug: "maison-aura-estetica",
    name: "Maison Aura Estética",
    niche: "Estética",
    tier: "premium",
    tagline: "Direção de arte refinada para clínica estética premium.",
    deploy_url: "https://maison-aura-estetica-premium-demo.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/-Maison-Aura-Est-tica-Blueprint-WX",
    repo_access: "private",
    stack: ["React", "Vite", "Tailwind", "Framer Motion", "GSAP"],
    sections: ["Hero", "About", "Treatments", "Gallery", "Protocol", "Reviews", "Team", "Pricing", "FAQ"],
    colors: { background: "#1a1116", primary: "#8b6275", accent: "#c18ba2", muted: "#bda8b1" },
    fonts: { display: "Cormorant Garamond", body: "Manrope" },
    quality_score: 5,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Clínica estética de alto padrão com linguagem editorial feminina e sofisticada. Motion refinado, superfícies com glass morphism e paleta rosê-escura criam percepção de exclusividade e cuidado premium.",
      sections_map: [
        "Navbar cinematográfica com entrada",
        "Hero com headline institucional e animação de entrada",
        "Sobre a clínica com split layout foto + texto",
        "Tratamentos em grid com cards interativos",
        "Galeria before/after com slider",
        "Protocolo de atendimento em etapas",
        "Depoimentos com avatar e rating",
        "Equipe com perfis",
        "Tabela de preços",
        "FAQ e CTA final",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#1a1116", usage: "Base escura com tom rosado" },
          { role: "Primary", hex: "#8b6275", usage: "CTAs e elementos de destaque" },
          { role: "Accent", hex: "#c18ba2", usage: "Highlights e detalhes elegantes" },
          { role: "Muted", hex: "#bda8b1", usage: "Texto de apoio" },
        ],
        typography: [
          { role: "Display", config: "Cormorant Garamond 600/700", usage: "Títulos principais e taglines" },
          { role: "Body", config: "Manrope 400/500", usage: "Conteúdo e descrições" },
        ],
      },
      implementation_spec: [
        "Navbar cinematográfica com animação de entrada no carregamento.",
        "Hero com headline editorial em duas linhas e subheadline elegante.",
        "Seção de tratamentos com galeria interativa e hover states.",
        "Gallery before/after com slider comparativo.",
        "Seção de reviews com carousel e rating visual.",
      ],
      animations_spec: [
        "Choreografia GSAP de reveal com offsets direcionais.",
        "Interações magnéticas nos botões principais.",
        "Hero chip enter com spring motion.",
        "Parallax sutil nas imagens de tratamento.",
      ],
      assets_references: [
        { type: "Fotos da clínica", description: "Ambiente, detalhes e equipe em tom editorial", required: true },
        { type: "Fotos before/after", description: "Resultados reais com composição profissional", required: true },
        { type: "Fotos da equipe", description: "Profissionais em estúdio ou ambiente da clínica", required: true },
      ],
      qa_checklist: [
        "Validar legibilidade em fundo escuro com texto claro.",
        "Testar slider before/after em touch devices.",
        "Checar consistência da paleta rosê em telas com diferentes calibrações de cor.",
      ],
      universal_prompt: `Crie um website para clínica estética premium '[NOME_CLINICA]'. Stack: React + Vite + TypeScript + Tailwind CSS v3 + shadcn/ui + Framer Motion + React Router DOM.

PACOTES NPM: framer-motion, react-router-dom, @radix-ui/react-accordion, lucide-react, class-variance-authority, clsx, tailwind-merge
FONTES GOOGLE: Cormorant Garamond (400, 500, 600, 700 + italic), Manrope (400, 500, 600, 700, 800), IBM Plex Mono (400, 500, 600)

---

1. TOKENS DE DESIGN — tailwind.config.ts + index.css:
:root (modo padrão — CLARO com toque rose):
  --background: hsl(340, 36%, 97%); --foreground: hsl(334, 23%, 18%);
  --primary: hsl(333, 28%, 24%); --accent: hsl(336, 33%, 67%);
  --card: hsl(0, 0%, 100%); --muted: hsl(340, 20%, 93%);
  --muted-foreground: hsl(334, 12%, 42%); --border: hsl(337, 28%, 84%);
  --cream: hsl(342, 44%, 96%); --radius: 1.75rem;
[data-theme="luxury"] (modo escuro — ATIVA toggle):
  --background: hsl(330, 25%, 9%); --foreground: hsl(338, 30%, 93%);
  --primary: hsl(338, 28%, 89%); --accent: hsl(336, 34%, 66%);
  --card: hsl(331, 17%, 14%); --muted: hsl(330, 14%, 19%);
  --border: hsl(332, 16%, 24%);
body { background: var(--background); color: var(--foreground); font-family: 'Manrope', sans-serif; }
Gradiente de fundo (modo claro): radial-gradient circles em rose/cream + linear-gradient 180deg cream→light-cream.
h1,h2,h3: font-family 'Cormorant Garamond', serif; font-weight 600.

2. NAVBAR cinematográfica:
Entrada no carregamento: Framer Motion y -80→0 opacity 0→1, duration 0.8s delay 0.2s ease [0.22,1,0.36,1].
fixed inset-x-0 top-0 z-50; glass morphism (bg-white/70 ou luxury:bg-card/80) backdrop-blur-xl.
Logo: Cormorant Garamond italic, 1.4rem. Links: Manrope 500 13px tracking-[0.08em]; hover: text-accent transition 220ms.
Botão "Agendar": rounded-full bg-primary text-primary-foreground px-6 py-2.5; hover: brightness(1.1) translateY(-1px).
Toggle luxury mode (ícone sol/lua).

3. SEÇÃO HERO:
min-h-[100svh] relative overflow-hidden. Fundo: imagem editorial + gradiente suave.
Chips de prestígio: 3 badges glass rounded-full px-4 py-2 text-xs font-manrope uppercase tracking-widest; Framer: stagger 0.1s.
Título: Cormorant Garamond 700 text-[clamp(3.5rem,8vw,7rem)] italic leading-[0.9] tracking-tight; Framer: opacity 0→1 y +60→0 blur 16px→0 duration 1.6s ease [0.22,1,0.36,1].
Subtítulo: Manrope 400 text-base md:text-lg text-muted-foreground max-w-[36rem] leading-[1.75]; Framer: opacity 0→1 y +30→0 duration 1.3s delay 0.4s.
Notas editoriais (3 ítens com CheckCircle2): Manrope 13px text-muted-foreground.
CTAs: "Iniciar Diagnóstico" bg-primary rounded-full px-8 py-4 text-sm font-semibold + "Ver Tratamentos" variant outline rounded-full.

4. TRATAMENTOS:
Grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.
Card: rounded-[var(--radius)] border border-border bg-card p-6 hover:shadow-lg hover:border-accent/40 transition-all 400ms.
Foto: aspect-[4/3] rounded-2xl overflow-hidden object-cover; hover scale(1.03) 500ms.
Categoria em IBM Plex Mono 11px tracking-widest uppercase text-accent. Nome em Cormorant 600 text-xl. Desc em Manrope text-muted-foreground text-sm.

5. GALERIA ANTES/DEPOIS:
Slider de comparação (drag para revelar): overlay splitado esquerda/direita com mesmo aspect-ratio. Alternativa: grid 2 colunas com imagens emparelhadas e rótulo "ANTES / DEPOIS" em IBM Plex Mono.

6. PROTOCOLO DE ATENDIMENTO (etapas):
4-5 passos em linha horizontal (desktop) / coluna (mobile). Número em Cormorant Garamond italic enorme e translúcido (opacity 0.12) como fundo decorativo. Título e descrição em cima.

7. DEPOIMENTOS:
Carousel auto-play (Framer Motion animate). Card glass rounded-[var(--radius)] p-6. Avatar circular + nome Manrope 600 + cargo/nota em Manrope text-muted text-sm. Estrelas em accent color. Citação em Cormorant italic text-lg.

8. EQUIPE:
Grid-cols-2 md:grid-cols-4. Card: foto aspect-[3/4] rounded-2xl object-cover; hover scale(1.03); overlay gradient; nome Cormorant + especialidade Manrope text-muted text-sm + CRM.

9. PREÇOS (tabela ou cards):
3 planos: Essencial | Plus | Maison. Card destacado com border-accent box-shadow 0 0 0 2px var(--accent). Badge "Mais Popular". Preços em Cormorant 700 text-4xl italic.

10. FAQ (Radix Accordion):
AccordionItem com border-b border-border. Trigger: Manrope 500 text-base. Content: Manrope text-muted-foreground text-sm leading-relaxed.

11. PÁGINAS: / → Home | /tratamentos → Lista | /tratamentos/:slug → Detalhe | /sobre → Clínica | /resultados → Galeria | /contato → Formulário

12. MÍDIAS OBRIGATÓRIAS: fotos editoriais da clínica em iluminação suave, fotos de procedimentos, fotos before/after reais, fotos da equipe em fundo clean, logo SVG em dark e light.

13. PERSONALIZE: aplique [NOME_CLINICA], ajuste a paleta substituindo hsl(336,33%,67%) pela cor de acento desejada, insira tratamentos e profissionais reais com CRM/CRF.`,
      customization_notes:
        "Trocar tom da paleta para identidade da clínica. Cormorant pode ser substituído por EB Garamond para tom mais clássico. Incluir certificações reais na seção de equipe.",
    },
  },
  {
    id: "vet-01",
    slug: "aura-veterinaria",
    name: "Aura Veterinária",
    niche: "Veterinária",
    tier: "premium",
    tagline: "Clínica veterinária premium com identidade moderna e conversiva.",
    deploy_url: "https://aura-veterinaria-premium.vercel.app/",
    repo_url: "https://github.com/Wesleysc94/Aura-Veterin-ria-Blueprint-WX",
    repo_access: "private",
    stack: ["React", "Vite", "Tailwind", "Framer Motion", "GSAP"],
    sections: ["Home", "Sobre", "Servicos", "Equipe", "Emergencia", "Contato"],
    colors: { background: "#0a1a20", primary: "#173b47", accent: "#2ec4b6", muted: "#8ca3ad" },
    fonts: { display: "Outfit", body: "Manrope" },
    quality_score: 4,
    blueprint: {
      version: "v1.0 · Abril 2026",
      concept:
        "Clínica veterinária com posicionamento premium e foco em confiança e conversão. Paleta teal sobre fundo quase preto cria identidade técnica e acolhedora simultaneamente.",
      sections_map: [
        "Header com navegação principal e CTA de emergência",
        "Hero com proposta de valor e CTA duplo",
        "Sobre a clínica com diferenciais",
        "Serviços em grid com detalhes",
        "Equipe com especialidades",
        "CTA de emergência 24h em destaque",
        "Contato com formulário e mapa",
      ],
      design_tokens: {
        colors: [
          { role: "Background", hex: "#0a1a20", usage: "Base escura com tom azul-petróleo" },
          { role: "Primary", hex: "#173b47", usage: "Superfícies e cards" },
          { role: "Accent", hex: "#2ec4b6", usage: "CTAs, destaques e ícones ativos" },
          { role: "Muted", hex: "#8ca3ad", usage: "Texto de apoio e labels" },
        ],
        typography: [
          { role: "Display", config: "Outfit 600/700", usage: "Títulos e nomes de seção" },
          { role: "Body", config: "Manrope 400/500", usage: "Conteúdo e descrições" },
        ],
      },
      implementation_spec: [
        "Hero com headline confiante e dois CTAs (consulta + emergência).",
        "Seção de serviços com cards e ícones representativos por especialidade.",
        "Bloco de equipe com especialidades e fotos profissionais.",
        "CTA de emergência 24h em destaque visual com animação pulsante.",
        "Formulário de contato com seleção de especialidade.",
      ],
      animations_spec: [
        "AnimatePresence nas transições de rota.",
        "Noise overlay global para textura premium.",
        "CTAs de emergência com pulse animado contínuo.",
        "Reveals com fade-up por seção via IntersectionObserver.",
      ],
      assets_references: [
        { type: "Fotos da clínica", description: "Consultório, recepção e equipamentos", required: true },
        { type: "Fotos da equipe", description: "Veterinários e auxiliares", required: true },
        { type: "Ícones de serviços", description: "Set vetorial consistente para especialidades", required: true },
      ],
      qa_checklist: [
        "Validar visibilidade do CTA de emergência em todos os breakpoints.",
        "Testar formulário de contato com seleção de especialidade.",
        "Checar legibilidade do teal sobre fundo escuro.",
      ],
      universal_prompt: `Crie um website para clínica veterinária premium '[NOME_CLINICA]'. Stack: React + Vite + TypeScript + Tailwind CSS v3 + shadcn/ui + Framer Motion + React Router DOM.

PACOTES NPM: framer-motion, react-router-dom, @radix-ui/react-accordion, lucide-react, clsx, tailwind-merge
FONTES GOOGLE: Cormorant Garamond (400, 500, 600, 700), Manrope (400, 500, 600, 700, 800), Outfit (400, 500, 600, 700, 800), Inter (400, 500, 600, 700, 800), IBM Plex Mono (400, 500, 600)

---

1. TOKENS DE DESIGN — tailwind.config.ts + index.css:
:root (modo padrão — CLARO com toque teal):
  --background: hsl(180, 15%, 98%); --foreground: hsl(184, 45%, 10%);
  --primary: hsl(184, 45%, 18%); --accent: hsl(174, 42%, 48%);
  --accent-foreground: hsl(180, 15%, 98%);
  --card: hsl(0, 0%, 100%); --muted: hsl(184, 10%, 90%);
  --muted-foreground: hsl(184, 20%, 40%); --border: hsl(184, 20%, 90%);
  --radius: 2rem;
  --glass-bg: rgba(255,255,255,0.5); --glass-border: rgba(184,45,18,0.08);
[data-theme="luxury"] (modo escuro):
  --background: hsl(184, 50%, 4%); --foreground: hsl(180, 10%, 96%);
  --primary: hsl(180, 10%, 96%); --accent: hsl(174, 60%, 50%);
  --card: hsl(184, 45%, 8%); --muted: hsl(184, 30%, 12%);
  --border: hsl(184, 30%, 15%);
  --glass-bg: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.08);
body { background: var(--background); color: var(--foreground); font-family: 'Manrope', sans-serif; }
h1,h2,h3: font-family 'Cormorant Garamond', serif; font-weight 600.
Noise overlay (.noise-overlay): fixed inset-0 z-[9999] pointer-events-none opacity-[0.015] mix-blend-mode overlay; SVG fractalNoise.
Blobs de fundo (.bg-blob): absolute width 600px height 600px border-radius 50% blur-[120px]; 3 instâncias com posições e delays diferentes; cores bg-accent/20 e bg-primary/10.

2. NAVBAR:
Entrada: Framer Motion y -60→0 opacity 0→1 duration 0.7s delay 0.1s.
fixed inset-x-0 top-0 z-50; glass (bg-white/70 luxury:bg-card/80) backdrop-blur-xl border-b border-[var(--glass-border)].
Logo: ícone veterinário (pata ou hexágono) + "Aura Veterinária" em Outfit 700. Hover: text-accent.
Links: Manrope 500 13px; hover: text-accent 220ms.
Botão "Agendar Consulta": bg-accent text-accent-foreground rounded-full px-6 py-2.5 hover:brightness(1.1) hover:translateY(-1px).
Toggle luxury/light mode.

3. SEÇÃO HERO:
min-h-[100dvh] flex items-center justify-center relative overflow-hidden.
Blobs de fundo: 3 divs animados com @keyframes blob { 0%,100%{border-radius 60%/50%} 50%{border-radius 50%/60%} translate flutuante } 8s ease-in-out infinite.
Noise overlay + noise-texture div.
Vídeo de fundo (com fallback imagem): video autoPlay loop muted playsInline absolute inset-0 object-cover scale-105 group-hover:scale-110 transition duration-[3s]. Imagem fallback em public/hero-fallback.png.
Gradientes: to-t from-background via-transparent to-white/10 opacity-90 + to-r from-background/40 via-transparent to-background/40.
Badge: glass rounded-full px-4 py-2 text-sm Manrope 500 uppercase tracking-widest text-accent.
Título: Cormorant Garamond 700 text-[clamp(3rem,7vw,6rem)] italic leading-[0.95] tracking-tight; Framer: opacity 0→1 y +40→0 duration 1.2s ease [0.16,1,0.3,1].
Subtítulo: Manrope 400 text-muted-foreground text-lg md:text-xl max-w-[40rem] leading-[1.75]; Framer: opacity 0→1 y +30→0 duration 1s delay 0.3s.
CTAs: "Agendar Consulta" bg-accent rounded-full px-8 py-4 + "Emergência 24h" border border-[var(--border)] rounded-full px-8 py-4 font-semibold text-foreground hover:bg-card.
3 chips com ícones: CalendarClock, ShieldCheck, HeartHandshake — glass rounded-full px-4 py-2 text-sm.

4. SERVIÇOS (4 destaques):
Grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6.
Card: rounded-[var(--radius)] border border-[var(--border)] bg-card p-6 hover:shadow-lg hover:border-accent/40 transition-all 400ms.
Ícone: 56×56px rounded-2xl bg-accent/10 text-accent flex items-center justify-center.
Nome em Outfit 600 text-lg. Descrição em Manrope text-muted-foreground text-sm.

5. BLOCO EMERGÊNCIA 24H:
Destaque visual com bg-accent/10 border-2 border-accent rounded-[var(--radius)] p-8 md:p-12.
Ícone Siren pulsante: @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(accent,0.4)} 50%{box-shadow:0 0 0 20px rgba(accent,0)} } 2s infinite.
Título Cormorant 700 text-4xl + subtítulo Manrope.
Botão "Ligar Agora": bg-accent text-accent-foreground rounded-full px-8 py-4 text-lg.

6. EQUIPE:
Grid-cols-2 md:grid-cols-3 gap-6. Card: foto aspect-[3/4] rounded-2xl overflow-hidden; hover scale(1.03); overlay gradient. Nome Cormorant 600 + especialidade Manrope text-muted text-sm + CRMV.
Reveal: Framer whileInView opacity 0→1 y +30→0 stagger 0.1s.

7. FAQ (Radix Accordion):
AccordionItem border-b border-[var(--border)]. Trigger: Outfit 600 text-base. Content: Manrope text-muted-foreground text-sm leading-relaxed.

8. CONTATO:
Grid 2 colunas: formulário (nome, e-mail, telefone, assunto, mensagem) + info (endereço, telefone, horários, mapa embed).
Campos: border border-[var(--border)] rounded-xl focus:border-accent outline-none p-3 text-sm.
Botão enviar: bg-accent text-accent-foreground rounded-full px-8 py-4.

9. PÁGINAS: / → Home | /servicos → Lista de serviços | /servicos/:slug → Detalhe | /equipe → Veterinários | /emergencia → Urgências 24h | /blog → Artigos | /contato → Formulário + Mapa

10. MÍDIAS OBRIGATÓRIAS: vídeo hero (MP4, interior da clínica) + fallback foto, fotos dos consultórios e equipamentos, fotos da equipe, ícones de especialidades.

11. PERSONALIZE: substitua [NOME_CLINICA], ajuste hsl(174,42%,48%) pela cor teal de preferência, insira equipe real com CRMV, endereço e número de emergência reais.`,
      customization_notes:
        "Ajuste a paleta teal para combinar com a identidade da clínica. O bloco de emergência 24h pode ser removido para clínicas sem plantão. Adapte serviços para especialidades reais.",
    },
  },
];
