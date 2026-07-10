# Meu Corre Landing Page (web/) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js landing page in `web/` presenting the Meu Corre app, plus publicly
accessible Privacy Policy, Terms of Use, and Account Deletion pages — unblocking Google Play Store
submission (public privacy policy URL + web account-deletion path).

**Architecture:** Single Next.js 15 App Router project, TypeScript + Tailwind v3, no server-side
auth. One Server Action (`submitWaitlistEmail`) writes to a new insert-only Supabase table. All
other content is static. Deployed on the user's own Hostinger VPS via Coolify (Nixpacks
auto-detects Next.js, no Dockerfile needed).

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v3.4 · `@supabase/supabase-js`
· `lucide-react` (icons) · Vitest (server action tests)

## Global Constraints

- Project lives at `web/` in the repo root — a sibling of `mobile/` and `supabase/`, its own
  `package.json`, no npm workspaces / Turborepo / Nx.
- No code sharing between `mobile/` and `web/` (different toolchains). Legal page content is
  copied from `mobile/app/politica-privacidade.tsx` and `mobile/app/politica-uso.tsx`, not
  imported.
- No dark mode — the mobile app is light-only; the site matches that.
- No custom Dockerfile — Coolify builds this as a standard Next.js app via Nixpacks.
- No CMS, no blog, no i18n. Content is static Portuguese JSX.
- Reuses the existing production Supabase project (`https://heaskxqscvmjdqpfvbvr.supabase.co`) —
  no new Supabase project.
- Color tokens (from `mobile/tailwind.config.js`): primary `#0D4F5C` / `#1A6B7A`, accent `#7BC67A`
  / `#4C8A4B`, surface `#F5F7F8`, border `#E2E8EA`, text `#1A1A1A` / `#6B7F85` / `#A0B0B5`.
- Fonts: **Sora** (display, 600/700/800) + **Plus Jakarta Sans** (body, 400/500/600), via
  `next/font/google`.
- Play Store link uses the canonical format `https://play.google.com/store/apps/details?id=com.amjsolucoes.meucorre`
  so it starts working automatically once the app is published — no code change needed later.
- `.gitignore` pattern for env files matches `mobile/.gitignore` exactly: only `.env*.local` is
  ignored; the plain `.env` (public URL + anon/publishable key, protected by RLS — not a secret)
  is committed.

---

### Task 1: Scaffold the Next.js project with brand tokens and fonts

**Files:**
- Create: `web/` (via `create-next-app`)
- Create: `web/tailwind.config.ts`
- Create: `web/postcss.config.js`
- Modify: `web/app/globals.css`
- Modify: `web/app/layout.tsx`
- Modify: `web/.gitignore`
- Create: `web/public/meu-corre-logo.png`, `web/public/logo-amj-cinza.png`,
  `web/public/screenshot-dashboard.png`, `web/public/screenshot-novo-ganho.png`

**Interfaces:**
- Produces: Tailwind tokens `primary`, `primary-light` (as `primary.light`), `accent`,
  `accent-dark` (as `accent.dark`), `surface`, `border`, `text-primary`, `text-secondary`,
  `text-hint`; font families `font-display` (Sora) and `font-body` (Plus Jakarta Sans); CSS
  variables `--font-sora` / `--font-jakarta` set on `<html>`.

- [ ] **Step 1: Scaffold the app**

From the repo root (`/Volumes/Matrix/Projetos/meu-corre`):

```bash
npx --yes create-next-app@latest web \
  --typescript \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-tailwind \
  --use-npm \
  --yes
```

Expected: a `web/` directory is created with `app/`, `package.json`, `tsconfig.json`, etc.

- [ ] **Step 2: Install Tailwind v3 (not the v4 default) and the icon library**

```bash
cd web
npm install -D tailwindcss@^3.4.19 postcss@^8.4.49 autoprefixer@^10.4.20
npm install lucide-react @supabase/supabase-js@^2.105.3
```

