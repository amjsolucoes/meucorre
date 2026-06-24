# 📸 Guia Visual: Configurar Google AdMob

## 🎯 Passo a Passo com Imagens

### Passo 1: Acessar o AdMob

1. Abra: https://apps.admob.com/
2. Faça login com sua conta Google
3. Clique em **"Começar"**

```
┌─────────────────────────────────────┐
│  🔵 Google AdMob                    │
│                                     │
│  Monetize seu app com anúncios      │
│                                     │
│  [  Começar  ]                      │
└─────────────────────────────────────┘
```

---

### Passo 2: Aceitar Termos

1. Leia os termos de serviço
2. Marque a caixa de aceite
3. Clique em **"Continuar"**

---

### Passo 3: Adicionar App (iOS)

1. No menu lateral, clique em **"Apps"**
2. Clique em **"Adicionar app"**
3. Selecione **"iOS"**
4. Preencha:
   - Nome do app: **"Meu Corre"**
   - Está na App Store? **"Não"** (se ainda não publicou)
5. Clique em **"Adicionar"**

```
┌─────────────────────────────────────┐
│  Adicionar app                      │
│                                     │
│  Plataforma: ⚪ iOS  ⚪ Android     │
│                                     │
│  Nome do app:                       │
│  [Meu Corre                    ]    │
│                                     │
│  Está na App Store?                 │
│  ⚪ Sim  ⚫ Não                     │
│                                     │
│  [  Adicionar  ]                    │
└─────────────────────────────────────┘
```

**IMPORTANTE**: Copie o **App ID** que aparece!
```
App ID: ca-app-pub-1234567890123456~0987654321
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        COPIE ESTE ID COMPLETO!
```

---

### Passo 4: Adicionar App (Android)

Repita o processo acima, mas:
- Selecione **"Android"**
- Nome do pacote: **`com.amjsolucoes.meucorreapp`**

```
┌─────────────────────────────────────┐
│  Adicionar app                      │
│                                     │
│  Plataforma: ⚪ iOS  ⚫ Android     │
│                                     │
│  Nome do app:                       │
│  [Meu Corre                    ]    │
│                                     │
│  Nome do pacote:                    │
│  [com.amjsolucoes.meucorreapp  ]    │
│                                     │
│  Está no Google Play?               │
│  ⚪ Sim  ⚫ Não                     │
│                                     │
│  [  Adicionar  ]                    │
└─────────────────────────────────────┘
```

**IMPORTANTE**: Copie o **App ID** do Android também!

---

### Passo 5: Criar Unidade de Anúncio (Banner)

1. Clique no app que você criou (iOS ou Android)
2. Clique em **"Unidades de anúncio"**
3. Clique em **"Adicionar unidade de anúncio"**
4. Selecione **"Banner"**

```
┌─────────────────────────────────────┐
│  Selecione o formato do anúncio     │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ Banner  │  │Interst. │          │
│  │ 320x50  │  │Tela     │          │
│  │         │  │cheia    │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────┐                        │
│  │Recomp.  │                        │
│  │Vídeo    │                        │
│  │         │                        │
│  └─────────┘                        │
└─────────────────────────────────────┘
```

5. Preencha:
   - Nome: **"Banner Principal"**
6. Clique em **"Criar unidade de anúncio"**

**IMPORTANTE**: Copie o **ID da unidade**!
```
ID da unidade: ca-app-pub-1234567890123456/1234567890
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
               COPIE ESTE ID!
```

---

### Passo 6: Criar Unidade de Anúncio (Intersticial)

Repita o processo acima, mas:
- Selecione **"Intersticial"**
- Nome: **"Intersticial Ações"**

**IMPORTANTE**: Copie o **ID da unidade**!

---

### Passo 7: Criar Unidade de Anúncio (Recompensado) - Opcional

Repita o processo acima, mas:
- Selecione **"Recompensado"**
- Nome: **"Recompensa Premium"**

**IMPORTANTE**: Copie o **ID da unidade**!

---

### Passo 8: Organizar os IDs

Você deve ter copiado **6 IDs no total** (ou 4 se não criou recompensado):

#### iOS:
```
App ID:         ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
Banner ID:      ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
Intersticial:   ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
Recompensado:   ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
```

#### Android:
```
App ID:         ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY
Banner ID:      ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
Intersticial:   ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
Recompensado:   ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY
```

---

### Passo 9: Substituir no Código

#### Arquivo 1: `constants/admob.ts`

```typescript
const PRODUCTION_IDS = {
  ios: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Banner ID do iOS
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Intersticial ID do iOS
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Recompensado ID do iOS
  },
  android: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Banner ID do Android
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Intersticial ID do Android
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // ← Cole o Recompensado ID do Android
  },
};
```

