# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Meu Corre" — React Native (Expo SDK 54, Expo Router) app for self-employed workers (hairdressers, cleaners, etc.) to track earnings, expenses, clients, and appointments. UI must stay extremely simple: large buttons, large text, plain language ("Salvar", "Adicionar"), no technical jargon, max 3 actions per screen. Color convention: green = income, red = expense, blue = neutral.

## Commands

```bash
npm install              # install deps (package-lock.json is canonical; pnpm files in the repo are not the active workflow)
npx expo start           # start dev server
npm run ios              # expo run:ios
npm run android          # expo run:android
npm run web               # expo start --web
npm run lint              # expo lint (eslint-config-expo flat config)
npm test                  # jest --passWithNoTests
npm run test:watch
npm run test:coverage
```

Run a single test file or test name:
```bash
npx jest __tests__/use-transactions.test.ts
npx jest -t "test name substring"
```

Builds (wraps `eas`/`expo prebuild`, see `scripts/build.sh`):
```bash
npm run build              # interactive menu
npm run build:local:ios    # expo prebuild --clean + expo run:ios
npm run build:local:android
npm run build:dev          # eas build --profile development
npm run build:preview      # eas build --profile preview
npm run build:prod         # eas build --profile production (asks for confirmation)
```

## Architecture

**Routing**: Expo Router, file-based, under `app/`. `app/_layout.tsx` is the root: it gates rendering on `useAuth().initialized` (shows `app/splash.tsx` until Supabase session restore completes), sets up notification channels/listeners, and initializes AdMob. Top-level groups: `(auth)` (login/signup/reset), `(tabs)` (main app — index/agenda/clientes/relatorios/plus), plus standalone routes for `cliente/`, `corre/`, `agenda/`, `ganho/`, `gasto/`, `recibo/`, `historico/`, `perfil/`.

**Data layer pattern**: Supabase is never called from components directly. Every domain area has a hook in `hooks/use-*.ts` (e.g. `use-transactions.ts`, `use-clients.ts`, `use-appointments.ts`, `use-profile.ts`) that owns its own `useState`/`useEffect`/fetch logic, reads `user` from `useAuthStore`, and scopes every Supabase query with `.eq('user_id', user.id)`. Screens call these hooks; they don't touch `lib/supabase.ts` directly. Note: despite AGENTS.md saying transactions use `'ganho'/'gasto'`, the actual schema/code uses `type: 'income' | 'expense'` — trust the code over AGENTS.md on this point.

**Auth**: `lib/supabase.ts` builds the Supabase client with a custom storage adapter (`AsyncStorage` primary, `SecureStore` legacy fallback, both wrapped with timeouts) and `flowType: 'pkce'`. `hooks/use-auth.ts` restores the session on mount, subscribes to `onAuthStateChange`, and on any refresh-token failure wipes local storage (`clearLocalStorageSilently`) before resetting state — this is the standard recovery path for corrupted/stale sessions, don't add separate ad-hoc clearing logic elsewhere. Global auth state lives in `stores/auth.ts` (Zustand): `session`, `user`, `initialized`, `isProcessingPasswordReset`. `isProcessingPasswordReset` must be checked before reacting to auth events during the password-reset deep-link flow.

**State management**: Zustand stores in `stores/` (`auth.ts`, `profile.ts`, `drawer.ts`, `ui.ts`) for cross-screen state. Per-screen/local state stays in components.

**Styling**: NativeWind/Tailwind classes only (`tailwind.config.js`, `global.css`); `StyleSheet.create()` is forbidden project-wide.

**Forms**: React Hook Form + Zod for every form (signup, login, client, transaction, etc.).

**Supabase backend**: Tables `profiles`, `transactions`, `clients`, `appointments` (and optionally `receipts`). All are RLS-enabled, policies scoped to `auth.uid() = user_id` (or `= id` for `profiles`) — see `supabase/migrations/`. A `handle_new_user` trigger on `auth.users` auto-creates a `profiles` row on signup.

**Testing**: Jest + `jest-expo` + RNTL. `__tests__/setup.ts` is the global mock layer — it mocks `@/lib/supabase` (via a chainable fluent mock that resolves like postgrest-js, with a `_resolveWith()` helper to change the resolved value per test), `expo-router`, `expo-notifications`, `@/stores/auth`, and `@/hooks/use-notifications`. New hook tests should reuse/extend these mocks rather than re-mocking Supabase from scratch. `collectCoverageFrom` is limited to `hooks/`, `stores/`, `lib/`.

**Ads/Notifications**: `lib/admob.ts` initializes AdMob (`initializeAdMob()`, called once in root layout); `hooks/use-notifications.ts` handles local notification scheduling for appointment reminders and Android notification channel setup.

## Conventions (from AGENTS.md)

- TypeScript required everywhere; components as typed arrow functions.
- No direct `fetch`/Supabase calls inside components — always through a hook in `hooks/`.
- Dates formatted pt-BR (e.g. "Segunda, 5 de maio") via `date-fns`; currency always `R$` with 2 decimals.
- Confirm before any destructive delete.
- Platform handling: `SafeAreaView` on iOS, manual `StatusBar` handling on Android, `KeyboardAvoidingView` with `behavior="padding"` (iOS) / `"height"` (Android).
- Never use custom fonts without native fallback (`Platform.select({ ios: 'System', android: 'Roboto' })`).
- Touch targets ≥ 44x44 (iOS) / 48x48 (Android); every interactive element needs `accessibilityLabel`; decorative images `accessible={false}`.
- Lists use `FlatList`/`FlashList`, never `ScrollView` + `.map()`.
- Don't introduce libraries outside the established stack without approval.

## Documentation rules (`.kiro/steering/documentation-rules.md`)

- New docs go in `docs/` (UPPER_CASE filenames), not the repo root. Exceptions allowed at root: `README.md`, `AGENTS.md`, `CHANGELOG.md`, `LICENSE.md`.
- New scripts go in `scripts/` (kebab-case filenames).
