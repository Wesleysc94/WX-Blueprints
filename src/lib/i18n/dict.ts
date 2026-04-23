import type { Locale } from "./locales";

export const dict = {
  "pt-BR": {
    "nav.blueprints": "Blueprints",
    "nav.how_it_works": "Como funciona",
    "nav.plans": "Planos",
    "nav.sign_in": "Entrar",
    "nav.sign_up": "Criar conta",
    "nav.start_free": "Começar grátis",
    "nav.panel": "Painel",
    "nav.logout": "Sair",

    "footer.product": "Produto",
    "footer.niches": "Nichos",
    "footer.account": "Conta",
    "footer.description":
      "Biblioteca de engenharia reversa de sites premium reais para AI coding.",
    "footer.copyright": "© 2026 WX Digital Studio · blueprints.wxdigitalstudio.com.br",
    "footer.access_plans": "Acessar planos →",

    "hero.badge": "Blueprints para AI Coding",
    "hero.title_1": "Sites premium.",
    "hero.title_2": "Blueprints",
    "hero.title_3": "prontos.",
    "hero.title_4": "Recrie com IA.",
    "hero.subtitle":
      "Cada blueprint é um projeto real publicado — com tudo que você precisa para recriar usando Lovable, Bolt ou Cursor em minutos.",
    "hero.cta_primary": "Ver blueprints gratuitos →",
    "hero.cta_secondary": "Como funciona",
    "hero.caption": "3 blueprints gratuitos · Lovable · Bolt · Cursor · Claude",

    "plans.gratuito": "GRATUITO",
    "plans.premium": "PREMIUM",
    "plans.founding": "FOUNDING LIFETIME",
    "plans.forever": "sempre",
    "plans.month": "/mês",
    "plans.year": "/ano",
    "plans.one_time": "único",
    "plans.subscribe_now": "Assinar agora →",
    "plans.start_free": "Começar grátis",
    "plans.reserve_seat": "Garantir vaga →",
    "plans.footer_note": "Founding Lifetime: 100 vagas totais, preço fixo de lançamento",

    "locale.toggle_to_en": "EN",
    "locale.toggle_to_pt": "PT",

    "auth.email": "Email",
    "auth.password": "Senha",
    "auth.name": "Nome completo",
    "auth.cpf": "CPF",
    "auth.phone": "Telefone",
    "auth.sign_in_title": "Entre na sua conta",
    "auth.sign_in_submit": "Entrar",
    "auth.sign_up_title": "Crie sua conta",
    "auth.sign_up_submit": "Criar conta grátis",
    "auth.google_continue": "Continuar com Google",
    "auth.forgot_password": "Esqueci minha senha",
    "auth.sign_in_switch": "Já tem conta? Entre aqui",
    "auth.sign_up_switch": "Ainda não tem conta? Crie a sua",
    "auth.divider": "ou",

    "panel.title": "Painel",
    "panel.welcome": "Bem-vindo",
    "panel.subscription": "Assinatura",
    "panel.blueprints": "Meus blueprints",
    "panel.account": "Minha conta",

    "errors.generic": "Algo deu errado. Tente novamente.",
    "errors.invalid_credentials": "Email ou senha inválidos.",
    "errors.cpf_invalid": "CPF inválido.",
    "errors.email_invalid": "Email inválido.",
    "errors.password_short": "A senha precisa ter pelo menos 8 caracteres.",
  },
  en: {
    "nav.blueprints": "Blueprints",
    "nav.how_it_works": "How it works",
    "nav.plans": "Plans",
    "nav.sign_in": "Sign in",
    "nav.sign_up": "Sign up",
    "nav.start_free": "Start free",
    "nav.panel": "Dashboard",
    "nav.logout": "Sign out",

    "footer.product": "Product",
    "footer.niches": "Niches",
    "footer.account": "Account",
    "footer.description":
      "Reverse-engineered library of real premium websites for AI coding.",
    "footer.copyright": "© 2026 WX Digital Studio · blueprints.wxdigitalstudio.com.br",
    "footer.access_plans": "View plans →",

    "hero.badge": "Blueprints for AI Coding",
    "hero.title_1": "Premium sites.",
    "hero.title_2": "Blueprints",
    "hero.title_3": "ready.",
    "hero.title_4": "Rebuild with AI.",
    "hero.subtitle":
      "Each blueprint is a real, deployed project — with everything you need to rebuild it using Lovable, Bolt or Cursor in minutes.",
    "hero.cta_primary": "See free blueprints →",
    "hero.cta_secondary": "How it works",
    "hero.caption": "3 free blueprints · Lovable · Bolt · Cursor · Claude",

    "plans.gratuito": "FREE",
    "plans.premium": "PREMIUM",
    "plans.founding": "FOUNDING LIFETIME",
    "plans.forever": "forever",
    "plans.month": "/mo",
    "plans.year": "/yr",
    "plans.one_time": "one-time",
    "plans.subscribe_now": "Subscribe now →",
    "plans.start_free": "Start free",
    "plans.reserve_seat": "Reserve seat →",
    "plans.footer_note": "Founding Lifetime: 100 total seats, fixed launch price",

    "locale.toggle_to_en": "EN",
    "locale.toggle_to_pt": "PT",

    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full name",
    "auth.cpf": "CPF (Brazilian ID)",
    "auth.phone": "Phone",
    "auth.sign_in_title": "Sign in to your account",
    "auth.sign_in_submit": "Sign in",
    "auth.sign_up_title": "Create your account",
    "auth.sign_up_submit": "Create free account",
    "auth.google_continue": "Continue with Google",
    "auth.forgot_password": "Forgot password",
    "auth.sign_in_switch": "Already have an account? Sign in",
    "auth.sign_up_switch": "No account yet? Create one",
    "auth.divider": "or",

    "panel.title": "Dashboard",
    "panel.welcome": "Welcome",
    "panel.subscription": "Subscription",
    "panel.blueprints": "My blueprints",
    "panel.account": "My account",

    "errors.generic": "Something went wrong. Please try again.",
    "errors.invalid_credentials": "Invalid email or password.",
    "errors.cpf_invalid": "Invalid CPF.",
    "errors.email_invalid": "Invalid email.",
    "errors.password_short": "Password must be at least 8 characters.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type DictKey = keyof (typeof dict)["pt-BR"];

export const translate = (locale: Locale, key: DictKey): string => {
  const bundle = dict[locale] as Record<string, string>;
  if (bundle && key in bundle) return bundle[key];
  return (dict["pt-BR"] as Record<string, string>)[key] ?? String(key);
};
