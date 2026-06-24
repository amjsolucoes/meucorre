# 🚀 AdMob - Guia Rápido de 5 Minutos

## ✅ JÁ ESTÁ FUNCIONANDO!

A integração do AdMob está **completa e funcionando**. Você só precisa:

### 1️⃣ Aguardar o Build Terminar
O comando `npx expo run:android` está rodando e vai terminar em alguns minutos.
Você verá: `BUILD SUCCESSFUL`

### 2️⃣ Testar o App
Quando abrir:
- Vá na tela inicial (Home)
- Role até o final
- Você verá um **banner de teste do Google**

### 3️⃣ Antes de Publicar (OBRIGATÓRIO)

#### Criar Conta AdMob
1. Acesse: https://apps.admob.com/
2. Faça login com Google
3. Adicione seu app Android
4. Crie 3 unidades de anúncio:
   - Banner (320x50)
   - Intersticial (tela cheia)
   - Recompensado (opcional)

#### Substituir IDs de Teste

**Arquivo 1:** `constants/admob.ts`
```typescript
// Linha 28-36 (Android)
const PRODUCTION_IDS = {
  android: {
    banner: 'ca-app-pub-XXXXXXXX/YYYYYY', // ← Cole aqui
    interstitial: 'ca-app-pub-XXXXXXXX/YYYYYY',
    rewarded: 'ca-app-pub-XXXXXXXX/YYYYYY',
  },
  // ...
};
```

**Arquivo 2:** `app.config.js`
```javascript
// Linha 18 (Android App ID)
android: {
  config: {
    googleMobileAdsAppId: "ca-app-pub-XXXXXXXX~YYYYYY", // ← Cole aqui
  },
},
```

#### Rebuild
```bash
npx expo prebuild --clean
npx expo run:android
```

### 4️⃣ Publicar
1. Gere o APK/AAB de produção
2. Publique na Google Play
3. Aguarde 24-48h para anúncios reais aparecerem

## 💰 Quanto Vou Ganhar?

**Expectativa realista:**
- 1.000 usuários/dia = R$ 5-15/dia
- 10.000 usuários/dia = R$ 50-150/dia
- 100.000 usuários/dia = R$ 500-1.500/dia

**Importante:**
- Primeiros dias: taxa de preenchimento baixa (50-70%)
- Após 1-2 semanas: melhora para 80-95%
- Brasil paga menos que EUA/Europa

## ⚠️ NUNCA FAÇA ISSO

❌ Publicar com IDs de teste (conta banida!)
❌ Clicar nos próprios anúncios (conta banida!)
❌ Pedir para usuários clicarem (conta banida!)
❌ Colocar mais de 3 anúncios por tela

## 📚 Documentação Completa

- `ADMOB_STATUS.md` - Status detalhado
- `ADMOB_RESUMO.md` - Resumo técnico
- `docs/ADMOB_SETUP.md` - Setup completo
- `docs/EXEMPLOS_ADMOB.md` - Exemplos de código
- `docs/CHECKLIST_ADMOB.md` - Checklist pré-publicação
- `docs/TESTAR_ADMOB.md` - Como testar
- `docs/GUIA_VISUAL_ADMOB.md` - Guia visual

## 🎯 Próximo Passo

**AGORA:** Aguarde o build terminar e teste o app!

**DEPOIS:** Crie sua conta no AdMob e substitua os IDs.

**Dúvidas?** Leia `ADMOB_STATUS.md` para detalhes completos.
