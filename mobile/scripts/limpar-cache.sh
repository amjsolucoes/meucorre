#!/bin/bash

# Script para limpar completamente o cache do app no emulador/simulador

echo "🧹 Limpando cache do Expo e React Native..."

# 1. Limpa cache do Metro bundler
rm -rf .expo
rm -rf node_modules/.cache

# 2. Limpa cache do Expo
npx expo start --clear

echo "✅ Cache limpo! Agora reinicie o app no emulador."
echo ""
echo "📱 Para limpar dados do app no emulador:"
echo "   Android: Configurações > Apps > Meu Corre > Limpar dados"
echo "   iOS: Desinstale e reinstale o app"
