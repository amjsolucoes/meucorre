# 🔧 Solução: INSTALL_FAILED_USER_RESTRICTED

## 📋 Problema
Erro ao instalar o app no dispositivo Android:
```
INSTALL_FAILED_USER_RESTRICTED: Install canceled by user
```

## ✅ Soluções (tente na ordem)

### 1️⃣ Habilitar "Instalar via USB" no Celular

**Xiaomi/MIUI/Redmi:**
1. Abra **Configurações**
2. Vá em **Configurações Adicionais** ou **Additional Settings**
3. Entre em **Opções do Desenvolvedor** ou **Developer Options**
4. Ative:
   - ✅ **Instalar via USB** (Install via USB)
   - ✅ **Depuração USB** (USB Debugging)
   - ✅ **Instalação USB (Configurações de Segurança)** (USB Debugging - Security Settings)

**Samsung:**
1. Abra **Configurações**
2. Vá em **Opções do Desenvolvedor**
3. Ative:
   - ✅ **Depuração USB**
   - ✅ **Verificar apps via USB** (desative se estiver ativo)

**Motorola/Outros:**
1. Abra **Configurações**
2. Vá em **Sistema** → **Opções do Desenvolvedor**
3. Ative:
   - ✅ **Depuração USB**
   - ✅ **Instalar via USB**

### 2️⃣ Desinstalar Versão Anterior

Se já existe uma versão do app instalada:

```bash
# Via ADB
adb uninstall com.amjsolucoes.meucorreapp

# Ou manualmente no celular
# Configurações → Apps → Meu Corre → Desinstalar
```

### 3️⃣ Reconectar o Dispositivo

```bash
# 1. Desconecte o cabo USB
# 2. Mate o servidor ADB
adb kill-server

# 3. Reconecte o cabo USB
# 4. Inicie o servidor ADB
adb start-server

# 5. Verifique se o dispositivo aparece
adb devices

# 6. Tente instalar novamente
npx expo run:android
```

### 4️⃣ Autorizar no Celular

Quando conectar o cabo USB, deve aparecer um popup no celular:
- **"Permitir depuração USB?"**
- Marque: ✅ **"Sempre permitir deste computador"**
- Toque em: **"OK"** ou **"Permitir"**

### 5️⃣ Instalar Manualmente (Alternativa)

Se nada funcionar, instale manualmente:

```bash
# 1. Gere o APK
cd android
./gradlew assembleDebug
cd ..

# 2. O APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk

# 3. Transfira para o celular e instale manualmente
# Ou use:
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 6️⃣ Usar Expo Go (Desenvolvimento)

Para desenvolvimento rápido sem instalar:

```bash
# 1. Instale o Expo Go no celular
# Google Play: https://play.google.com/store/apps/details?id=host.exp.exponent

# 2. Inicie o servidor
npx expo start

# 3. Escaneie o QR Code com o Expo Go
```

## 🔍 Verificar Configurações

### Verificar se o dispositivo está conectado:
```bash
adb devices
```

Deve mostrar algo como:
```
List of devices attached
EQ45IFDYLZVWHE6D    device
```

Se mostrar `unauthorized`, autorize no celular.

### Verificar permissões do app:
```bash
adb shell pm list packages | grep meucorre
```

### Limpar dados do app (se já instalado):
```bash
adb shell pm clear com.amjsolucoes.meucorreapp
```

## ⚠️ Problemas Específicos por Marca

### Xiaomi/MIUI
- Precisa ativar **"Instalar via USB"** nas Opções do Desenvolvedor
- Pode precisar fazer login na conta Mi
- Alguns modelos têm restrição de 7 dias para instalar apps via USB

### Samsung
- Desative **"Verificar apps via USB"**
- Pode precisar desativar **Knox** temporariamente

### Huawei
- Pode precisar autorizar via **HiSuite**

### Motorola
- Geralmente funciona sem problemas extras

## 🚀 Após Resolver

Quando conseguir instalar:

```bash
# Instale normalmente
npx expo run:android

# Ou use o modo de desenvolvimento
npx expo start --android
```

## 📱 Dica: Usar Emulador

Se continuar com problemas no dispositivo físico, use um emulador:

```bash
# Abra o Android Studio
# Tools → Device Manager → Create Device
# Escolha um dispositivo (ex: Pixel 5)
# Baixe uma imagem do sistema (ex: Android 13)
# Inicie o emulador

# Depois execute:
npx expo run:android
```

## 🆘 Ainda não funciona?

1. **Reinicie o celular**
2. **Reinicie o computador**
3. **Troque o cabo USB** (alguns cabos só carregam, não transferem dados)
4. **Troque a porta USB** do computador
5. **Atualize os drivers USB** (Windows) ou **Android File Transfer** (Mac)

## 📞 Comandos Úteis

```bash
# Ver logs do dispositivo
adb logcat

# Ver apps instalados
adb shell pm list packages

# Desinstalar app
adb uninstall com.amjsolucoes.meucorreapp

# Reiniciar ADB
adb kill-server && adb start-server

# Ver informações do dispositivo
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release
```
