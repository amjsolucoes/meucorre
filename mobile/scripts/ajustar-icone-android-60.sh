#!/bin/bash

# Script para ajustar o ícone do Android com MÁXIMO padding (60%)
# ÚLTIMO RECURSO - só use se 65% ainda estiver grudado

echo "🎨 Ajustando ícone do Android com MÁXIMO espaço (60%)..."
echo "⚠️  ATENÇÃO: Este é o último recurso - ícone ficará bem pequeno!"
echo ""

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

# Cria versão com MÁXIMO padding (reduz para 60% e centraliza)
convert "$ORIGINAL" \
    -resize 60% \
    -gravity center \
    -background white \
    -extent 1024x1024 \
    "$OUTPUT"

echo "✅ Ícone ajustado criado: $OUTPUT (60% do tamanho original)"
echo ""
echo "⚠️  O ícone ficará bem pequeno, mas não grudará nas bordas!"
echo ""
echo "📝 Próximos passos:"
echo "1. Reconstrua o app:"
echo "   npx expo prebuild --platform android --clean"
echo ""
echo "2. Instale no dispositivo:"
echo "   npx expo run:android"
echo ""
echo "3. Reinicie o celular para limpar cache do launcher"
echo ""
echo "💡 Se 60% ainda não funcionar, considere redesenhar a logo"
echo "   com mais espaço interno ou usar fundo transparente."
