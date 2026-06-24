#!/bin/bash

echo "🧹 LIMPEZA COMPLETA - Forçando atualização do ícone"
echo ""

echo "1️⃣ Removendo pastas nativas..."
rm -rf ios android

echo "2️⃣ Limpando cache do Expo..."
rm -rf .expo

echo "3️⃣ Limpando cache do Metro..."
rm -rf node_modules/.cache

echo "4️⃣ Limpando cache do Watchman (se existir)..."
watchman watch-del-all 2>/dev/null || echo "   Watchman não instalado (ok)"

echo ""
echo "✅ Limpeza completa!"
echo ""
echo "📦 Agora rode:"
echo ""
echo "   npx expo prebuild --clean"
echo ""
echo "   Depois:"
echo "   npx expo run:android"
echo ""
echo "⚠️  IMPORTANTE: Desinstale o app do simulador manualmente antes de rodar!"
