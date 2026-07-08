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
EXPO_PUBLIC_SUPABASE_URL=http://192.168.x.x:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key from supabase start output>
```

Use your machine's LAN IP (`ipconfig getifaddr en0` on macOS), not `127.0.0.1` — the local stack
binds to `0.0.0.0` so the LAN IP works from web, iOS Simulator, Android Emulator, and physical
devices on the same network alike. `127.0.0.1` only works from a browser running directly on the
host; the Android Emulator in particular treats `127.0.0.1` as its own loopback, not the host
machine's, and fails with "Network request failed" on any API call.

Expo loads `.env.local` on top of `.env` automatically, but only picks up changes on a dev server
restart (`npx expo start --clear` if a stale value seems to be sticking — Metro caches inlined
`EXPO_PUBLIC_*` values). Delete/rename the file to fall back to whatever `mobile/.env` points at.
