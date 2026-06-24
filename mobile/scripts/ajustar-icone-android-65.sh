#!/bin/bash

# Script para ajustar o ícone do Android com AINDA MAIS padding (65%)
# Para ícones que continuam grudados mesmo com 70%

echo "🎨 Ajustando ícone do Android com mais espaço (65%)..."

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
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    cp "$OUTPUT" "${OUTPUT}.backup_${TIMESTAMP}"
    echo "📦 Backup criado: ${OUTPUT}.backup_${TIMESTAMP}"
fi

# Cria versão com AINDA MAIS padding (reduz para 65% e centraliza)
convert "$ORIGINAL" \
    -resize 65% \
    -gravity center \
    -background white \
    -extent 1024x1024 \
    "$OUTPUT"

echo "✅ Ícone ajustado criado: $OUTPUT (65% do tamanho original)"
echo ""
echo "📝 Próximos passos:"
echo "1. Reconstrua o app:"
echo "   npx expo prebuild --platform android --clean"
echo ""
echo "2. Instale no dispositivo:"
echo "   npx expo run:android"
echo ""
echo "3. Se AINDA estiver grudado, tente 60%:"
echo "   Edite este script e mude 'resize 65%' para 'resize 60%'"
echo ""
echo "💡 Dica: Reinicie o celular após instalar para limpar cache do launcher"
