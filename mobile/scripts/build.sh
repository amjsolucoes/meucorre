#!/usr/bin/env bash
# =============================================================================
# build.sh — Script de build do Meu Corre
# =============================================================================
# Uso:
#   ./scripts/build.sh                  → menu interativo
#   ./scripts/build.sh local ios        → prebuild + run local iOS
#   ./scripts/build.sh local android    → prebuild + run local Android
#   ./scripts/build.sh eas dev          → EAS build development (interno)
#   ./scripts/build.sh eas preview      → EAS build preview (APK interno)
#   ./scripts/build.sh eas prod         → EAS build production (loja)
# =============================================================================

set -euo pipefail

# ── Cores ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helpers ───────────────────────────────────────────────────────────────────
log()     { echo -e "${BLUE}▶${RESET} $*"; }
success() { echo -e "${GREEN}✔${RESET} $*"; }
warn()    { echo -e "${YELLOW}⚠${RESET} $*"; }
error()   { echo -e "${RED}✖${RESET} $*" >&2; }
header()  { echo -e "\n${BOLD}${CYAN}$*${RESET}\n"; }
divider() { echo -e "${CYAN}────────────────────────────────────────────────${RESET}"; }

# ── Verifica dependências ─────────────────────────────────────────────────────
check_deps() {
  local missing=0

  if ! command -v node &>/dev/null; then
    error "Node.js não encontrado. Instale em https://nodejs.org"
    missing=1
  fi

  if ! command -v npx &>/dev/null; then
    error "npx não encontrado. Instale o Node.js"
    missing=1
  fi

  if [[ $missing -eq 1 ]]; then
    exit 1
  fi
}

# ── Verifica se eas-cli está instalado ────────────────────────────────────────
check_eas() {
  if ! command -v eas &>/dev/null && ! npx eas --version &>/dev/null 2>&1; then
    warn "eas-cli não encontrado. Instalando globalmente..."
    npm install -g eas-cli
    success "eas-cli instalado"
  fi
}

# ── Verifica login no EAS ─────────────────────────────────────────────────────
check_eas_login() {
  if ! eas whoami &>/dev/null 2>&1; then
    warn "Você não está logado no EAS. Fazendo login..."
    eas login
  else
    local user
    user=$(eas whoami 2>/dev/null || echo "desconhecido")
    success "Logado no EAS como: ${user}"
  fi
}

# ── Instala dependências npm se necessário ────────────────────────────────────
install_deps() {
  if [[ ! -d "node_modules" ]]; then
    log "Instalando dependências npm..."
    npm install
    success "Dependências instaladas"
  else
    log "node_modules já existe. Pulando npm install."
  fi
}

# ── BUILD LOCAL (expo prebuild + run) ─────────────────────────────────────────
build_local() {
  local platform="${1:-}"

  if [[ -z "$platform" ]]; then
    echo ""
    echo "  ${BOLD}Plataforma:${RESET}"
    echo "  1) iOS"
    echo "  2) Android"
    echo "  3) Ambos"
    echo ""
    read -rp "  Escolha [1-3]: " plat_choice
    case "$plat_choice" in
      1) platform="ios" ;;
      2) platform="android" ;;
      3) platform="both" ;;
      *) error "Opção inválida"; exit 1 ;;
    esac
  fi

  header "🔨 Build Local — expo prebuild"
  warn "Build local gera as pastas /ios e /android nativas."
  warn "Requer Xcode (iOS) ou Android Studio (Android) instalados."
  echo ""

  install_deps

  if [[ "$platform" == "ios" || "$platform" == "both" ]]; then
    log "Executando prebuild para iOS..."
    npx expo prebuild --platform ios --clean
    success "Prebuild iOS concluído"

    log "Iniciando app no simulador iOS..."
    npx expo run:ios
  fi

  if [[ "$platform" == "android" || "$platform" == "both" ]]; then
    log "Executando prebuild para Android..."
    npx expo prebuild --platform android --clean
    success "Prebuild Android concluído"

    log "Iniciando app no emulador Android..."
    npx expo run:android
  fi
}

