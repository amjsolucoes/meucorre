# ⚡ Solução Rápida: Erro de Instalação no Android

## 🎯 Erro: INSTALL_FAILED_USER_RESTRICTED

### ✅ Solução Imediata (faça no celular AGORA):

1. **Abra as Configurações do celular**

2. **Vá em "Configurações Adicionais"** (ou "Additional Settings")

3. **Entre em "Opções do Desenvolvedor"** (ou "Developer Options")

4. **Procure e ATIVE estas opções:**
   - ✅ **"Instalar via USB"** (Install via USB)
   - ✅ **"Depuração USB"** (USB Debugging) - já deve estar ativo
   - ✅ **"Instalação USB (Configurações de Segurança)"**

5. **Desconecte e reconecte o cabo USB**

6. **Tente instalar novamente:**
   ```bash
   npx expo run:android
   ```

---

## 🔄 Se ainda não funcionar:

### Opção 1: Desinstalar manualmente
1. No celular, vá em **Configurações → Apps**
2. Procure por **"Meu Corre"** ou **"MeuCorre"**
3. Toque em **Desinstalar**
4. Tente instalar novamente

### Opção 2: Usar Expo Go (mais rápido para testar)
```bash
# 1. Instale o Expo Go no celular (Google Play)
# 2. Execute:
npx expo start

# 3. Escaneie o QR Code com o Expo Go
```

---

## 📱 Localização das Opções por Marca:

### Xiaomi/MIUI/Redmi:
```
Configurações 
  → Configurações Adicionais 
    → Opções do Desenvolvedor 
      → Instalar via USB ✅
```

### Samsung:
```
Configurações 
  → Opções do Desenvolvedor 
    → Depuração USB ✅
    → Verificar apps via USB ❌ (desative)
```

### Motorola:
```
Configurações 
  → Sistema 
    → Opções do Desenvolvedor 
      → Instalar via USB ✅
```

---

## 🆘 Última Alternativa:

Se nada funcionar, gere o APK e instale manualmente:

```bash
# 1. Gere o APK
cd android
./gradlew assembleDebug
cd ..

# 2. O APK estará em:
# android/app/build/outputs/apk/debug/app-debug.apk

# 3. Copie para o celular e instale manualmente
```

---

📖 **Guia completo:** `docs/SOLUCAO_INSTALL_FAILED_USER_RESTRICTED.md`
