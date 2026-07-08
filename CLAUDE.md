# CLAUDE.md

This file provides guidance to Claude Code when working across the whole "Meu Corre" monorepo.

## Layout

- `mobile/` — the Expo/React Native app. See `mobile/CLAUDE.md` for its conventions.
- `supabase/` — the Supabase project (migrations, edge functions, local config) that backs `mobile/`. Config: `supabase/config.toml`. Migrations: `supabase/migrations/`. Edge functions: `supabase/functions/`.

## Local Supabase backend

Run these from the repo root (they wrap the Supabase CLI):

```bash
npm run supabase:start          # start the local stack (needs Docker running)
npm run supabase:status         # show local stack status + connection info
npm run supabase:stop           # stop the local stack
npm run supabase:reset          # reset local DB and re-run migrations
npm run supabase:migration:new  # scaffold a new migration file
```

To point the mobile app at the local backend instead of production, create
`mobile/.env.local` (gitignored) with the `API URL` and `anon key` printed by
`supabase start`:

```
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
```

Expo loads `.env.local` on top of `.env` automatically. Delete/rename the file to fall back to
whatever `mobile/.env` points at.
