# Monorepo + local Supabase backend

Date: 2026-07-08
Status: Approved

## Problem

The repo root (`/Volumes/Matrix/Projetos/meu-corre`) is already the git root, with `mobile/` as a
subfolder — so it's structurally a monorepo already. But the Supabase project (`config.toml`,
migrations, edge functions) lives inside `mobile/supabase/`, coupled to the mobile app instead of
being a sibling package. The user wants to run a local Supabase stack as the backend for local
development, decoupled from `mobile/`.

## Goals

- `supabase/` becomes a top-level sibling of `mobile/`, not nested inside it.
- `supabase start` (and friends) work from the repo root using the already-installed Supabase CLI.
- Local dev can point the mobile app at the local Supabase instance without touching the
  production `.env`.
- No speculative tooling: no npm workspaces, no monorepo build system (Turborepo/Nx). There is
  exactly one JS package (`mobile/`) today.

## Non-goals

- No second app/package (web dashboard, admin, etc.) — out of scope until one actually exists.
- No change to `lib/supabase.ts`, RLS policies, migrations, or edge function logic.
- No change to production Supabase project or its credentials.

## Design

### 1. Move the Supabase project to the repo root

```
git mv mobile/supabase supabase
```

Preserves file history. The Supabase CLI resolves its project root by looking for a `supabase/`
subdirectory under the current working directory, so running CLI commands from the repo root
(instead of from `mobile/`) is all that's needed — no config changes inside `supabase/` itself.

### 2. Root `package.json` — convenience scripts only

A new `package.json` at the repo root, with no `dependencies` and no `workspaces` field — just
scripts wrapping the Supabase CLI that's already installed on the machine:

```json
{
  "name": "meu-corre",
  "private": true,
  "scripts": {
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:status": "supabase status",
    "supabase:reset": "supabase db reset",
    "supabase:migration:new": "supabase migration new"
  }
}
```

`npm run supabase:start` from the root is equivalent to `supabase start`; the scripts exist purely
so the command set is discoverable next to the `mobile/package.json` ones, matching how the rest
of the repo works.

### 3. Local env wiring for the mobile app

`mobile/.gitignore` already ignores `.env*.local`, and Expo's env loader applies `.env.local` on
top of `.env` automatically. So:

- `mobile/.env` keeps whatever it has today (production or whatever the developer already uses).
- A new `mobile/.env.local` (gitignored, not committed) holds the local Supabase URL/anon key
  printed by `supabase start` (`API URL` and `anon key` fields), e.g.:
  ```
  EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
  EXPO_PUBLIC_SUPABASE_ANON_KEY=<printed by supabase start>
  ```
- Developers who want to run against the local backend create this file once after
  `supabase start`; removing/renaming it reverts to whatever `.env` points at.

No code changes to `lib/supabase.ts` — it already just reads `process.env.EXPO_PUBLIC_SUPABASE_*`.

### 4. Documentation

- New root `CLAUDE.md` (minimal): notes the repo is a monorepo, lists `mobile/` and `supabase/` as
  the two top-level pieces, and documents the `npm run supabase:*` commands.
- `mobile/CLAUDE.md`: update the `Supabase backend` section to note the project now lives in
  `../supabase` (repo root) instead of `mobile/supabase`, and cross-reference the local dev flow
  (`.env.local`).

## Testing

This is infra/config, not application logic — no automated test surface. Verification is
functional:

1. `npm run supabase:start` from repo root brings up the local stack (Studio URL printed, no
   errors about missing `supabase/` folder).
2. `supabase status` shows the migration applied.
3. Mobile app boots against the local backend when `.env.local` is populated (`npx expo start` in
   `mobile/`, confirm a Supabase-backed screen — e.g. login — talks to `127.0.0.1:54321`).
4. `git status` after the move shows `supabase/` moved with history preserved (`git log --follow`
   on a file inside it still shows prior commits), and `mobile/supabase/` is gone.