- [ ] **Step 3: Write `web/postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Write `web/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D4F5C', light: '#1A6B7A' },
        accent: { DEFAULT: '#7BC67A', dark: '#4C8A4B' },
        surface: '#F5F7F8',
        border: '#E2E8EA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7F85',
        'text-hint': '#A0B0B5',
      },
      fontFamily: {
        display: ['var(--font-sora)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-jakarta)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Replace `web/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-white text-text-primary font-body;
}
```

- [ ] **Step 6: Replace `web/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Meu Corre — Controle financeiro para autônomos',
  description:
    'Registre ganhos, gastos, clientes e agenda em um app gratuito feito para quem trabalha por conta própria.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Fix `.gitignore` env handling to match `mobile/.gitignore`**

Open `web/.gitignore` (generated by create-next-app). Find the line(s) ignoring env files —
create-next-app generates:

```
# env files (can opt-in for committing if needed)
.env*
```

Replace that block with:

```
# local env files
.env*.local
```

This mirrors `mobile/.gitignore`, so `.env` (committed, public keys) stays tracked while
`.env.local` (personal/local overrides) stays ignored.

- [ ] **Step 8: Copy brand assets and screenshots into `web/public/`**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
cp mobile/assets/images/meu-corre-logo.png web/public/meu-corre-logo.png
cp mobile/assets/logo-amj-cinza.png web/public/logo-amj-cinza.png
cp "/private/tmp/claude-501/-Volumes-Matrix-Projetos-meu-corre/d4be62ed-89a0-49a3-9802-bc412f2499ec/scratchpad/android-current.png" web/public/screenshot-dashboard.png
cp "/private/tmp/claude-501/-Volumes-Matrix-Projetos-meu-corre/d4be62ed-89a0-49a3-9802-bc412f2499ec/scratchpad/android-ganho2.png" web/public/screenshot-novo-ganho.png
```

If either scratchpad screenshot no longer exists at that path (it's a session-local temp
directory), recapture it: boot the Android emulator with the Meu Corre app installed and logged
in, then `adb exec-out screencap -p > web/public/screenshot-dashboard.png` on the dashboard
screen, and the same command pointed at `screenshot-novo-ganho.png` after navigating to
`meucorreapp://ganho`.

- [ ] **Step 9: Verify the app boots with the new tokens**

```bash
cd web
npm run dev & DEV_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
kill "$DEV_PID"
```

Expected: `200`.

- [ ] **Step 10: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web
git commit -m "Scaffold web/ Next.js project with Meu Corre brand tokens"
```

---

### Task 2: Supabase client and `landing_waitlist` table

**Files:**
- Create: `web/lib/supabase.ts`
- Create: `supabase/migrations/20260710120000_create_landing_waitlist.sql`
- Create: `web/.env`
- Create: `web/.env.example`

**Interfaces:**
- Produces: `createClient(): SupabaseClient` exported from `web/lib/supabase.ts`, used by
  `web/app/actions.ts` (Task 3).
- Produces: table `public.landing_waitlist(id uuid, email text unique, created_at timestamptz)`
  with an insert-only RLS policy for the `anon` role.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260710120000_create_landing_waitlist.sql`:

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

- [ ] **Step 2: Apply it to the local stack and verify the policy**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
npm run supabase:start
npm run supabase:reset
docker exec supabase_db_meu-corre-app psql -U postgres -c \
  "select policyname, cmd, roles from pg_policies where tablename = 'landing_waitlist';"
```

Runs `psql` inside the Postgres container itself (`docker exec`) instead of requiring a local
`psql` install. Expected: one row — `policyname: Qualquer pessoa pode se inscrever`,
`cmd: INSERT`, `roles: {anon}`.

- [ ] **Step 3: Write `web/lib/supabase.ts`**

```ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.');
  }

  return createSupabaseClient(url, anonKey);
}
```

- [ ] **Step 4: Write `web/.env` (committed, public keys) and `web/.env.example`**

`web/.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://heaskxqscvmjdqpfvbvr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ZS5hwGOonwKe1jB_HRy8Kw_04nCJ76O
```

`web/.env.example`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add supabase/migrations/20260710120000_create_landing_waitlist.sql web/lib web/.env web/.env.example
git commit -m "Add landing_waitlist table and Supabase client for web/"
```

---

### Task 3: `submitWaitlistEmail` server action (TDD)

**Files:**
- Create: `web/app/actions.ts`
- Test: `web/app/actions.test.ts`
- Create: `web/vitest.config.ts`
- Modify: `web/package.json` (add `test` script)

**Interfaces:**
- Consumes: `createClient` from `@/lib/supabase` (Task 2).
- Produces: `submitWaitlistEmail(formData: FormData): Promise<{ success: true } | { error: string }>`,
  used by `WaitlistForm` (Task 4).

- [ ] **Step 1: Install Vitest**

```bash
cd web
npm install -D vitest
```

- [ ] **Step 2: Write `web/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

- [ ] **Step 3: Add the `test` script to `web/package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run"
```

- [ ] **Step 4: Write the failing test — `web/app/actions.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitWaitlistEmail } from './actions';

const insertMock = vi.fn();

vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

function formDataWith(email: string) {
  const fd = new FormData();
  fd.set('email', email);
  return fd;
}

