# 🏗️ Gerar AAB Localmente (Sem EAS Build)

## 📋 Visão Geral

Sim! É possível gerar o AAB localmente usando apenas o React Native e Gradle, sem depender dos serviços do Expo (EAS Build).

---

## ✅ Vantagens de Gerar Localmente

- ✅ **Gratuito** - Não precisa de conta EAS paga
- ✅ **Mais rápido** - Build na sua máquina
- ✅ **Controle total** - Você gerencia o processo
- ✅ **Offline** - Não depende de servidores externos
- ✅ **Privacidade** - Código não sai da sua máquina

## ⚠️ Desvantagens

- ❌ Precisa configurar ambiente Android localmente
- ❌ Precisa gerar e gerenciar keystore manualmente
- ❌ Mais complexo para iniciantes
- ❌ Precisa de mais espaço em disco

---

## 🔧 Pré-requisitos

### 1. Instalar Android Studio
```bash
# macOS (via Homebrew)
brew install --cask android-studio

# Ou baixe manualmente:
# https://developer.android.com/studio
```

### 2. Configurar Android SDK
Após instalar o Android Studio:
1. Abra o Android Studio
2. Vá em **Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Instale:
   - ✅ Android SDK Platform 35 (Android 15)
   - ✅ Android SDK Build-Tools 35.0.0
   - ✅ Android SDK Command-line Tools
   - ✅ Android SDK Platform-Tools

### 3. Configurar Variáveis de Ambiente

Adicione ao seu `~/.zshrc` ou `~/.bash_profile`:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/35.0.0

# Java (necessário para Gradle)
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
```

Depois, recarregue:
```bash
source ~/.zshrc
```

### 4. Verificar Instalação
```bash
# Verificar Android SDK
echo $ANDROID_HOME

# Verificar Java
java -version

# Verificar Gradle (será instalado automaticamente)
cd android && ./gradlew --version
```

---

## 🔑 Passo 1: Gerar Keystore (Chave de Assinatura)

O AAB precisa ser assinado com uma keystore. **GUARDE ESSA CHAVE COM SEGURANÇA!**

### Gerar a Keystore

```bash
# Navegue até a pasta android/app
cd android/app

# Gere a keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore meucorre-release.keystore \
  -alias meucorre-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Você será solicitado a fornecer:**
- **Senha da keystore** (escolha uma senha forte e ANOTE!)
- **Senha da chave** (pode ser a mesma da keystore)
- Nome, organização, cidade, estado, país (pode preencher ou deixar em branco)

**⚠️ IMPORTANTE:**
- Guarde a keystore em local seguro (backup!)
- Guarde as senhas em local seguro
- **Se perder a keystore, não poderá atualizar o app na loja!**

### Mover a Keystore para Local Seguro

```bash
# Mova para a pasta android/app (já está lá)
# Ou mova para um local mais seguro fora do projeto
mv meucorre-release.keystore ~/Documents/keystores/

# Adicione ao .gitignore para não commitar
echo "*.keystore" >> ../../.gitignore
```

---

## 🔧 Passo 2: Configurar Gradle para Usar a Keystore

### 2.1 Criar arquivo gradle.properties (local)

Crie o arquivo `android/gradle.properties` (se não existir) e adicione:

```properties
# Keystore para release
MEUCORRE_UPLOAD_STORE_FILE=meucorre-release.keystore
MEUCORRE_UPLOAD_KEY_ALIAS=meucorre-key-alias
MEUCORRE_UPLOAD_STORE_PASSWORD=SUA_SENHA_AQUI
MEUCORRE_UPLOAD_KEY_PASSWORD=SUA_SENHA_AQUI
```

**⚠️ IMPORTANTE:** Adicione `gradle.properties` ao `.gitignore`:
```bash
echo "android/gradle.properties" >> .gitignore
```

### 2.2 Atualizar build.gradle

Edite `android/app/build.gradle` e adicione a configuração de assinatura:

```gradle
android {
    // ... configurações existentes ...

    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('MEUCORRE_UPLOAD_STORE_FILE')) {
                storeFile file(MEUCORRE_UPLOAD_STORE_FILE)
                storePassword MEUCORRE_UPLOAD_STORE_PASSWORD
                keyAlias MEUCORRE_UPLOAD_KEY_ALIAS
                keyPassword MEUCORRE_UPLOAD_KEY_PASSWORD
            }
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableMinifyInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
            shrinkResources true
            crunchPngs true
        }
    }
}
```

---

## 🚀 Passo 3: Gerar o AAB

### Opção 1: Usando npx expo (Recomendado para Expo)

```bash
# Na raiz do projeto
npx expo run:android --variant release
```

### Opção 2: Usando Gradle Diretamente

```bash
# Navegue até a pasta android
cd android

# Limpar builds anteriores
./gradlew clean

# Gerar o AAB
./gradlew bundleRelease

# Ou gerar APK (se preferir testar antes)
./gradlew assembleRelease
```

### Opção 3: Criar Script Personalizado

Adicione ao `package.json`:

```json
{
  "scripts": {
    "build:android:local": "cd android && ./gradlew clean && ./gradlew bundleRelease",
    "build:apk:local": "cd android && ./gradlew clean && ./gradlew assembleRelease"
  }
}
```

