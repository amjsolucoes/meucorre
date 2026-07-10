# Landing page para o Meu Corre (web/)

Date: 2026-07-10
Status: Approved

## Problem

O app "Meu Corre" não tem nenhuma presença pública na web. Isso é, na prática, um bloqueador de
publicação: o Google Play Console exige uma URL pública (fora do app) para a Política de
Privacidade, e também exige um caminho web onde o usuário possa solicitar a exclusão da conta sem
precisar reinstalar o app. Além disso, o produto não tem nenhuma página de apresentação para
divulgação fora das lojas.

## Goals

- Uma landing page moderna em `web/`, na raiz do monorepo, apresentando o app e suas
  funcionalidades reais (não genéricas), com o mesmo tema visual (cores) do app mobile e reforço
  claro de que o app é gratuito.
- Página de Política de Privacidade e de Termos de Uso publicamente acessíveis, com o mesmo
  conteúdo já revisado que existe dentro do app — resolve o bloqueador de URL pública da auditoria
  do Play Store.
- Página de solicitação de exclusão de conta acessível via web, sem exigir login — resolve o
  segundo bloqueador da auditoria (exigência do Google desde dez/2023).
- Uso das logos reais já existentes (`mobile/assets/images/meu-corre-logo.png` e
  `mobile/assets/logo-amj*.png`), não novas artes.
- Captura de e-mail de interessados ("avise-me quando lançar"), gravada no Supabase que já é o
  backend do monorepo.

## Non-goals

- Sem workspace/monorepo tool (Turborepo, Nx, npm workspaces) — `web/` é um projeto Next.js
  independente com seu próprio `package.json`, do mesmo jeito que `mobile/` e `supabase/` já
  convivem sem ferramenta de workspace.
- Sem compartilhamento de código entre `mobile/` e `web/` — são toolchains diferentes (Expo/RN vs.
  Next.js). O conteúdo legal é copiado (não importado) de `mobile/app/politica-privacidade.tsx` e
  `mobile/app/politica-uso.tsx` para as páginas web equivalentes.
- Sem dark mode — o app mobile é só light (`background: '#FFFFFF'` fixo em todo o app); o site
  acompanha essa decisão em vez de inventar um tema escuro que o produto não tem.
- Sem Dockerfile customizado — Coolify detecta e builda projetos Next.js padrão via Nixpacks
  automaticamente; só documentamos as env vars a configurar lá.
- Sem CMS, sem blog, sem i18n — conteúdo estático em português, editado direto no código.
- Sem autenticação real na página de exclusão de conta — ela apenas explica o processo e coleta o
  pedido por e-mail (a exclusão de fato já existe, autenticada, dentro do app — ver
  `mobile/app/perfil/excluir.tsx` + Edge Function `delete-account`). Duplicar esse fluxo
  autenticado na web está fora de escopo.

## Design

### 1. Estrutura do projeto

```
web/
  app/
    layout.tsx                    # fontes (next/font/google), <html lang="pt-BR">, metadata padrão
    page.tsx                      # landing page
    politica-de-privacidade/page.tsx
    termos-de-uso/page.tsx
    exclusao-de-conta/page.tsx
    actions.ts                    # Server Action: submitWaitlistEmail
  components/
    nav.tsx
    hero.tsx
    feature-grid.tsx
    free-banner.tsx
    audience-chips.tsx
    trust-section.tsx
    waitlist-form.tsx             # usado no hero e no CTA final
    footer.tsx
    legal-page.tsx                # wrapper compartilhado pelas 2 páginas legais (header + prose)
  lib/
    supabase.ts                   # client Supabase (mesmo padrão do mobile: URL + anon key via env)
  public/
    meu-corre-logo.png            # copiada de mobile/assets/images/
    logo-amj-cinza.png            # copiada de mobile/assets/
    screenshot-dashboard.png      # capturas reais do emulador (já validadas nesta sessão)
    screenshot-novo-ganho.png
  tailwind.config.ts              # tokens de cor extraídos de mobile/tailwind.config.js
  next.config.ts
  package.json
  .env                            # URL + anon key públicos do Supabase de produção (mesmo padrão do mobile/.env)
  .env.example
  README.md                       # como rodar local + env vars que o Coolify precisa configurar
```

Cada asset de imagem é copiado (não referenciado via path relativo cruzando pastas) — `web/` fica
autocontido, sem depender da árvore de `mobile/` para buildar.