# ── BUILD EAS (nuvem) ─────────────────────────────────────────────────────────
build_eas() {
  local profile="${1:-}"

  if [[ -z "$profile" ]]; then
    echo ""
    echo "  ${BOLD}Perfil de build:${RESET}"
    echo "  1) development  — Dev client (teste interno com expo-dev-client)"
    echo "  2) preview      — APK para teste interno (sem loja)"
    echo "  3) production   — Build final para publicar na loja"
    echo ""
    read -rp "  Escolha [1-3]: " prof_choice
    case "$prof_choice" in
      1) profile="development" ;;
      2) profile="preview" ;;
      3) profile="production" ;;
      *) error "Opção inválida"; exit 1 ;;
    esac
  fi

  echo ""
  echo "  ${BOLD}Plataforma:${RESET}"
  echo "  1) iOS"
  echo "  2) Android"
  echo "  3) Ambos"
  echo ""
  read -rp "  Escolha [1-3]: " plat_choice
  local platform_flag=""
  case "$plat_choice" in
    1) platform_flag="--platform ios" ;;
    2) platform_flag="--platform android" ;;
    3) platform_flag="--platform all" ;;
    *) error "Opção inválida"; exit 1 ;;
  esac

  header "☁️  EAS Build — perfil: ${BOLD}${profile}${RESET}"

  check_eas
  check_eas_login
  install_deps

  # Confirma antes de production
  if [[ "$profile" == "production" ]]; then
    echo ""
    warn "Você está prestes a fazer um build de PRODUÇÃO."
    warn "Este build pode ser enviado para a App Store / Google Play."
    read -rp "  Confirmar? [s/N]: " confirm
    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
      log "Cancelado."
      exit 0
    fi
  fi

  log "Iniciando EAS build (${profile}) — isso pode levar alguns minutos..."
  echo ""

  # shellcheck disable=SC2086
  npx eas build --profile "$profile" $platform_flag --non-interactive

  success "EAS build enviado para a fila!"
  log "Acompanhe em: https://expo.dev/accounts/[seu-usuario]/projects/meu-corre-app/builds"
}

# ── MENU PRINCIPAL ────────────────────────────────────────────────────────────
show_menu() {
  clear
  divider
  echo -e "  ${BOLD}${CYAN}📱 Meu Corre — Build Script${RESET}"
  divider
  echo ""
  echo "  ${BOLD}O que você quer fazer?${RESET}"
  echo ""
  echo "  ${GREEN}LOCAL (roda no seu computador)${RESET}"
  echo "  1) Prebuild + rodar no simulador/emulador"
  echo ""
  echo "  ${BLUE}EAS (build na nuvem da Expo)${RESET}"
  echo "  2) Build development  — para testar com expo-dev-client"
  echo "  3) Build preview      — APK/IPA para testar sem loja"
  echo "  4) Build production   — para publicar na App Store / Google Play"
  echo ""
  echo "  5) Sair"
  echo ""
  divider
  read -rp "  Escolha [1-5]: " choice
  echo ""

  case "$choice" in
    1) build_local ;;
    2) build_eas "development" ;;
    3) build_eas "preview" ;;
    4) build_eas "production" ;;
    5) log "Até mais!"; exit 0 ;;
    *) error "Opção inválida"; show_menu ;;
  esac
}

# ── ENTRY POINT ───────────────────────────────────────────────────────────────
# Muda para a raiz do projeto (onde o script está em /scripts/)
cd "$(dirname "$0")/.."

check_deps

# Modo direto via argumentos: ./scripts/build.sh local ios
if [[ $# -ge 1 ]]; then
  mode="${1:-}"
  arg2="${2:-}"
  case "$mode" in
    local)   build_local "$arg2" ;;
    eas)     build_eas "$arg2" ;;
    *)       error "Modo inválido: $mode. Use 'local' ou 'eas'"; exit 1 ;;
  esac
else
  show_menu
fi
