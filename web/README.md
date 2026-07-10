# Meu Corre — Site

Landing page em Next.js (App Router) apresentando o app Meu Corre, com páginas de Política de
Privacidade, Termos de Uso e Exclusão de Conta.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

Pra testar o formulário de e-mail contra o Supabase local do monorepo, suba a stack local a
partir da raiz do projeto (`npm run supabase:start`) e crie um `.env.local` aqui em `web/`
com a URL/anon key impressas por esse comando — sobrescreve o `.env` (que aponta pro Supabase de
produção) só neste ambiente.

## Testes

```bash
npm test
```

## Deploy (Coolify)

Este projeto é um Next.js padrão — o Coolify detecta e builda via Nixpacks automaticamente, sem
Dockerfile. Configure estas env vars no serviço do Coolify:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

(mesmos valores do `.env` deste repositório — são a URL e a chave pública do Supabase de
produção, protegida por RLS, não é segredo).