### 2. Tokens de design (extraídos de `mobile/tailwind.config.js` e `constants/theme.ts`)

```ts
// web/tailwind.config.ts (theme.extend.colors)
primary: { DEFAULT: '#0D4F5C', light: '#1A6B7A' },
accent: { DEFAULT: '#7BC67A', dark: '#4C8A4B' },
surface: '#F5F7F8',
border: '#E2E8EA',
'text-primary': '#1A1A1A',
'text-secondary': '#6B7F85',
'text-hint': '#A0B0B5',
```

Sem paleta de dark mode — decisão deliberada (ver Non-goals).

Tipografia via `next/font/google`, self-hosted no build (sem chamada externa em runtime):
- Títulos: **Sora** (600/700/800)
- Corpo: **Plus Jakarta Sans** (400/500/600)

### 3. Landing page (`app/page.tsx`)

Seções, nessa ordem, cada uma um componente em `components/`:

1. **Nav** — logo horizontal (`meu-corre-logo.png`) + âncoras (`#funcionalidades`, `#gratis`,
   `#seguranca`) + botão "Avise-me" que rola até o formulário do hero. Fixo no topo, fundo
   transparente sobre o hero e sólido com sombra leve ao rolar.

2. **Hero** — eyebrow "Para autônomos brasileiros", headline (`Seu corre, organizado.`),
   subheadline curta sobre controlar ganhos, gastos, clientes e agenda em um só app. À direita,
   as duas capturas de tela reais (`screenshot-dashboard.png`, `screenshot-novo-ganho.png`) num
   frame simples via CSS (retângulo arredondado + sombra + barra de status simulada — sem lib de
   mockup 3D). Abaixo do texto: `<WaitlistForm />` + botão da Play Store lado a lado, e uma linha
   de confiança ("Grátis pra sempre · Sem anúncios · Seus dados são seus"). Atrás do texto, um
   traço fino de linha ascendente em SVG (eco do próprio ícone do app) como elemento de fundo
   sutil — não decorativo aleatório, é o mesmo motivo gráfico do logo.

3. **FeatureGrid** (`#funcionalidades`) — 5 cards, conteúdo real (mesmo já validado em
   `docs/INFORMACOES_PUBLICACAO_ANDROID.md`), não inventado:
   - Controle financeiro (ganhos e gastos em segundos, saldo em tempo real)
   - Gestão de clientes (cadastro rápido, importar contatos, histórico por cliente)
   - Agenda com lembretes (compromissos, notificações automáticas)
   - Recibos profissionais (PDF, compartilhar por WhatsApp)
   - Relatórios visuais (gráficos por dia/semana/mês)

4. **FreeBanner** (`#gratis`) — faixa cheia com `bg-primary`, texto branco, headline grande
   "100% gratuito. Sempre." + 4 bullets curtos (sem mensalidade, sem cartão de crédito, sem
   anúncios, sem taxas escondidas). Seção própria, não um bullet dentro de outra — pedido
   explícito do usuário de destacar isso.

5. **AudienceChips** — "Feito para quem trabalha por conta própria": chips com as profissões já
   usadas na descrição da loja (cabeleireiros, manicures, diaristas, eletricistas, personal
   trainers, professores particulares, pintores, mecânicos, costureiras, fotógrafos autônomos...).

6. **TrustSection** (`#seguranca`) — 3 cards curtos: criptografia em trânsito e repouso,
   conformidade LGPD, exclusão de dados garantida (com link para `/exclusao-de-conta`).

7. **CTA final** — repete `<WaitlistForm />` + botão Play Store.

8. **Footer** — links legais (`/politica-de-privacidade`, `/termos-de-uso`,
   `/exclusao-de-conta`), e-mail de contato, logo da AMJ (`logo-amj-cinza.png`, variante clara
   pois o footer é sobre fundo claro) com "Desenvolvido por AMJ Inovações e Serviços", copyright.

### 4. Botão da Play Store / App Store

```tsx
<a href="https://play.google.com/store/apps/details?id=com.amjsolucoes.meucorre">
  {/* badge Play Store */}
</a>
<span className="opacity-50 cursor-not-allowed" aria-disabled>
  {/* badge App Store, com selo "Em breve" */}
</span>
```

