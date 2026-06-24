#!/bin/bash

# Script de Verificação: Configuração Web do AdMob
# Verifica se todos os arquivos e configurações estão corretos

echo "🔍 Verificando configuração para rodar app na web..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de problemas
PROBLEMAS=0

# 1. Verificar mock na raiz
echo "1️⃣ Verificando mock na raiz do projeto..."
if [ -f "react-native-google-mobile-ads.web.js" ]; then
    echo -e "${GREEN}✅ Mock encontrado: react-native-google-mobile-ads.web.js${NC}"
else
    echo -e "${RED}❌ Mock NÃO encontrado na raiz!${NC}"
    echo "   Solução: cp mocks/react-native-google-mobile-ads.web.js ."
    PROBLEMAS=$((PROBLEMAS + 1))
fi
echo ""

# 2. Verificar backup do mock
echo "2️⃣ Verificando backup do mock..."
if [ -f "mocks/react-native-google-mobile-ads.web.js" ]; then
    echo -e "${GREEN}✅ Backup encontrado: mocks/react-native-google-mobile-ads.web.js${NC}"
else
    echo -e "${YELLOW}⚠️  Backup não encontrado (não crítico)${NC}"
fi
echo ""

# 3. Verificar campo "browser" no package.json
echo "3️⃣ Verificando campo 'browser' no package.json..."
if grep -q '"browser"' package.json; then
    echo -e "${GREEN}✅ Campo 'browser' encontrado no package.json${NC}"
    
    # Verificar se aponta para o arquivo correto
    if grep -q '"react-native-google-mobile-ads": "./react-native-google-mobile-ads.web.js"' package.json; then
        echo -e "${GREEN}✅ Mapeamento correto configurado${NC}"
    else
        echo -e "${RED}❌ Mapeamento incorreto!${NC}"
        echo "   Esperado: \"react-native-google-mobile-ads\": \"./react-native-google-mobile-ads.web.js\""
        PROBLEMAS=$((PROBLEMAS + 1))
    fi
else
    echo -e "${RED}❌ Campo 'browser' NÃO encontrado no package.json!${NC}"
    echo "   Solução: Adicionar campo 'browser' no package.json"
    PROBLEMAS=$((PROBLEMAS + 1))
fi
echo ""

# 4. Verificar webpack.config.js (backup)
echo "4️⃣ Verificando webpack.config.js (backup)..."
if [ -f "webpack.config.js" ]; then
    echo -e "${GREEN}✅ webpack.config.js encontrado (backup)${NC}"
else
    echo -e "${YELLOW}⚠️  webpack.config.js não encontrado (não crítico)${NC}"
fi
echo ""

# 5. Verificar se node_modules existe
echo "5️⃣ Verificando node_modules..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules encontrado${NC}"
else
    echo -e "${RED}❌ node_modules NÃO encontrado!${NC}"
    echo "   Solução: npm install"
    PROBLEMAS=$((PROBLEMAS + 1))
fi
echo ""

# 6. Verificar se react-native-google-mobile-ads está instalado
echo "6️⃣ Verificando instalação do react-native-google-mobile-ads..."
if [ -d "node_modules/react-native-google-mobile-ads" ]; then
    echo -e "${GREEN}✅ react-native-google-mobile-ads instalado${NC}"
else
    echo -e "${RED}❌ react-native-google-mobile-ads NÃO instalado!${NC}"
    echo "   Solução: npm install"
    PROBLEMAS=$((PROBLEMAS + 1))
fi
echo ""

# 7. Verificar cache do Expo
echo "7️⃣ Verificando cache do Expo..."
if [ -d ".expo" ]; then
    echo -e "${YELLOW}⚠️  Cache do Expo existe (.expo/)${NC}"
    echo "   Recomendação: Limpar cache com 'npx expo start --clear'"
else
    echo -e "${GREEN}✅ Sem cache do Expo${NC}"
fi
echo ""

# 8. Verificar cache do Metro
echo "8️⃣ Verificando cache do Metro..."
if [ -d "node_modules/.cache" ]; then
    echo -e "${YELLOW}⚠️  Cache do Metro existe (node_modules/.cache/)${NC}"
    echo "   Recomendação: Limpar com 'rm -rf node_modules/.cache'"
else
    echo -e "${GREEN}✅ Sem cache do Metro${NC}"
fi
echo ""

# 9. Verificar web-build
echo "9️⃣ Verificando web-build..."
if [ -d "web-build" ]; then
    echo -e "${YELLOW}⚠️  Pasta web-build existe${NC}"
    echo "   Recomendação: Limpar com 'rm -rf web-build'"
else
    echo -e "${GREEN}✅ Sem pasta web-build${NC}"
fi
echo ""

# Resumo final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $PROBLEMAS -eq 0 ]; then
    echo -e "${GREEN}🎉 TUDO CERTO! Configuração está correta.${NC}"
    echo ""
    echo "Próximo passo:"
    echo "  npx expo start --clear"
    echo "  Depois pressione 'w' para abrir no navegador"
else
    echo -e "${RED}❌ Encontrados $PROBLEMAS problema(s)!${NC}"
    echo ""
    echo "Siga as soluções indicadas acima e execute este script novamente."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Comandos úteis
echo "📋 Comandos úteis:"
echo ""
echo "  Limpar cache completo:"
echo "    rm -rf node_modules/.cache .expo web-build"
echo ""
echo "  Reinstalar dependências:"
echo "    rm -rf node_modules && npm install"
echo ""
echo "  Iniciar com cache limpo:"
echo "    npx expo start --clear"
echo ""
echo "  Copiar mock do backup:"
echo "    cp mocks/react-native-google-mobile-ads.web.js ."
echo ""

exit $PROBLEMAS