describe('submitWaitlistEmail', () => {
  beforeEach(() => {
    insertMock.mockReset();
  });

  it('rejects an empty email', async () => {
    const result = await submitWaitlistEmail(formDataWith(''));
    expect(result).toEqual({ error: 'Digite um e-mail válido.' });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('rejects a string without an @', async () => {
    const result = await submitWaitlistEmail(formDataWith('nao-e-email'));
    expect(result).toEqual({ error: 'Digite um e-mail válido.' });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('saves a valid email', async () => {
    insertMock.mockResolvedValue({ error: null });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(insertMock).toHaveBeenCalledWith({ email: 'ana@example.com' });
    expect(result).toEqual({ success: true });
  });

  it('treats a duplicate email as success', async () => {
    insertMock.mockResolvedValue({ error: { code: '23505', message: 'duplicate key' } });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(result).toEqual({ success: true });
  });

  it('surfaces a generic error for other failures', async () => {
    insertMock.mockResolvedValue({ error: { code: '500', message: 'network down' } });
    const result = await submitWaitlistEmail(formDataWith('ana@example.com'));
    expect(result).toEqual({
      error: 'Não foi possível salvar seu e-mail agora. Tente de novo em instantes.',
    });
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

```bash
cd web
npx vitest run app/actions.test.ts
```

Expected: FAIL — `Cannot find module './actions'` (file doesn't exist yet).

- [ ] **Step 6: Write `web/app/actions.ts`**

```ts
'use server';

import { createClient } from '@/lib/supabase';

export async function submitWaitlistEmail(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email || !email.includes('@')) {
    return { error: 'Digite um e-mail válido.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('landing_waitlist').insert({ email });

  if (error) {
    // Duplicate email (unique constraint) isn't an error for the user — they're already on the list.
    if (error.code === '23505') {
      return { success: true };
    }
    return { error: 'Não foi possível salvar seu e-mail agora. Tente de novo em instantes.' };
  }

  return { success: true };
}
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
cd web
npx vitest run app/actions.test.ts
```

Expected: 5 passed.

- [ ] **Step 8: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/app/actions.ts web/app/actions.test.ts web/vitest.config.ts web/package.json web/package-lock.json
git commit -m "Add submitWaitlistEmail server action with tests"
```

---

### Task 4: `WaitlistForm` component

**Files:**
- Create: `web/components/waitlist-form.tsx`

**Interfaces:**
- Consumes: `submitWaitlistEmail` from `@/app/actions` (Task 3).
- Produces: `<WaitlistForm />`, used by Hero (Task 6) and the final CTA in `app/page.tsx` (Task 12).

- [ ] **Step 1: Write `web/components/waitlist-form.tsx`**

```tsx
'use client';

import { useId, useState, useTransition } from 'react';
import { submitWaitlistEmail } from '@/app/actions';

export function WaitlistForm() {
  const inputId = useId();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitWaitlistEmail(formData);
      if ('error' in result) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
      }
    });
  }

  if (status === 'success') {
    return (
      <p className="rounded-full bg-accent/15 px-5 py-3 font-body text-sm font-semibold text-accent-dark">
        Prontinho! Avisamos você assim que o app estiver disponível.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form action={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Seu melhor e-mail
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className="w-full flex-1 rounded-full border border-border bg-white px-5 py-3 font-body text-sm text-text-primary placeholder:text-text-hint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent px-6 py-3 font-body text-sm font-bold text-white transition hover:bg-accent-dark disabled:opacity-60"
        >
          {isPending ? 'Enviando...' : 'Avise-me'}
        </button>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-2 font-body text-xs font-semibold text-red-600">
          {message}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
cd web
npm run dev & DEV_PID=$!
sleep 3
curl -s http://localhost:3000 | grep -o 'Avise-me' | head -1
kill "$DEV_PID"
```

Note: at this point in the plan `app/page.tsx` is still the create-next-app default, so this
component isn't wired in yet — this step just confirms the dev server still boots cleanly with
the new file present (a type/import error in this file would fail the build). Full visual
verification happens in Task 12.

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/waitlist-form.tsx
git commit -m "Add WaitlistForm component"
```

---

### Task 5: `Nav` component

**Files:**
- Create: `web/components/nav.tsx`

**Interfaces:**
- Produces: `<Nav />`, used by `app/page.tsx` (Task 12). Links to anchors `#funcionalidades`,
  `#gratis`, `#seguranca`, and `#topo-cadastro` (defined inside Hero, Task 6).

- [ ] **Step 1: Write `web/components/nav.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
  { href: '#funcionalidades', label: 'Funcionalidades' },
  { href: '#gratis', label: 'Grátis' },
  { href: '#seguranca', label: 'Segurança' },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/meu-corre-logo.png" alt="Meu Corre" width={160} height={64} priority />
        </Link>
        <ul className="hidden items-center gap-8 font-body text-sm font-semibold text-text-secondary md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition hover:text-primary">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#topo-cadastro"
          className="rounded-full bg-primary px-5 py-2.5 font-body text-sm font-bold text-white transition hover:bg-primary-light"
        >
          Avise-me
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/nav.tsx
git commit -m "Add Nav component"
```

---

### Task 6: `Hero` component

**Files:**
- Create: `web/components/hero.tsx`

**Interfaces:**
- Consumes: `<WaitlistForm />` (Task 4).
- Produces: `<Hero />`, used by `app/page.tsx` (Task 12). Defines the `#topo-cadastro` anchor
  target that `Nav`'s CTA (Task 5) scrolls to.

- [ ] **Step 1: Write `web/components/hero.tsx`**

```tsx
import Image from 'next/image';
import { WaitlistForm } from '@/components/waitlist-form';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox="0 0 800 400"
        className="pointer-events-none absolute -right-24 top-10 hidden w-[560px] text-accent/15 lg:block"
      >
        <polyline
          points="0,320 120,260 220,300 320,180 420,220 540,80 650,120 800,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
        <div>
          <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
            Para autônomos brasileiros
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-text-primary sm:text-5xl">
            Seu corre, organizado.
          </h1>
          <p className="mt-5 max-w-md font-body text-lg text-text-secondary">
            Registre ganhos, gastos, clientes e agenda em segundos. Tudo num app simples, feito
            para quem trabalha por conta própria — e 100% gratuito.
          </p>

          <div id="topo-cadastro" className="mt-8 flex flex-col gap-4">
            <WaitlistForm />
            <div className="flex flex-wrap items-center gap-4">
              <PlayStoreButton />
              <span
                aria-disabled="true"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-body text-xs font-semibold text-text-hint"
              >
                App Store — em breve
              </span>
            </div>
            <p className="font-body text-xs font-semibold text-text-hint">
              Grátis pra sempre · Sem anúncios · Seus dados são seus
            </p>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-sm justify-center gap-4">
          <PhoneFrame
            src="/screenshot-dashboard.png"
            alt="Tela inicial do Meu Corre mostrando o saldo do mês"
            className="translate-y-6"
          />
          <PhoneFrame
            src="/screenshot-novo-ganho.png"
            alt="Tela de novo ganho do Meu Corre"
            className="-translate-y-6"
          />
        </div>
      </div>
    </section>
  );
}

function PlayStoreButton() {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.amjsolucoes.meucorre"
      className="flex items-center gap-3 rounded-xl bg-text-primary px-4 py-2.5 text-white transition hover:bg-black"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M5 3.9c0-.9 1-1.4 1.7-.9l14 8.1c.7.4.7 1.4 0 1.8l-14 8.1c-.7.5-1.7 0-1.7-.9V3.9Z" />
      </svg>
      <span className="text-left font-body leading-tight">
        <span className="block text-[10px] text-white/70">Disponível no</span>
        <span className="block text-sm font-bold">Google Play</span>
      </span>
    </a>
  );
}

function PhoneFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`w-40 overflow-hidden rounded-[28px] border-4 border-text-primary/90 shadow-xl sm:w-48 ${className}`}
    >
      <Image src={src} alt={alt} width={270} height={600} className="h-auto w-full" />
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/hero.tsx
git commit -m "Add Hero component"
```

---

### Task 7: `FeatureGrid` component

**Files:**
- Create: `web/components/feature-grid.tsx`

**Interfaces:**
- Produces: `<FeatureGrid />`, used by `app/page.tsx` (Task 12). Defines the `#funcionalidades`
  anchor target.

- [ ] **Step 1: Write `web/components/feature-grid.tsx`**

```tsx
import { Wallet, Users, CalendarCheck, Receipt, BarChart3, type LucideIcon } from 'lucide-react';

const FEATURES: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Wallet,
    title: 'Controle financeiro',
    description: 'Registre ganhos e gastos em segundos e veja seu saldo atualizado na hora.',
  },
  {
    Icon: Users,
    title: 'Gestão de clientes',
    description:
      'Cadastre clientes rapidamente, importe da agenda do celular e veja o histórico de cada um.',
  },
  {
    Icon: CalendarCheck,
    title: 'Agenda com lembretes',
    description: 'Marque compromissos e receba lembretes automáticos antes de cada agendamento.',
  },
  {
    Icon: Receipt,
    title: 'Recibos profissionais',
    description: 'Gere recibos em PDF e compartilhe por WhatsApp direto pelo app.',
  },
  {
    Icon: BarChart3,
    title: 'Relatórios visuais',
    description: 'Gráficos por dia, semana e mês pra entender pra onde vai o seu dinheiro.',
  },
];

export function FeatureGrid() {
  return (
    <section id="funcionalidades" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-xl">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
          Funcionalidades
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          Tudo que o seu corre precisa, num só lugar
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15">
              <Icon className="h-5 w-5 text-accent-dark" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text-primary">{title}</h3>
            <p className="mt-2 font-body text-sm text-text-secondary">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/feature-grid.tsx
git commit -m "Add FeatureGrid component"
```

---

### Task 8: `FreeBanner` component

**Files:**
- Create: `web/components/free-banner.tsx`

**Interfaces:**
- Produces: `<FreeBanner />`, used by `app/page.tsx` (Task 12). Defines the `#gratis` anchor
  target.

- [ ] **Step 1: Write `web/components/free-banner.tsx`**

```tsx
import { Check } from 'lucide-react';

const POINTS = ['Sem mensalidade', 'Sem cartão de crédito', 'Sem anúncios', 'Sem taxas escondidas'];

export function FreeBanner() {
  return (
    <section id="gratis" className="bg-primary py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-3xl font-extrabold text-white sm:text-5xl">
          100% gratuito. Sempre.
        </h2>
        <p className="mx-auto mt-4 max-w-lg font-body text-white/80">
          O Meu Corre não cobra nada pra você organizar o seu trabalho. Sem pegadinha, sem versão
          paga escondida atrás de um &quot;premium&quot;.
        </p>
        <ul className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {POINTS.map((point) => (
            <li
              key={point}
              className="flex flex-col items-center gap-2 font-body text-sm font-semibold text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Check className="h-4 w-4" aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/free-banner.tsx
git commit -m "Add FreeBanner component"
```

---

### Task 9: `AudienceChips` component

**Files:**
- Create: `web/components/audience-chips.tsx`

**Interfaces:**
- Produces: `<AudienceChips />`, used by `app/page.tsx` (Task 12).

- [ ] **Step 1: Write `web/components/audience-chips.tsx`**

```tsx
const PROFESSIONS = [
  'Cabeleireiros',
  'Manicures',
  'Diaristas',
  'Eletricistas',
  'Encanadores',
  'Personal trainers',
  'Professores particulares',
  'Pintores',
  'Pedreiros',
  'Mecânicos',
  'Costureiras',
  'Fotógrafos autônomos',
];

export function AudienceChips() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
        Feito para quem trabalha por conta própria
      </p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary">
        Se você é autônomo, o Meu Corre é pra você
      </h2>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {PROFESSIONS.map((profession) => (
          <span
            key={profession}
            className="rounded-full border border-border bg-surface px-4 py-2 font-body text-sm font-semibold text-text-secondary"
          >
            {profession}
          </span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/audience-chips.tsx
git commit -m "Add AudienceChips component"
```

---

### Task 10: `TrustSection` component

**Files:**
- Create: `web/components/trust-section.tsx`

**Interfaces:**
- Produces: `<TrustSection />`, used by `app/page.tsx` (Task 12). Defines the `#seguranca` anchor
  target. Links to `/exclusao-de-conta` (Task 16).

- [ ] **Step 1: Write `web/components/trust-section.tsx`**

```tsx
import Link from 'next/link';
import { Lock, ShieldCheck, Trash2, type LucideIcon } from 'lucide-react';

const ITEMS: { Icon: LucideIcon; title: string; description: string }[] = [
  {
    Icon: Lock,
    title: 'Criptografia de ponta',
    description: 'Seus dados são protegidos em trânsito e em repouso.',
  },
  {
    Icon: ShieldCheck,
    title: 'Conformidade com a LGPD',
    description: 'Você tem controle total sobre seus dados pessoais.',
  },
  {
    Icon: Trash2,
    title: 'Exclusão garantida',
    description: 'Peça a exclusão da sua conta quando quiser, dentro do app ou por aqui.',
  },
];

export function TrustSection() {
  return (
    <section id="seguranca" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-xl">
        <p className="font-body text-sm font-bold uppercase tracking-widest text-accent-dark">
          Segurança e privacidade
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
          Seus dados são exclusivamente seus
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {ITEMS.map(({ Icon, title, description }) => (
          <div key={title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text-primary">{title}</h3>
            <p className="mt-2 font-body text-sm text-text-secondary">{description}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-body text-sm text-text-secondary">
        Quer excluir sua conta sem abrir o app?{' '}
        <Link
          href="/exclusao-de-conta"
          className="font-semibold text-primary underline underline-offset-2"
        >
          Veja como pedir a exclusão
        </Link>
        .
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors (this will only pass once Task 16 creates the `/exclusao-de-conta` route —
`next/link` doesn't typecheck route existence by default, so this compiles fine even before Task
16 runs).

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/trust-section.tsx
git commit -m "Add TrustSection component"
```

---

### Task 11: `Footer` component

**Files:**
- Create: `web/components/footer.tsx`

**Interfaces:**
- Produces: `<Footer />`, used by `app/page.tsx` (Task 12). Links to `/politica-de-privacidade`
  (Task 14), `/termos-de-uso` (Task 15), `/exclusao-de-conta` (Task 16).

- [ ] **Step 1: Write `web/components/footer.tsx`**

```tsx
import Image from 'next/image';
import Link from 'next/link';

const LEGAL_LINKS = [
  { href: '/politica-de-privacidade', label: 'Política de Privacidade' },
  { href: '/termos-de-uso', label: 'Termos de Uso' },
  { href: '/exclusao-de-conta', label: 'Exclusão de Conta' },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image src="/meu-corre-logo.png" alt="Meu Corre" width={140} height={56} />

          <nav aria-label="Links legais">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-body text-sm font-semibold text-text-secondary">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="font-body text-sm text-text-secondary">
            Dúvidas?{' '}
            <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
              suporte@amjsolucoes.com
            </a>
          </p>

          <div className="flex flex-col items-center gap-2 pt-6">
            <span className="font-body text-xs uppercase tracking-widest text-text-hint">
              Desenvolvido por
            </span>
            <Image src="/logo-amj-cinza.png" alt="AMJ Inovações e Serviços" width={120} height={48} />
          </div>

          <p className="font-body text-xs text-text-hint">
            © {new Date().getFullYear()} AMJ Inovações e Serviços — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/footer.tsx
git commit -m "Add Footer component"
```

---

### Task 12: Assemble the landing page

**Files:**
- Modify: `web/app/page.tsx`

**Interfaces:**
- Consumes: `Nav` (Task 5), `Hero` (Task 6), `FeatureGrid` (Task 7), `FreeBanner` (Task 8),
  `AudienceChips` (Task 9), `TrustSection` (Task 10), `WaitlistForm` (Task 4), `Footer` (Task 11).

- [ ] **Step 1: Replace `web/app/page.tsx`**

```tsx
import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { FeatureGrid } from '@/components/feature-grid';
import { FreeBanner } from '@/components/free-banner';
import { AudienceChips } from '@/components/audience-chips';
import { TrustSection } from '@/components/trust-section';
import { WaitlistForm } from '@/components/waitlist-form';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeatureGrid />
        <FreeBanner />
        <AudienceChips />
        <TrustSection />
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
            Comece a organizar seu corre hoje
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-text-secondary">
            Deixe seu e-mail e avisamos assim que o app estiver disponível pra baixar.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Visual verification**

```bash
cd web
npm run dev
```

Open `http://localhost:3000`. Confirm: nav is sticky and its links scroll to the right sections,
hero shows both phone screenshots, the "100% gratuito" band has a solid teal background, the
profession chips wrap on mobile width, and the footer shows both the Meu Corre and AMJ logos.
Resize to 375px width and confirm no horizontal scroll. Stop the dev server (Ctrl+C) when done.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/app/page.tsx
git commit -m "Assemble the Meu Corre landing page"
```

---

### Task 13: `LegalPage` wrapper component

**Files:**
- Create: `web/components/legal-page.tsx`

**Interfaces:**
- Produces: `<LegalPage title={string} updatedAt={string}>{children}</LegalPage>`, used by
  Privacy Policy (Task 14), Terms of Use (Task 15), and Account Deletion (Task 16) pages. Expects
  `children` to be `<section><h2>...</h2><p>...</p></section>` blocks.

- [ ] **Step 1: Write `web/components/legal-page.tsx`**

```tsx
import type { ReactNode } from 'react';

export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <a
        href="/"
        className="font-body text-sm font-semibold text-primary underline-offset-2 hover:underline"
      >
        ← Voltar para o início
      </a>
      <h1 className="mt-6 font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 font-body text-sm text-text-hint">Última atualização: {updatedAt}</p>
      <div className="mt-10 space-y-8 font-body text-sm leading-relaxed text-text-secondary [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-text-primary [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_p]:mt-2">
        {children}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd web
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/components/legal-page.tsx
git commit -m "Add LegalPage wrapper component"
```

---

### Task 14: Privacy Policy page (and sync the contacts disclosure into the mobile app)

**Files:**
- Create: `web/app/politica-de-privacidade/page.tsx`
- Modify: `mobile/app/politica-privacidade.tsx:75-88`

**Interfaces:**
- Consumes: `<LegalPage>` (Task 13).
- Produces: route `/politica-de-privacidade` — this is the public URL for the Google Play Console
  "Privacy policy" field.

- [ ] **Step 1: Write `web/app/politica-de-privacidade/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Meu Corre',
};

export default function PoliticaPrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade" updatedAt="12 de maio de 2026">
      <p>
        Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações
        pessoais quando você usa nosso aplicativo.
      </p>

      <section>
        <h2>1. Informações que Coletamos</h2>
        <p>Coletamos as seguintes informações:</p>
        <ul>
          <li>
            <strong>Dados de cadastro:</strong> nome, email, telefone e profissão
          </li>
          <li>
            <strong>Dados financeiros:</strong> ganhos, gastos e transações registradas por você
          </li>
          <li>
            <strong>Dados de clientes:</strong> informações dos clientes que você cadastrar
          </li>
          <li>
            <strong>Contatos:</strong> se você usar o recurso de importar contatos, acessamos sua
            agenda do celular apenas para facilitar o cadastro de clientes — só com sua permissão
            explícita
          </li>
          <li>
            <strong>Dados de uso:</strong> como você interage com o app
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Como Usamos suas Informações</h2>
        <p>Usamos suas informações para:</p>
        <ul>
          <li>Fornecer e melhorar nossos serviços</li>
          <li>Processar suas transações e gerar relatórios</li>
          <li>Enviar notificações sobre agendamentos</li>
          <li>Garantir a segurança da sua conta</li>
          <li>Cumprir obrigações legais</li>
        </ul>
      </section>

      <section>
        <h2>3. Compartilhamento de Dados</h2>
        <p>Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas:</p>
        <ul>
          <li>Com provedores de serviços que nos ajudam a operar o app (como servidores de banco de dados)</li>
          <li>Quando exigido por lei ou ordem judicial</li>
          <li>Para proteger nossos direitos legais</li>
        </ul>
      </section>

      <section>
        <h2>4. Segurança dos Dados</h2>
        <p>Implementamos medidas de segurança para proteger suas informações, incluindo:</p>
        <ul>
          <li>Criptografia de dados em trânsito e em repouso</li>
          <li>Autenticação segura</li>
          <li>Acesso restrito aos dados</li>
          <li>Monitoramento de segurança</li>
        </ul>
      </section>

      <section>
        <h2>5. Seus Direitos</h2>
        <p>De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:</p>
        <ul>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou incorretos</li>
          <li>Solicitar a exclusão de seus dados</li>
          <li>Revogar seu consentimento</li>
          <li>Solicitar a portabilidade dos dados</li>
        </ul>
      </section>

      <section>
        <h2>6. Retenção de Dados</h2>
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa ou conforme necessário para
          fornecer nossos serviços. Quando você excluir sua conta, seus dados serão
          permanentemente removidos em até 30 dias.
        </p>
      </section>

      <section>
        <h2>7. Cookies e Tecnologias Similares</h2>
        <p>
          Usamos tecnologias de armazenamento local para melhorar sua experiência, como lembrar
          suas preferências e manter você conectado.
        </p>
      </section>

      <section>
        <h2>8. Menores de Idade</h2>
        <p>
          Nosso serviço não é destinado a menores de 18 anos. Não coletamos intencionalmente
          informações de menores.
        </p>
      </section>

      <section>
        <h2>9. Alterações nesta Política</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre
          mudanças significativas através do app ou por email.
        </p>
      </section>

      <section>
        <h2>10. Contato</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade,
          entre em contato através do email:{' '}
          <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
            suporte@amjsolucoes.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
```

- [ ] **Step 2: Sync the same contacts disclosure into the mobile app**

In `mobile/app/politica-privacidade.tsx`, the "Informações que Coletamos" list (around lines
75-88) currently jumps from "Dados de clientes" straight to "Dados de uso". Add a "Contatos"
bullet between them, matching the existing `<Text>` bullet style exactly:

```tsx
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados de clientes:</Text> informações dos clientes que você cadastrar
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Contatos:</Text> se você usar o recurso de importar contatos, acessamos sua agenda do celular apenas para facilitar o cadastro de clientes — só com sua permissão explícita
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#3A4F55', lineHeight: 22 }}>
                • <Text style={{ fontWeight: '700' }}>Dados de uso:</Text> como você interage com o app
              </Text>
```

- [ ] **Step 3: Verify both render**

```bash
cd web
npm run dev & DEV_PID=$!
sleep 3
curl -s http://localhost:3000/politica-de-privacidade | grep -o 'Contatos' | head -1
kill "$DEV_PID"
cd ../mobile
npx tsc --noEmit
```

Expected: `Contatos` printed from the curl check; no TypeScript errors from the mobile check.

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/app/politica-de-privacidade mobile/app/politica-privacidade.tsx
git commit -m "Add public Privacy Policy page and disclose Contacts collection"
```

---

### Task 15: Terms of Use page

**Files:**
- Create: `web/app/termos-de-uso/page.tsx`

**Interfaces:**
- Consumes: `<LegalPage>` (Task 13).
- Produces: route `/termos-de-uso`.

- [ ] **Step 1: Write `web/app/termos-de-uso/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Termos de Uso — Meu Corre',
};

export default function TermosDeUsoPage() {
  return (
    <LegalPage title="Termos de Uso" updatedAt="12 de maio de 2026">
      <section>
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao usar este aplicativo, você concorda com esta Política de Uso. Se você não concordar
          com algum termo, não utilize o app.
        </p>
      </section>

      <section>
        <h2>2. Uso Permitido</h2>
        <p>
          Este app é destinado a profissionais autônomos para controle de ganhos, gastos, clientes
          e agendamentos. Você pode:
        </p>
        <ul>
          <li>Registrar suas transações financeiras</li>
          <li>Gerenciar seus clientes e agendamentos</li>
          <li>Gerar recibos para seus clientes</li>
          <li>Visualizar relatórios e gráficos do seu negócio</li>
        </ul>
      </section>

      <section>
        <h2>3. Uso Proibido</h2>
        <p>Você não pode:</p>
        <ul>
          <li>Usar o app para atividades ilegais</li>
          <li>Tentar acessar dados de outros usuários</li>
          <li>Modificar, copiar ou distribuir o app sem autorização</li>
          <li>Usar o app de forma que prejudique seu funcionamento</li>
        </ul>
      </section>

      <section>
        <h2>4. Responsabilidade dos Dados</h2>
        <p>
          Você é responsável por manter a segurança da sua conta e senha. Recomendamos fazer
          backup regular dos seus dados. Não nos responsabilizamos por perda de dados causada por
          uso inadequado ou problemas técnicos.
        </p>
      </section>

      <section>
        <h2>5. Limitação de Responsabilidade</h2>
        <p>
          O app é fornecido &quot;como está&quot;. Não garantimos que o serviço será ininterrupto
          ou livre de erros. Não nos responsabilizamos por danos diretos ou indiretos causados
          pelo uso do app.
        </p>
      </section>

      <section>
        <h2>6. Cancelamento de Conta</h2>
        <p>
          Você pode excluir sua conta a qualquer momento através das configurações do app. Ao
          excluir sua conta, todos os seus dados serão permanentemente removidos.
        </p>
      </section>

      <section>
        <h2>7. Alterações nos Termos</h2>
        <p>
          Podemos atualizar esta Política de Uso a qualquer momento. Você será notificado sobre
          mudanças importantes. O uso continuado do app após as alterações significa que você
          aceita os novos termos.
        </p>
      </section>

      <section>
        <h2>8. Contato</h2>
        <p>
          Se você tiver dúvidas sobre esta Política de Uso, entre em contato conosco através do
          email:{' '}
          <a href="mailto:suporte@amjsolucoes.com" className="font-semibold text-primary">
            suporte@amjsolucoes.com
          </a>
        </p>
      </section>
    </LegalPage>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
cd web
npm run dev & DEV_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/termos-de-uso
kill "$DEV_PID"
```

Expected: `200`.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/app/termos-de-uso
git commit -m "Add public Terms of Use page"
```

---

### Task 16: Account Deletion page

**Files:**
- Create: `web/app/exclusao-de-conta/page.tsx`

**Interfaces:**
- Consumes: `<LegalPage>` (Task 13).
- Produces: route `/exclusao-de-conta` — the public web path Google Play requires for account
  deletion requests made without the app installed.

- [ ] **Step 1: Write `web/app/exclusao-de-conta/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'Exclusão de Conta — Meu Corre',
};

export default function ExclusaoDeContaPage() {
  return (
    <LegalPage title="Exclusão de Conta" updatedAt="10 de julho de 2026">
      <section>
        <h2>Já tem o app instalado?</h2>
        <p>
          A forma mais rápida de excluir sua conta é direto pelo app: abra o Meu Corre, vá em{' '}
          <strong>Perfil → Excluir Conta</strong> e confirme. A exclusão acontece na hora.
        </p>
      </section>

      <section>
        <h2>Não tem mais o app instalado?</h2>
        <p>
          Sem problema. Envie um e-mail para{' '}
          <a
            href="mailto:suporte@amjsolucoes.com?subject=Solicita%C3%A7%C3%A3o%20de%20exclus%C3%A3o%20de%20conta"
            className="font-semibold text-primary"
          >
            suporte@amjsolucoes.com
          </a>{' '}
          a partir do mesmo endereço cadastrado na sua conta, pedindo a exclusão. Confirmamos o
          pedido e removemos seus dados em até 30 dias — o mesmo prazo descrito na nossa{' '}
          <a href="/politica-de-privacidade" className="font-semibold text-primary">
            Política de Privacidade
          </a>
          .
        </p>
      </section>

      <section>
        <h2>O que é excluído</h2>
        <ul>
          <li>Todos os clientes cadastrados</li>
          <li>Ganhos e gastos registrados</li>
          <li>Agendamentos</li>
          <li>Seu perfil e dados pessoais</li>
        </ul>
        <p>Essa ação é permanente e não pode ser desfeita.</p>
      </section>
    </LegalPage>
  );
}
```

- [ ] **Step 2: Verify it renders**

```bash
cd web
npm run dev & DEV_PID=$!
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/exclusao-de-conta
kill "$DEV_PID"
```

Expected: `200`.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/app/exclusao-de-conta
git commit -m "Add public Account Deletion page"
```

---

### Task 17: README, final checks, and full-site verification

**Files:**
- Create: `web/README.md`

- [ ] **Step 1: Write `web/README.md`**

```md
# Meu Corre — Site

Landing page em Next.js (App Router) apresentando o app Meu Corre, com páginas de Política de
Privacidade, Termos de Uso e Exclusão de Conta.

## Rodando localmente

\`\`\`bash
npm install
npm run dev
\`\`\`

Abre em http://localhost:3000.

Pra testar o formulário de e-mail contra o Supabase local do monorepo, suba a stack local a
partir da raiz do projeto (\`npm run supabase:start\`) e crie um \`.env.local\` aqui em \`web/\`
com a URL/anon key impressas por esse comando — sobrescreve o \`.env\` (que aponta pro Supabase de
produção) só neste ambiente.

## Testes

\`\`\`bash
npm test
\`\`\`

## Deploy (Coolify)

Este projeto é um Next.js padrão — o Coolify detecta e builda via Nixpacks automaticamente, sem
Dockerfile. Configure estas env vars no serviço do Coolify:

- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

(mesmos valores do \`.env\` deste repositório — são a URL e a chave pública do Supabase de
produção, protegida por RLS, não é segredo).
```

- [ ] **Step 2: Full verification pass**

```bash
cd /Volumes/Matrix/Projetos/meu-corre/web
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Expected: lint passes with no errors, typecheck passes, all Vitest tests pass, and the production
build completes without errors (confirms every route in `app/` compiles cleanly, including the
ones that only got a manual `curl` check earlier).

```bash
npm run dev & DEV_PID=$!
sleep 3
for route in / /politica-de-privacidade /termos-de-uso /exclusao-de-conta; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$route")
  echo "$route -> $code"
done
kill "$DEV_PID"
```

Expected: all four routes print `200`.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add web/README.md
git commit -m "Add web/ README with local dev and Coolify deploy instructions"
```