Depois execute:
```bash
npm run build:android:local
```

---

## 📦 Passo 4: Localizar o AAB Gerado

Após o build, o AAB estará em:

```
android/app/build/outputs/bundle/release/app-release.aab
```

O APK (se gerou) estará em:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Copiar para Local Conveniente

```bash
# Copiar AAB para a raiz do projeto
cp android/app/build/outputs/bundle/release/app-release.aab ./meucorre-v1.0.0.aab

# Ou para Downloads
cp android/app/build/outputs/bundle/release/app-release.aab ~/Downloads/meucorre-v1.0.0.aab
```

---

## ✅ Passo 5: Verificar o AAB

### Verificar Assinatura

```bash
# Verificar se o AAB está assinado corretamente
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

Deve mostrar: **"jar verified."**

### Verificar Package Name

```bash
# Extrair e verificar
unzip -q android/app/build/outputs/bundle/release/app-release.aab -d aab-temp
cat aab-temp/base/manifest/AndroidManifest.xml | grep package
rm -rf aab-temp
```

Deve mostrar: `package="com.amjsolucoes.meucorre"`

---

## 📤 Passo 6: Upload no Google Play Console

1. Acesse: https://play.google.com/console
2. Selecione seu app
3. Vá em **Release → Production**
4. Clique em **Create new release**
5. Faça upload do arquivo `app-release.aab`
6. Preencha as release notes
7. Clique em **Review release** → **Start rollout to Production**

---

## 🔄 Atualizações Futuras

Para cada nova versão:

### 1. Atualizar Versão

Edite `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2  // Incrementar sempre
    versionName "1.0.1"  // Atualizar conforme necessário
}
```

E `app.json`:
```json
{
  "version": "1.0.1"
}
```

### 2. Gerar Novo AAB

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

### 3. Upload na Google Play

Mesmo processo do Passo 6.

---

## 🆚 Comparação: Local vs EAS Build

| Aspecto | Build Local | EAS Build |
|---------|-------------|-----------|
| **Custo** | Gratuito | Gratuito (limitado) ou pago |
| **Velocidade** | Rápido (sua máquina) | Depende da fila |
| **Configuração** | Complexa (primeira vez) | Simples |
| **Controle** | Total | Limitado |
| **Keystore** | Você gerencia | EAS pode gerenciar |
| **CI/CD** | Precisa configurar | Integrado |
| **Ambiente** | Precisa instalar tudo | Pronto para usar |

---

## 🐛 Troubleshooting

### Erro: "SDK location not found"

```bash
# Crie o arquivo android/local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### Erro: "JAVA_HOME not set"

```bash
# Adicione ao ~/.zshrc
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home
source ~/.zshrc
```

### Erro: "Keystore not found"

Verifique se:
1. A keystore está em `android/app/meucorre-release.keystore`
2. O caminho no `gradle.properties` está correto
3. As senhas estão corretas

### Erro: "Build failed"

```bash
# Limpar completamente
cd android
./gradlew clean
rm -rf .gradle
rm -rf app/build

# Tentar novamente
./gradlew bundleRelease --stacktrace
```

### AAB muito grande

```bash
# Habilitar ProGuard e shrinkResources
# Já está configurado no build.gradle
# O AAB deve ficar entre 20-50 MB
```

---

## 📝 Checklist de Build Local

Antes de gerar o AAB:

- [ ] Android Studio instalado
- [ ] Android SDK configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Keystore gerada e guardada com segurança
- [ ] gradle.properties configurado (e no .gitignore)
- [ ] build.gradle configurado com signingConfig
- [ ] Versão atualizada (versionCode e versionName)
- [ ] App testado em modo release

---

## 🔐 Segurança da Keystore

### Backup da Keystore

```bash
# Fazer backup em múltiplos locais
cp android/app/meucorre-release.keystore ~/Dropbox/keystores/
cp android/app/meucorre-release.keystore ~/Google\ Drive/keystores/

# Ou usar um gerenciador de senhas para guardar
```

### Informações a Guardar

Anote em local seguro:
- ✅ Caminho da keystore
- ✅ Senha da keystore
- ✅ Alias da chave
- ✅ Senha da chave
- ✅ Data de criação
- ✅ Validade (10000 dias = ~27 anos)

**⚠️ Se perder essas informações, não poderá atualizar o app!**

---

## 🎯 Recomendação

Para este projeto (Expo + React Native):

### Para Desenvolvimento/Testes
✅ **Use build local** - Mais rápido para testar

### Para Produção (Primeira Vez)
✅ **Use EAS Build** - Mais simples e seguro

### Para Produção (Após Dominar)
✅ **Use build local** - Mais controle e gratuito

### Para CI/CD Automatizado
✅ **Use EAS Build** ou configure GitHub Actions

---

## 📚 Recursos Adicionais

- **Documentação Oficial:** https://reactnative.dev/docs/signed-apk-android
- **Expo Build Local:** https://docs.expo.dev/build-reference/local-builds/
- **Android Keystore:** https://developer.android.com/studio/publish/app-signing

---

**Pronto! Agora você pode gerar AABs localmente sem depender do EAS Build! 🚀**
