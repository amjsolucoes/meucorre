#!/bin/bash

# Script para ajustar o ícone do Android com MAIS padding (70% em vez de 75%)
# Para ícones que ainda ficam grudados nas bordas

echo "🎨 Ajustando ícone do Android com mais espaço (70%)..."

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

# Backup do arquivo anterior (se existir)
if [ -f "$OUTPUT" ]; then
    cp "$OUTPUT" "${OUTPUT}.backup"
    echo "📦 Backup criado: ${OUTPUT}.backup"
fi

# Cria versão com MAIS padding (reduz para 70% e centraliza)
convert "$ORIGINAL" \
    -resize 70% \
    -gravity center \
    -background white \
    -extent 1024x1024 \
    "$OUTPUT"

echo "✅ Ícone ajustado criado: $OUTPUT"
echo ""
echo "📝 Próximos passos:"
echo "1. Reconstrua o app:"
echo "   npx expo prebuild --platform android --clean"
echo ""
echo "2. Instale no dispositivo:"
echo "   npx expo run:android"
echo ""
echo "3. Se ainda estiver grudado, tente 65%:"
echo "   Edite este script e mude 'resize 70%' para 'resize 65%'"