#### Arquivo 2: `app.json`

Procure por `react-native-google-mobile-ads` e substitua:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY", // ← Cole o App ID do Android
    "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY" // ← Cole o App ID do iOS
  }
]
```

---

### Passo 10: Rebuild e Testar

```bash
# 1. Limpar cache
npx expo start -c

# 2. Rebuild (OBRIGATÓRIO após mudar app.json)
npx expo prebuild --clean

# 3. Testar
npx expo run:ios
npx expo run:android
```

---

## 🎯 Checklist Visual

```
┌─────────────────────────────────────┐
│  ✅ Checklist de Configuração       │
├─────────────────────────────────────┤
│  [ ] Conta criada no AdMob          │
│  [ ] App iOS adicionado             │
│  [ ] App Android adicionado         │
│  [ ] Banner iOS criado              │
│  [ ] Banner Android criado          │
│  [ ] Intersticial iOS criado        │
│  [ ] Intersticial Android criado    │
│  [ ] IDs copiados                   │
│  [ ] constants/admob.ts atualizado  │
│  [ ] app.json atualizado            │
│  [ ] Rebuild executado              │
│  [ ] Testado em dispositivo real    │
└─────────────────────────────────────┘
```

---

## 📊 Como Verificar se Está Funcionando

### No Console do AdMob:

1. Acesse: https://apps.admob.com/
2. Clique em **"Apps"**
3. Clique no seu app
4. Você verá:

```
┌─────────────────────────────────────┐
│  Meu Corre (iOS)                    │
├─────────────────────────────────────┤
│  Status: ⚠️ Aguardando aprovação    │
│                                     │
│  Unidades de anúncio:               │
│  • Banner Principal      ✅ Ativa   │
│  • Intersticial Ações    ✅ Ativa   │
│                                     │
│  Impressões hoje: 0                 │
│  Receita estimada: R$ 0,00          │
└─────────────────────────────────────┘
```

**Após 24-48h:**
```
┌─────────────────────────────────────┐
│  Meu Corre (iOS)                    │
├─────────────────────────────────────┤
│  Status: ✅ Pronto                  │
│                                     │
│  Unidades de anúncio:               │
│  • Banner Principal      ✅ Ativa   │
│  • Intersticial Ações    ✅ Ativa   │
│                                     │
│  Impressões hoje: 45                │
│  Receita estimada: R$ 2,35          │
└─────────────────────────────────────┘
```

---

## 🎨 Como os Anúncios Aparecem no App

### Banner (320x50):
```
┌─────────────────────────────────────┐
│  Seu Conteúdo                       │
│  ...                                │
│  ...                                │
├─────────────────────────────────────┤
│  [    Anúncio do Google    ]        │ ← Banner
├─────────────────────────────────────┤
│  Mais Conteúdo                      │
└─────────────────────────────────────┘
```

### Intersticial (Tela Cheia):
```
┌─────────────────────────────────────┐
│                                  [X]│
│                                     │
│                                     │
│        ANÚNCIO                      │
│        TELA CHEIA                   │
│                                     │
│                                     │
│  [  Visitar Site  ]                 │
└─────────────────────────────────────┘
```

---

## 🆘 Problemas Comuns

### ❌ "App ID inválido"
- Verifique se copiou o ID completo
- Formato correto: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`
- Note o `~` (til) no App ID vs `/` (barra) no Unit ID

### ❌ "Anúncio não carrega"
- Aguarde 24-48h após criar as unidades
- Verifique se fez rebuild após mudar app.json
- Teste com IDs de teste primeiro

### ❌ "Status: Aguardando aprovação"
- Normal para apps novos
- Pode levar 24-48h
- Continue desenvolvendo normalmente

---

## 💡 Dicas Visuais

### Onde Encontrar os IDs no Console:

```
Apps → Meu Corre → Unidades de anúncio
                    ↓
        ┌───────────────────────┐
        │ Banner Principal      │
        │ ID: ca-app-pub-...    │ ← Clique para copiar
        └───────────────────────┘
```

### Como Saber se o ID Está Correto:

```
✅ CORRETO:
App ID:    ca-app-pub-1234567890123456~0987654321
           └─────────────────────────┘ └─────────┘
           16 dígitos                  10 dígitos

Unit ID:   ca-app-pub-1234567890123456/0987654321
           └─────────────────────────┘ └─────────┘
           16 dígitos                  10 dígitos

❌ ERRADO:
ca-app-pub-3940256099942544  (faltando ~YYYYYYYYYY)
ca-app-pub-123/456           (muito curto)
```

---

**Pronto! Agora você tem um guia visual completo! 🎉**
