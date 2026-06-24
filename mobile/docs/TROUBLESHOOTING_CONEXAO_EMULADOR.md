# 🔧 Troubleshooting: Erro de Conexão no Emulador Android

## 🐛 Problema
```
java.net.ConnectException: Failed to connect to /192.168.1.82
```

Este erro ocorre quando o emulador Android não consegue se conectar ao servidor de desenvolvimento do Expo rodando na sua máquina.

---

## ✅ Soluções (em ordem de prioridade)

### 1️⃣ Reiniciar o servidor Expo com tunnel
O método mais confiável para emuladores Android:

```bash
# Parar o servidor atual (Ctrl+C)
# Iniciar com tunnel
npx expo start --tunnel
```

**Por que funciona?**: O modo tunnel usa o serviço ngrok para criar um túnel público, contornando problemas de rede local.

**Desvantagem**: Pode ser um pouco mais lento que a conexão direta.

---

### 2️⃣ Usar o IP correto da máquina
Seu IP local atual: **192.168.1.82**

```bash
# Iniciar o Expo especificando o IP
npx expo start --host 192.168.1.82
```

Se o IP mudar (comum em redes Wi-Fi), descubra o novo IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

---

### 3️⃣ Limpar cache do Expo e Metro
Cache corrompido pode causar problemas de conexão:

```bash
# Limpar cache do Expo
npx expo start --clear

# Ou limpar tudo
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

---

### 4️⃣ Verificar configurações do emulador Android

#### Opção A: Usar Android Studio AVD
1. Abrir Android Studio
2. Tools → Device Manager
3. Criar/usar um emulador com:
   - API Level 34 (Android 14) ou superior
   - Google Play Store habilitado
   - Pelo menos 4GB de RAM

#### Opção B: Verificar se o emulador está rodando
```bash
# Listar emuladores disponíveis
emulator -list-avds

# Iniciar um emulador específico
emulator -avd Pixel_8_API_34 &

# Verificar dispositivos conectados
adb devices
```

---

### 5️⃣ Configurar proxy reverso no ADB (para conexão LAN)
Se estiver usando conexão LAN (não tunnel):

```bash
# Configurar proxy reverso para a porta 8081 (Metro bundler)
adb reverse tcp:8081 tcp:8081

# Verificar se funcionou
adb reverse --list
```

---

### 6️⃣ Verificar firewall do macOS
O firewall pode estar bloqueando a conexão:

1. System Settings → Network → Firewall
2. Se estiver ativado, adicionar exceção para:
   - Node.js
   - Expo CLI
   - Terminal

Ou desativar temporariamente para testar.

---

### 7️⃣ Usar Expo Go (alternativa rápida)
Se nada funcionar, use o app Expo Go:

1. Instalar Expo Go no emulador:
   ```bash
   # Baixar APK do Expo Go
   # https://expo.dev/go
   
   # Instalar no emulador
   adb install expo-go.apk
   ```

2. Escanear QR code do terminal com o Expo Go

**Limitação**: Expo Go não suporta módulos nativos customizados.

---

## 🎯 Solução Recomendada para Este Projeto

Para o **MeuCorre App**, recomendo:

### Desenvolvimento diário:
```bash
npx expo start --tunnel
```

### Build de desenvolvimento local:
```bash
npm run build:local:android
```

Isso gera um APK que pode ser instalado diretamente:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔍 Diagnóstico Adicional

### Verificar se o Metro bundler está rodando:
```bash
curl http://192.168.1.82:8081/status
```

Deve retornar: `{"packager":"running"}`

### Verificar conectividade do emulador:
```bash
# Entrar no shell do emulador
adb shell

# Dentro do shell, testar conexão
ping 192.168.1.82
curl http://192.168.1.82:8081/status
```

### Logs do emulador:
```bash
# Ver logs em tempo real
adb logcat | grep -i "expo\|react"
```

---

## 📱 Testando em Dispositivo Físico

Se o emulador continuar com problemas, teste em um dispositivo físico:

1. Ativar "Depuração USB" no Android
2. Conectar via USB
3. Verificar conexão: `adb devices`
4. Rodar: `npx expo start --tunnel`

---

## 🆘 Última Opção: Resetar Ambiente

Se NADA funcionar:

```bash
# 1. Desinstalar Expo CLI global (se tiver)
npm uninstall -g expo-cli

# 2. Limpar cache do npm
npm cache clean --force

# 3. Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# 4. Limpar cache do Expo
rm -rf ~/.expo
rm -rf .expo

# 5. Reiniciar o computador

# 6. Iniciar com tunnel
npx expo start --tunnel
```

---

## 📚 Referências
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
- [Android Emulator Networking](https://developer.android.com/studio/run/emulator-networking)
- [ADB Reverse Proxy](https://developer.android.com/tools/adb#forwardports)
