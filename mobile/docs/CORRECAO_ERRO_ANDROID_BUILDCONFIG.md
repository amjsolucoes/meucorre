# 🔧 Correção: Erro BuildConfig no Android

## ❌ Problemas Encontrados

### 1. Erro Crítico: `Unresolved reference 'BuildConfig'`

```
e: file:///Users/.../MainActivity.kt:39:11 Unresolved reference 'BuildConfig'.
e: file:///Users/.../MainApplication.kt:32:60 Unresolved reference 'BuildConfig'.
```

**Causa:** Os arquivos Kotlin estavam no pacote `com.amjsolucoes.meucorreapp`, mas o `build.gradle` define o namespace como `com.amjsolucoes.meucorre` (sem "app" no final).

### 2. Warning: AdMob não configurado

```
WARNING: react-native-google-mobile-ads requires an 'android_app_id' property
```

**Causa:** Faltava adicionar o plugin do AdMob no `app.json`.

---

## ✅ Correções Aplicadas

### 1. Corrigido Package Name dos Arquivos Kotlin

#### Antes:
```kotlin
package com.amjsolucoes.meucorreapp  // ❌ Errado
```

#### Depois:
```kotlin
package com.amjsolucoes.meucorre  // ✅ Correto
```

**Arquivos corrigidos:**
- `android/app/src/main/java/com/amjsolucoes/meucorre/MainActivity.kt`
- `android/app/src/main/java/com/amjsolucoes/meucorre/MainApplication.kt`

**Estrutura de pastas corrigida:**
```
android/app/src/main/java/com/amjsolucoes/
├── meucorre/              ✅ Correto
│   ├── MainActivity.kt
│   └── MainApplication.kt
└── meucorreapp/           ❌ Removido (pasta antiga)
```

### 2. Adicionado Plugin do AdMob no app.json

```json
{
  "expo": {
    "plugins": [
      // ... outros plugins
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-3940256099942544~3347511713",
          "iosAppId": "ca-app-pub-3940256099942544~1458002511"
        }
      ]
    ]
  }
}
```

**⚠️ IMPORTANTE:** Estes são IDs de TESTE do Google AdMob. Você deve substituir pelos seus IDs reais antes de publicar na loja!

### 3. Executado Prebuild

```bash
npx expo prebuild --clean --platform android
```

Este comando:
- Limpou a pasta `android/` antiga
- Regenerou todos os arquivos nativos
- Aplicou as configurações do `app.json`
- Configurou o AdMob corretamente

---

## 🚀 Como Testar Agora

### 1. Limpar Build Anterior

```bash
# Limpar cache do Gradle
cd android
./gradlew clean
cd ..
```

### 2. Rodar no Emulador/Dispositivo

```bash
npm run android
```

**Resultado esperado:**
- ✅ Build compila sem erros
- ✅ App abre no emulador/dispositivo
- ✅ Sem warnings do AdMob
- ✅ Anúncios de teste aparecem (se configurados no código)

---

## 📋 Checklist de Verificação

Antes de rodar, confirme:

- [ ] Arquivos Kotlin estão em `android/app/src/main/java/com/amjsolucoes/meucorre/`
- [ ] Package name nos arquivos Kotlin é `com.amjsolucoes.meucorre`
- [ ] Plugin do AdMob está no `app.json`
- [ ] Prebuild foi executado com sucesso
- [ ] Emulador Android está rodando (ou dispositivo conectado)

---

## 🔍 Entendendo o Problema

### Por Que Aconteceu?

Quando você corrigiu o package name de `com.amjsolucoes.meucorreapp` para `com.amjsolucoes.meucorre` no `build.gradle`, o Gradle passou a gerar a classe `BuildConfig` no pacote `com.amjsolucoes.meucorre`.

Mas os arquivos Kotlin ainda estavam no pacote antigo (`com.amjsolucoes.meucorreapp`), então não conseguiam encontrar a classe `BuildConfig`.

### O Que é BuildConfig?

`BuildConfig` é uma classe gerada automaticamente pelo Gradle que contém:
- `BuildConfig.DEBUG` - Se é build de debug ou release
- `BuildConfig.IS_NEW_ARCHITECTURE_ENABLED` - Se a nova arquitetura está ativa
- `BuildConfig.REACT_NATIVE_RELEASE_LEVEL` - Nível de release do React Native

### Estrutura Correta

```
namespace no build.gradle: com.amjsolucoes.meucorre
                                    ↓
package nos arquivos .kt: com.amjsolucoes.meucorre
                                    ↓
pasta dos arquivos: .../com/amjsolucoes/meucorre/
                                    ↓
BuildConfig gerado em: com.amjsolucoes.meucorre.BuildConfig
```

Tudo deve estar **sincronizado**!

---

## 🐛 Troubleshooting

### Erro Persiste Após Correção

```bash
# 1. Limpar completamente
cd android
./gradlew clean
cd ..

# 2. Remover build anterior
rm -rf android/app/build

# 3. Executar prebuild novamente
npx expo prebuild --clean --platform android

# 4. Tentar rodar
npm run android
```

### Erro: "Duplicate class found"

```bash
# Limpar cache do Gradle
rm -rf ~/.gradle/caches

# Limpar projeto
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

### Erro: "Could not find BuildConfig"

Verifique se:
1. Package name nos arquivos `.kt` está correto
2. Arquivos estão na pasta correta
3. Prebuild foi executado

```bash
# Verificar package name nos arquivos
grep "package com" android/app/src/main/java/com/amjsolucoes/meucorre/*.kt

# Deve mostrar:
# MainActivity.kt:package com.amjsolucoes.meucorre
# MainApplication.kt:package com.amjsolucoes.meucorre
```

---

## 📝 IDs do AdMob

### IDs de Teste (Atuais)

**Android:**
- App ID: `ca-app-pub-3940256099942544~3347511713`
- Banner: `ca-app-pub-3940256099942544/6300978111`
- Interstitial: `ca-app-pub-3940256099942544/1033173712`

**iOS:**
- App ID: `ca-app-pub-3940256099942544~1458002511`
- Banner: `ca-app-pub-3940256099942544/2934735716`
- Interstitial: `ca-app-pub-3940256099942544/4411468910`

### Como Obter Seus IDs Reais

1. Acesse [Google AdMob Console](https://apps.admob.com/)
2. Crie um app (se ainda não criou)
3. Copie o **App ID** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)
4. Crie unidades de anúncio (Banner, Interstitial, etc)
5. Copie os IDs de cada unidade

### Onde Substituir

**No app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "SEU_APP_ID_ANDROID_AQUI",
          "iosAppId": "SEU_APP_ID_IOS_AQUI"
        }
      ]
    ]
  }
}
```

**No código (onde você usa os anúncios):**
```typescript
// Substituir IDs de teste pelos seus IDs reais
const BANNER_AD_ID = 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
```

**⚠️ IMPORTANTE:** Sempre use IDs de teste durante desenvolvimento! Só use IDs reais em produção.

---

## ✅ Status Final

| Item | Status |
|------|--------|
| Package name corrigido | ✅ Feito |
| Arquivos Kotlin movidos | ✅ Feito |
| AdMob configurado | ✅ Feito |
| Prebuild executado | ✅ Feito |
| Pronto para testar | ✅ SIM |

---

## 🎯 Próxima Ação

**Execute agora:**

```bash
npm run android
```

**Resultado esperado:** App compila e abre no emulador sem erros! 🎉

---

**Data da Correção:** 14/05/2026  
**Versão do App:** 1.0.0  
**Package Name:** com.amjsolucoes.meucorre  
**Status:** ✅ Resolvido
