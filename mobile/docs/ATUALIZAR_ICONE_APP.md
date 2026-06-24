# 🔄 Como Atualizar o Ícone do App no Simulador

## ⚠️ Por que o ícone não mudou?

O ícone do app é compilado no binário nativo durante o build. Apenas reiniciar o Metro bundler (`expo start`) **NÃO atualiza o ícone**.

## ✅ Solução: Rebuild Nativo Completo

### Opção 1: Rebuild Limpo (RECOMENDADO)

```bash
# 1. Pare o Metro bundler (Ctrl+C)

# 2. Limpe tudo
npx expo prebuild --clean

# 3. Rode no iOS
npx expo run:ios

# OU rode no Android
npx expo run:android
```

### Opção 2: Rebuild Rápido

```bash
# 1. Pare o Metro bundler (Ctrl+C)

# 2. Rode diretamente (vai fazer rebuild automático)
npx expo run:ios

# OU
npx expo run:android
```

### Opção 3: Desinstalar e Reinstalar

```bash
# 1. Desinstale o app do simulador manualmente
#    - iOS: Pressione e segure o ícone → "Remover App"
#    - Android: Arraste o ícone para "Desinstalar"

# 2. Rode novamente
npx expo run:ios
# ou
npx expo run:android
```

## 📱 Verificação

Após o rebuild, você deve ver:
- ✅ Ícone na tela inicial: `logo-app-meucorre.png`
- ✅ Splash screen: transição de `logo-app-meucorre.png` → `logo-amj-cinza.png`
- ✅ Fundo branco no splash

## 🎯 Arquivos de Configuração Atualizados

Os arquivos já foram atualizados corretamente:
- ✅ `app.config.js` → `icon: "./assets/images/logo-app-meucorre.png"`
- ✅ `app.json` → `icon: "./assets/images/logo-app-meucorre.png"`
- ✅ `app/splash.tsx` → Usando `logo-app-meucorre.png` e `logo-amj-cinza.png`

## ⏱️ Tempo Estimado

- **iOS Simulator:** ~2-3 minutos
- **Android Emulator:** ~3-5 minutos

## 🐛 Troubleshooting

### Ícone ainda não mudou?

```bash
# Limpe TUDO e reconstrua do zero
rm -rf ios android
npx expo prebuild --clean
npx expo run:ios
```

### Erro "No bundle URL present"?

```bash
# Inicie o Metro bundler em outra janela do terminal
npx expo start

# Em outra janela, rode:
npx expo run:ios
```

### Simulador não abre?

```bash
# Liste os simuladores disponíveis
xcrun simctl list devices

# Abra um simulador específico
open -a Simulator

# Depois rode:
npx expo run:ios
```

## 📝 Nota Importante

**Desenvolvimento vs Produção:**
- **Desenvolvimento (simulador):** Precisa de `npx expo run:ios/android`
- **Produção (lojas):** Precisa de `eas build --platform ios/android`

O ícone que você vê no simulador após o rebuild será o mesmo que aparecerá nas lojas após o build de produção.

## 🚀 Próximos Passos

Depois que o ícone estiver correto no simulador:

1. Teste o splash screen (deve mostrar a transição das logos)
2. Verifique se está tudo funcionando
3. Quando estiver pronto para publicar, rode:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```
