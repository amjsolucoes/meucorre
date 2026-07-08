# Monorepo restructure + local Supabase backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Supabase project out of `mobile/supabase/` to a top-level `supabase/` sibling folder, add root-level convenience scripts to run it, and wire local dev so the mobile app can point at the local Supabase instance without touching production config.

**Architecture:** The repo root (`/Volumes/Matrix/Projetos/meu-corre`) is already the git root with `mobile/` as a subfolder — this plan makes `supabase/` its sibling. The Supabase CLI resolves its project root by finding a `supabase/` subdirectory under the cwd, so running commands from the repo root is sufficient; no changes inside `supabase/config.toml` are needed. No npm workspaces, no build-system tooling — `mobile/` remains the only JS package.

**Tech Stack:** Supabase CLI (already installed, `/usr/local/bin/supabase`), Expo's built-in `.env.local` loading, git.

## Global Constraints

- No npm workspaces, no Turborepo/Nx — only `mobile/` is a JS package today (spec Non-goals).
- No change to `lib/supabase.ts`, RLS policies, migrations, or edge function logic (spec Non-goals).
- No change to the production Supabase project or its credentials (spec Non-goals).
- `mobile/.env` stays untouched; local dev creds go in `mobile/.env.local` only (spec Design §3).
- Preserve file history on the move (`git mv`, not delete+recreate) (spec Design §1).

---

### Task 1: Move the Supabase project to the repo root

**Files:**
- Move: `mobile/supabase/` → `supabase/` (git mv, whole directory: `config.toml`, `.gitignore`, `migrations/`, `functions/`, `.temp/`)

**Interfaces:**
- Produces: `supabase/` directory at repo root, containing everything that was under `mobile/supabase/`. Later tasks (root `package.json`, docs) reference this path.

- [ ] **Step 1: Move the directory with git**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git mv mobile/supabase supabase
```

- [ ] **Step 2: Verify the move**

Run: `git status --short`
Expected: shows `supabase/...` entries as renamed from `mobile/supabase/...` (git detects renames automatically since content is identical), and no leftover `mobile/supabase/` path in `git status` or on disk.

Also run: `ls supabase` — expect `config.toml`, `.gitignore`, `functions`, `migrations` (and `.temp` if it existed before, still gitignored via `supabase/.gitignore`).

- [ ] **Step 3: Verify the CLI resolves the moved project**

Run: `cd /Volumes/Matrix/Projetos/meu-corre && supabase status`
Expected: either a table of running services (if Docker/local stack was already up) or `no such container` / "not running" style errors — either is fine here, the key signal is that it does **not** error with something like "cannot find project ref" or "no supabase folder found". If Docker Desktop isn't running, this command may fail with a Docker-connection error — that's expected and not a problem with the move; skip ahead, Task 3 covers actually starting the stack.

- [ ] **Step 4: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add -A
git commit -m "Move supabase project from mobile/supabase to repo root"
```

---

### Task 2: Add root package.json with Supabase convenience scripts

**Files:**
- Create: `package.json` (repo root)

**Interfaces:**
- Consumes: `supabase/` directory from Task 1 (CLI must resolve it from repo root).
- Produces: `npm run supabase:start|stop|status|reset|migration:new` from the repo root.

- [ ] **Step 1: Create the root package.json**

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

Write this to `/Volumes/Matrix/Projetos/meu-corre/package.json`.

- [ ] **Step 2: Verify the scripts resolve**

Run: `cd /Volumes/Matrix/Projetos/meu-corre && npm run supabase:status`
Expected: same output as running `supabase status` directly (proves npm is invoking the CLI from the right cwd) — not an `npm error Missing script` or a `command not found`.

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add package.json
git commit -m "Add root package.json with Supabase convenience scripts"
```

---

### Task 3: Wire local dev env and verify the stack end-to-end

**Files:**
- Create: `mobile/.env.local` (gitignored — not committed)

**Interfaces:**
- Consumes: `supabase start` output (API URL + anon key) from Task 1/2's tooling.
- Consumes: `mobile/lib/supabase.ts:58-59` which reads `process.env.EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` — unchanged, no edits needed there.

- [ ] **Step 1: Start the local Supabase stack**

Run: `cd /Volumes/Matrix/Projetos/meu-corre && npm run supabase:start`

This requires Docker Desktop running. Expected output ends with a block like:

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: ...
anon key: eyJ...
service_role key: eyJ...
```

