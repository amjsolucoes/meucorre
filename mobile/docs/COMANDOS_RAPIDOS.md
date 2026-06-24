# ⚡ Comandos Rápidos

Copie e cole estes comandos para testar o app rapidamente.

---

## 🌐 Testar na Web

```bash
npx expo start --clear
```

**Depois pressione:** `w`

**Resultado esperado:** App abre no navegador sem erros

---

## 📱 Testar no Android

```bash
npm run android
```

**Resultado esperado:** App compila e abre no emulador

---

## 🍎 Testar no iOS (Mac apenas)

```bash
npm run ios
```

**Resultado esperado:** App compila e abre no simulador

---

## 🔍 Verificar Configuração Web

```bash
./scripts/verificar-config-web.sh
```

**Resultado esperado:** Mostra status de todos os arquivos necessários

---

## 🧹 Limpar Cache Completo

```bash
rm -rf node_modules/.cache .expo web-build && npx expo start --clear
```

**Use quando:** Erros persistirem após correções

---

## 🔄 Reinstalar Dependências

```bash
rm -rf node_modules && npm install && npx expo start --clear
```

**Use quando:** Suspeitar de problemas com node_modules

---

## 🏗️ Rebuild Android

```bash
cd android && ./gradlew clean && cd .. && npm run android
```

**Use quando:** Build Android falhar

---

## 📦 Gerar AAB (EAS Build)

```bash
eas build --platform android --profile production
```

**Use quando:** Pronto para publicar na loja

---

## 📦 Gerar AAB (Build Local)

```bash
cd android && ./gradlew bundleRelease && cd ..
```

**Arquivo gerado em:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔍 Verificar Package Name

```bash
grep "package com" android/app/src/main/java/com/amjsolucoes/meucorre/*.kt
```

**Resultado esperado:**
```
MainActivity.kt:package com.amjsolucoes.meucorre
MainApplication.kt:package com.amjsolucoes.meucorre
```

---

## 📋 Verificar Versão do App

```bash
cat app.json | grep version
```

**Resultado esperado:** `"version": "1.0.0"`

---

## 🔍 Verificar Campo "browser" no package.json

```bash
cat package.json | grep -A 3 '"browser"'
```

**Resultado esperado:**
```json
"browser": {
  "react-native-google-mobile-ads": "./react-native-google-mobile-ads.web.js"
}
```

---

## 📁 Verificar Mock do AdMob

```bash
ls -la react-native-google-mobile-ads.web.js
```

**Resultado esperado:** Arquivo existe (~4KB)

---

## 🧪 Executar Testes

```bash
npm test
```

**Resultado esperado:** Todos os testes passam

---

## 📊 Verificar Cobertura de Testes

```bash
npm run test:coverage
```

**Resultado esperado:** Relatório de cobertura gerado

---

## 🔄 Executar Prebuild (Android)

```bash
npx expo prebuild --clean --platform android
```

**Use quando:** Mudanças no app.json ou plugins

---

## 🔄 Executar Prebuild (iOS)

```bash
npx expo prebuild --clean --platform ios
```

**Use quando:** Mudanças no app.json ou plugins (Mac apenas)

---

## 🔄 Executar Prebuild (Ambos)

```bash
npx expo prebuild --clean
```

**Use quando:** Mudanças no app.json ou plugins (ambas plataformas)

---

## 📱 Abrir Emulador Android

```bash
emulator -avd Pixel_5_API_34
```

**Ajuste:** Substitua `Pixel_5_API_34` pelo nome do seu emulador

---

## 📱 Listar Emuladores Android

```bash
emulator -list-avds
```

**Resultado:** Lista de emuladores disponíveis

---

## 🔍 Verificar Dispositivos Conectados

```bash
# Android
adb devices

# iOS (Mac apenas)
xcrun simctl list devices
```

---

## 🧹 Limpar Build Android

```bash
cd android && ./gradlew clean && cd ..
```

---

## 🧹 Limpar Cache do Gradle

```bash
rm -rf ~/.gradle/caches
```

**Use quando:** Problemas persistentes com Gradle

---

## 🔍 Ver Logs do Android

```bash
adb logcat | grep -i "ReactNative"
```

**Use quando:** Debugar problemas no Android

---

## 🔍 Ver Logs do Metro Bundler

```bash
npx expo start --clear
```

**Logs aparecem no terminal**

---

## 📦 Instalar Dependências

```bash
npm install
```

---

## 📦 Atualizar Dependências

```bash
npm update
```

---

## 🔍 Verificar Dependências Desatualizadas

```bash
npm outdated
```

---

## 🔍 Verificar Vulnerabilidades

```bash
npm audit
```

---

## 🔧 Corrigir Vulnerabilidades

```bash
npm audit fix
```

---

## 🎯 Comandos Mais Usados

### Desenvolvimento Diário

```bash
# 1. Iniciar servidor
npx expo start --clear

# 2. Abrir no navegador (pressione 'w')
# 3. Abrir no Android (pressione 'a')
# 4. Abrir no iOS (pressione 'i')
```

### Quando Algo Quebra

```bash
# 1. Limpar tudo
rm -rf node_modules/.cache .expo web-build

# 2. Reiniciar servidor
npx expo start --clear

# 3. Se ainda não funcionar
rm -rf node_modules
npm install
npx expo start --clear
```

### Antes de Publicar

```bash
# 1. Testar em todas as plataformas
npx expo start --clear  # Web
npm run android         # Android
npm run ios            # iOS

# 2. Executar testes
npm test

# 3. Gerar AAB
eas build --platform android --profile production

# 4. Gerar IPA (iOS)
eas build --platform ios --profile production
```

---

## 📚 Documentação Relacionada

- **Erro Web:** `docs/SOLUCAO_ERRO_WEB_ADMOB.md`
- **Erro Android:** `docs/CORRECAO_ERRO_ANDROID_BUILDCONFIG.md`
- **Resumo Completo:** `docs/RESUMO_SESSAO_CORRECOES.md`
- **Checklist Web:** `docs/CHECKLIST_TESTE_WEB.md`
- **Publicação:** `docs/GUIA_PUBLICACAO_LOJAS.md`

---

**Dica:** Salve este arquivo nos favoritos para acesso rápido! 🚀