A URL da Play Store já usa o formato canônico (`?id=<package>`) — funciona automaticamente no dia
em que o app for aprovado, sem precisar tocar no código do site depois.

### 5. Captura de e-mail (waitlist)

Nova migration em `supabase/migrations/`:

```sql
create table public.landing_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.landing_waitlist enable row level security;

create policy "Qualquer pessoa pode se inscrever"
  on public.landing_waitlist for insert
  to anon
  with check (true);
```

Sem policy de `select`/`update`/`delete` para `anon` — só insert, ninguém de fora consegue ler a
lista (mesmo padrão de "tabela pública de escrita, privada de leitura" já usado em outras partes
do projeto via RLS).

`app/actions.ts`:

```ts
'use server';
import { createClient } from '@/lib/supabase';

export async function submitWaitlistEmail(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !email.includes('@')) return { error: 'Digite um e-mail válido.' };

  const supabase = createClient();
  const { error } = await supabase.from('landing_waitlist').insert({ email });
  if (error) {
    // e-mail duplicado (constraint unique) não é erro pro usuário — ele já tá na lista
    if (error.code === '23505') return { success: true };
    return { error: 'Não foi possível salvar seu e-mail agora. Tente de novo em instantes.' };
  }
  return { success: true };
}
```

`components/waitlist-form.tsx` é um Client Component que chama a Server Action, mostra estado de
loading, e troca o formulário por uma confirmação ("Prontinho! Avisamos você.") em caso de
sucesso — sem redirect de página.

`lib/supabase.ts` usa `@supabase/supabase-js` lendo
`process.env.NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`, mesmo par de
credenciais públicas (URL + anon/publishable key) que `mobile/.env` já commita — não é segredo,
é a chave protegida por RLS.

### 6. Páginas legais

`components/legal-page.tsx` — wrapper compartilhado: header simples (título + "Última
atualização: <data>") + corpo em prose (`max-w-2xl`, tipografia legível, mesma hierarquia visual
usada no restante do site — títulos de seção em `Sora`, corpo em `Plus Jakarta Sans`).

- `/politica-de-privacidade` — as 10 seções de `mobile/app/politica-privacidade.tsx`, copiadas
  literalmente (Informações que Coletamos, Como Usamos, Compartilhamento, Segurança, Direitos
  LGPD, Retenção, Cookies, Menores de Idade, Alterações, Contato). Único ajuste de conteúdo real:
  a seção 1 passa a mencionar explicitamente a coleta de **contatos** (usada no recurso "Importar
  Contatos") — hoje o texto do app fala só em "dados de uso", e a auditoria já sinalizou essa
  lacuna. Esse ajuste é replicado de volta no arquivo do app mobile também, pra não divergir.
- `/termos-de-uso` — as 8 seções de `mobile/app/politica-uso.tsx`, copiadas literalmente.

### 7. Exclusão de conta (`/exclusao-de-conta`)

Página estática explicando: o que é apagado (clientes, ganhos/gastos, agendamentos, perfil — a
mesma lista que já aparece em `perfil/excluir.tsx`), como pedir a exclusão sem o app instalado
(enviar e-mail para `suporte@amjsolucoes.com` a partir do e-mail cadastrado na conta, prazo de até
30 dias — mesmo prazo já declarado na política de privacidade), e um lembrete de que quem ainda
tem o app pode excluir direto pela tela de perfil, na hora.

### 8. Deploy (Coolify / Hostinger VPS)

`README.md` documenta:
- `npm install && npm run build && npm start` local
- Env vars que o Coolify precisa: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Nenhuma config de build especial — Nixpacks reconhece Next.js pelo `package.json` sozinho.

### 9. Testing

- `web/` ganha smoke tests mínimos com **Vitest** (mais leve que Jest pra um projeto Next.js só
  de server actions + componentes simples, sem a bagagem de config do React Native que o Jest do
  `mobile/` carrega) cobrindo `submitWaitlistEmail`: e-mail válido, e-mail inválido, e e-mail
  duplicado (os três ramos de lógica não triviais do server action).
- Verificação manual: rodar `npm run dev`, conferir as 4 rotas, testar o formulário de e-mail
  contra o Supabase local (`npm run supabase:start` na raiz), e revisar responsividade mobile —
  é uma landing page, a maioria do tráfego chega por link do Instagram/WhatsApp no celular.
