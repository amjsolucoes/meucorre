# 🎯 Passos para Atualizar o Ícone (Logo 1024x1024)

## ✅ O que você já fez:
- [x] Redimensionou `logo-app-meucorre.png` para 1024x1024 ✓

## 🚀 Próximos Passos:

### 1️⃣ Pare o Metro Bundler
Se o Expo estiver rodando, pressione `Ctrl+C` no terminal

### 2️⃣ Limpe e Reconstrua (OBRIGATÓRIO)

Execute estes comandos na ordem:

```bash
# Remova as pastas nativas antigas
rm -rf ios android

# Gere novamente com o novo ícone
npx expo prebuild --clean
```

### 3️⃣ Rode no Simulador

**Para iOS:**
```bash
npx expo run:ios
```

**Para Android:**
```bash
npx expo run:android
```

## ⚡ Atalho Rápido

Ou use o script que criei:

```bash
./REBUILD_ICONE.sh
```

Depois rode:
```bash
npx expo run:ios
```

## 🎨 O que vai acontecer:

1. O Expo vai gerar os assets nativos do ícone em vários tamanhos
2. iOS: vai criar ícones para iPhone, iPad, App Store
3. Android: vai criar adaptive icon com foreground/background
4. O app será recompilado com o novo ícone
5. Quando abrir o simulador, você verá a `logo-app-meucorre.png` como ícone

## ⏱️ Tempo Estimado:
- Prebuild: ~30 segundos
- Build iOS: ~2-3 minutos
- Build Android: ~3-5 minutos

## ✅ Verificação Final:

Após o build, você deve ver:
- ✅ Ícone na tela inicial do simulador: sua logo colorida
- ✅ Splash screen: transição logo-app-meucorre → logo-amj-cinza
- ✅ Fundo branco no splash

## 🐛 Se ainda não funcionar:

```bash
# Desinstale o app do simulador manualmente
# (pressione e segure o ícone → Remover App)

# Depois rode novamente
npx expo run:ios
```

## 📝 Nota Importante:

O ícone **NUNCA** atualiza com apenas `expo start`. É necessário:
- `npx expo prebuild` (gera assets nativos)
- `npx expo run:ios/android` (compila o app nativo)

Apenas reiniciar o Metro bundler não é suficiente! 🚫
