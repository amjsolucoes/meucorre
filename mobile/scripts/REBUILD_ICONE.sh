#!/bin/bash

echo "🧹 Limpando build anterior..."
rm -rf ios android

echo "📦 Gerando arquivos nativos com o novo ícone..."
npx expo prebuild --clean

echo "✅ Pronto! Agora rode um dos comandos abaixo:"
echo ""
echo "Para iOS:"
echo "  npx expo run:ios"
echo ""
echo "Para Android:"
echo "  npx expo run:android"
