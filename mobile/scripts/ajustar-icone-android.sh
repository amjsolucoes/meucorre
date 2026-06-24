#!/bin/bash

# Script para ajustar o ícone do Android com mais padding
# Requer ImageMagick instalado: brew install imagemagick

echo "🎨 Ajustando ícone do Android..."

# Verifica se ImageMagick está instalado
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick não está instalado!"
    echo "📦 Instale com: brew install imagemagick"
    exit 1
fi

# Caminhos
ORIGINAL="./assets/images/logo-app-meucorre.png"
OUTPUT="./assets/images/logo-app-meucorre-android.png"

# Verifica se o arquivo original existe
if [ ! -f "$ORIGINAL" ]; then
    echo "❌ Arquivo original não encontrado: $ORIGINAL"
    exit 1
fi

# Cria versão com mais padding (reduz para 75% e centraliza)
convert "$ORIGINAL" \
    -resize 75% \
    -gravity center \
    -background white \
    -extent 1024x1024 \
    "$OUTPUT"

echo "✅ Ícone ajustado criado: $OUTPUT"
echo ""
echo "📝 Próximos passos:"
echo "1. Atualize o app.json para usar o novo ícone:"
echo "   \"foregroundImage\": \"./assets/images/logo-app-meucorre-android.png\""
echo ""
echo "2. Reconstrua o app:"
echo "   npx expo prebuild --clean"
echo ""
echo "3. Teste no dispositivo Android"
