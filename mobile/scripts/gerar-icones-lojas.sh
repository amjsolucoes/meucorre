#!/bin/bash

# 🎨 Script para gerar TODOS os ícones necessários para App Store e Google Play
# Baseado na logo principal do app

echo "🎨 Gerando ícones para App Store e Google Play..."
echo ""

# Verifica se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não está instalado!"
    echo "📦 Instale com: brew install imagemagick"
    exit 1
fi

# Caminhos
LOGO_ORIGINAL="./assets/images/logo-app-meucorre.png"
OUTPUT_DIR="./assets/store-icons"

# Verifica se o arquivo original existe
if [ ! -f "$LOGO_ORIGINAL" ]; then
    echo "❌ Logo original não encontrada: $LOGO_ORIGINAL"
    exit 1
fi

# Cria diretório de saída
mkdir -p "$OUTPUT_DIR/ios"
mkdir -p "$OUTPUT_DIR/android"

echo "📱 Gerando ícones para iOS (App Store)..."
echo ""

# ========================================
# iOS App Store - Ícones do App
# ========================================

# iPhone
convert "$LOGO_ORIGINAL" -resize 120x120 "$OUTPUT_DIR/ios/icon-60@2x.png"
convert "$LOGO_ORIGINAL" -resize 180x180 "$OUTPUT_DIR/ios/icon-60@3x.png"

# iPad
convert "$LOGO_ORIGINAL" -resize 76x76 "$OUTPUT_DIR/ios/icon-76.png"
convert "$LOGO_ORIGINAL" -resize 152x152 "$OUTPUT_DIR/ios/icon-76@2x.png"

# iPad Pro
convert "$LOGO_ORIGINAL" -resize 167x167 "$OUTPUT_DIR/ios/icon-83.5@2x.png"

# App Store (obrigatório para submissão)
convert "$LOGO_ORIGINAL" -resize 1024x1024 "$OUTPUT_DIR/ios/icon-1024.png"

# Notificações
convert "$LOGO_ORIGINAL" -resize 40x40 "$OUTPUT_DIR/ios/icon-20@2x.png"
convert "$LOGO_ORIGINAL" -resize 60x60 "$OUTPUT_DIR/ios/icon-20@3x.png"

# Settings
convert "$LOGO_ORIGINAL" -resize 58x58 "$OUTPUT_DIR/ios/icon-29@2x.png"
convert "$LOGO_ORIGINAL" -resize 87x87 "$OUTPUT_DIR/ios/icon-29@3x.png"

# Spotlight
convert "$LOGO_ORIGINAL" -resize 80x80 "$OUTPUT_DIR/ios/icon-40@2x.png"
convert "$LOGO_ORIGINAL" -resize 120x120 "$OUTPUT_DIR/ios/icon-40@3x.png"

echo "✅ Ícones iOS gerados!"
echo ""

# ========================================
# Android - Google Play Store
# ========================================

echo "🤖 Gerando ícones para Android (Google Play)..."
echo ""

# Ícone principal (com padding para adaptive icon)
convert "$LOGO_ORIGINAL" \
    -resize 65% \
    -gravity center \
    -background white \
    -extent 1024x1024 \
    "$OUTPUT_DIR/android/icon-adaptive-1024.png"

# Ícone para Google Play Store (512x512 obrigatório)
convert "$LOGO_ORIGINAL" \
    -resize 60% \
    -gravity center \
    -background white \
    -extent 512x512 \
    "$OUTPUT_DIR/android/icon-512.png"

# Densidades Android (mipmap)
convert "$LOGO_ORIGINAL" -resize 48x48 "$OUTPUT_DIR/android/mipmap-mdpi-48.png"
convert "$LOGO_ORIGINAL" -resize 72x72 "$OUTPUT_DIR/android/mipmap-hdpi-72.png"
convert "$LOGO_ORIGINAL" -resize 96x96 "$OUTPUT_DIR/android/mipmap-xhdpi-96.png"
convert "$LOGO_ORIGINAL" -resize 144x144 "$OUTPUT_DIR/android/mipmap-xxhdpi-144.png"
convert "$LOGO_ORIGINAL" -resize 192x192 "$OUTPUT_DIR/android/mipmap-xxxhdpi-192.png"

# Adaptive Icon Foreground (com padding)
convert "$LOGO_ORIGINAL" \
    -resize 65% \
    -gravity center \
    -background transparent \
    -extent 432x432 \
    "$OUTPUT_DIR/android/adaptive-foreground-432.png"

echo "✅ Ícones Android gerados!"
echo ""

# ========================================
# Feature Graphic (Google Play)
# ========================================

echo "🎨 Gerando Feature Graphic para Google Play..."

# Feature Graphic 1024x500 (obrigatório para Google Play)
convert "$LOGO_ORIGINAL" \
    -resize 400x400 \
    -gravity center \
    -background "#4D5DFB" \
    -extent 1024x500 \
    "$OUTPUT_DIR/android/feature-graphic-1024x500.png"

echo "✅ Feature Graphic gerado!"
echo ""

# ========================================
# Resumo
# ========================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TODOS OS ÍCONES FORAM GERADOS!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Localização: $OUTPUT_DIR/"
echo ""
echo "📱 iOS (App Store):"
echo "   - 11 tamanhos de ícones gerados"
echo "   - Ícone 1024x1024 para App Store ✅"
echo ""
echo "🤖 Android (Google Play):"
echo "   - 7 densidades de ícones gerados"
echo "   - Ícone 512x512 para Google Play ✅"
echo "   - Feature Graphic 1024x500 ✅"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1️⃣  Para iOS (App Store Connect):"
echo "   - Use: $OUTPUT_DIR/ios/icon-1024.png"
echo "   - Faça upload na seção 'App Icon' do App Store Connect"
echo ""
echo "2️⃣  Para Android (Google Play Console):"
echo "   - Ícone do app: $OUTPUT_DIR/android/icon-512.png"
echo "   - Feature Graphic: $OUTPUT_DIR/android/feature-graphic-1024x500.png"
echo ""
echo "3️⃣  Screenshots ainda precisam ser criados manualmente!"
echo "   - iOS: 6.7\" (iPhone 15 Pro Max) e 5.5\" (iPhone 8 Plus)"
echo "   - Android: Pelo menos 2 screenshots de diferentes telas"
echo ""
echo "💡 Dica: Use o Expo para gerar screenshots automaticamente:"
echo "   npx expo export:screenshots"
echo ""
