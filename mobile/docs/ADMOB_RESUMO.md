# 🎯 AdMob Instalado - Resumo Rápido

## ✅ O que foi feito

1. **Instalado**: `react-native-google-mobile-ads`
2. **Configurado**: `app.json` com plugin do AdMob
3. **Criado**:
   - `constants/admob.ts` - IDs dos anúncios
   - `components/AdBanner.tsx` - Componente de banner
   - `hooks/useInterstitialAd.ts` - Anúncios de tela cheia
   - `hooks/useAdFrequency.ts` - Controle de frequência
4. **Integrado**: Banner na tela principal (`app/(tabs)/index.tsx`)

---

## 🚀 Próximos Passos (IMPORTANTE!)

### 1. Criar conta no AdMob
👉 https://apps.admob.com/

### 2. Adicionar seu app
- iOS: Nome "Meu Corre"
- Android: Pacote `com.amjsolucoes.meucorreapp`

### 3. Criar unidades de anúncio
Para cada plataforma:
- Banner (320x50)
- Intersticial (tela cheia)
- Recompensado (opcional)

### 4. Substituir IDs no código

**Arquivo**: `constants/admob.ts`

```typescript
const PRODUCTION_IDS = {
  ios: {
    banner: 'SEU-ID-AQUI',
    interstitial: 'SEU-ID-AQUI',
    rewarded: 'SEU-ID-AQUI',
  },
  android: {
    banner: 'SEU-ID-AQUI',
    interstitial: 'SEU-ID-AQUI',
    rewarded: 'SEU-ID-AQUI',
  },
};
```

**Arquivo**: `app.json`

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "SEU-APP-ID-ANDROID",
    "iosAppId": "SEU-APP-ID-IOS"
  }
]
```

### 5. Rebuild do app

```bash
npx expo start -c
```

---

## 📚 Documentação Completa

- **Setup completo**: `docs/ADMOB_SETUP.md`
- **Exemplos práticos**: `docs/EXEMPLOS_ADMOB.md`
- **Checklist de publicação**: `docs/CHECKLIST_ADMOB.md`

---

## ⚠️ IMPORTANTE

- **NUNCA** publique com IDs de teste
- **NUNCA** clique nos seus próprios anúncios
- **SEMPRE** teste com IDs de teste durante desenvolvimento
- **AGUARDE** 24-48h após publicar para anúncios aparecerem

---

## 💰 Estimativa de Ganhos

| Usuários/dia | Ganho mensal |
|--------------|--------------|
| 10           | R$ 5-15      |
| 50           | R$ 30-80     |
| 100          | R$ 80-200    |
| 500          | R$ 500-1.500 |
| 1.000        | R$ 1.200-3k  |

---

## 🆘 Problemas?

1. Leia `docs/ADMOB_SETUP.md` (seção Troubleshooting)
2. Verifique o console: https://apps.admob.com/
3. Aguarde 24-48h após publicar

---

**Boa sorte! 🚀💰**