Copy the `API URL` and `anon key` values for the next step. If Docker isn't running, start Docker Desktop first, then re-run this command — don't proceed to Step 2 without a successful start.

- [ ] **Step 2: Confirm the migration applied**

Run: `supabase status` (or check the Step 1 output) and confirm no migration errors were printed. Optionally open Studio URL from the output in a browser and check the `profiles`/`transactions`/`clients`/`appointments` tables exist (from `supabase/migrations/20260512102747_create_rls_policies.sql`).

- [ ] **Step 3: Create `mobile/.env.local`**

Using the `API URL` and `anon key` printed in Step 1:

```
EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=<paste anon key from supabase start output>
```

Write this to `/Volumes/Matrix/Projetos/meu-corre/mobile/.env.local`. Do not add this file to git — confirm it's ignored:

Run: `cd /Volumes/Matrix/Projetos/meu-corre/mobile && git check-ignore -v .env.local`
Expected: prints a match against the `.env*.local` rule in `mobile/.gitignore` (exit code 0).

- [ ] **Step 4: Boot the app against the local backend**

Run: `cd /Volumes/Matrix/Projetos/meu-corre/mobile && npx expo start --web`

Open the app, go to a Supabase-backed screen (e.g. login/signup). Expected: no network errors in the console pointing at the production URL — requests should go to `127.0.0.1:54321`. Signing up a test user should succeed and the new row should show up in the local Studio's `auth.users`/`profiles` tables.

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 5: Stop the local stack (cleanup)**

Run: `cd /Volumes/Matrix/Projetos/meu-corre && npm run supabase:stop`

No commit for this task — `.env.local` is intentionally not tracked.

---

### Task 4: Update documentation

**Files:**
- Create: `CLAUDE.md` (repo root)
- Modify: `mobile/CLAUDE.md:53` (Supabase backend section)

**Interfaces:**
- None — documentation only, no code interfaces.

- [ ] **Step 1: Create the root CLAUDE.md**

```markdown
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
```

Write this to `/Volumes/Matrix/Projetos/meu-corre/CLAUDE.md`.

- [ ] **Step 2: Update mobile/CLAUDE.md's Supabase backend section**

In `/Volumes/Matrix/Projetos/meu-corre/mobile/CLAUDE.md`, replace line 53:

Old:
```
**Supabase backend**: Tables `profiles`, `transactions`, `clients`, `appointments` (and optionally `receipts`). All are RLS-enabled, policies scoped to `auth.uid() = user_id` (or `= id` for `profiles`) — see `supabase/migrations/`. A `handle_new_user` trigger on `auth.users` auto-creates a `profiles` row on signup.
```

New:
```
**Supabase backend**: The Supabase project lives at the repo root (`../supabase/`), not inside `mobile/` — this repo is a monorepo with `mobile/` and `supabase/` as siblings. Tables `profiles`, `transactions`, `clients`, `appointments` (and optionally `receipts`). All are RLS-enabled, policies scoped to `auth.uid() = user_id` (or `= id` for `profiles`) — see `../supabase/migrations/`. A `handle_new_user` trigger on `auth.users` auto-creates a `profiles` row on signup. For local dev against a local Supabase instance instead of production, see the root `CLAUDE.md`.
```

- [ ] **Step 3: Commit**

```bash
cd /Volumes/Matrix/Projetos/meu-corre
git add CLAUDE.md mobile/CLAUDE.md
git commit -m "Document monorepo layout and local Supabase workflow"
```
