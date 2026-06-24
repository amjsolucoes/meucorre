# 📱 Guia Completo: Google AdMob no Meu Corre App

## ✅ O que foi instalado

1. **Dependências**
   - `react-native-google-mobile-ads` - SDK oficial do Google AdMob
   - Configuração automática no `app.json`

2. **Arquivos criados**
   - `constants/admob.ts` - IDs dos anúncios (teste e produção)
   - `components/AdBanner.tsx` - Componente de banner reutilizável
   - `hooks/useInterstitialAd.ts` - Hook para anúncios de tela cheia

3. **Integração**
   - Banner adicionado na tela principal (`app/(tabs)/index.tsx`)

---

## 🚀 Como começar a ganhar dinheiro

### Passo 1: Criar conta no Google AdMob

1. Acesse: https://apps.admob.com/
2. Faça login com sua conta Google
3. Clique em **"Começar"** e aceite os termos
4. Preencha as informações da sua empresa/CPF

### Passo 2: Adicionar seu app no AdMob

#### Para iOS:
1. No AdMob, clique em **"Apps"** → **"Adicionar app"**
2. Selecione **"iOS"**
3. Nome do app: **"Meu Corre"**
4. Marque **"Sim, está na App Store"** (se já publicou) ou **"Não"** (se ainda não)
5. Copie o **App ID** gerado (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)

#### Para Android:
1. Repita o processo acima, mas selecione **"Android"**
2. Nome do pacote: `com.amjsolucoes.meucorreapp`
3. Copie o **App ID** gerado

### Passo 3: Criar unidades de anúncio

Para cada plataforma (iOS e Android), crie 3 tipos de anúncios:

#### 1. Banner (320x50)
- Clique no app → **"Unidades de anúncio"** → **"Adicionar unidade de anúncio"**
- Selecione **"Banner"**
- Nome: "Banner Principal"
- Copie o **ID da unidade** (formato: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`)

#### 2. Intersticial (tela cheia)
- Selecione **"Intersticial"**
- Nome: "Intersticial Ações"
- Copie o **ID da unidade**

#### 3. Recompensado (opcional, para futuras features)
- Selecione **"Recompensado"**
- Nome: "Recompensa Premium"
- Copie o **ID da unidade**

### Passo 4: Substituir IDs de teste pelos IDs reais

Abra o arquivo `constants/admob.ts` e substitua os IDs de produção:

```typescript
const PRODUCTION_IDS = {
  ios: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
  },
  android: {
    banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
    interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
    rewarded: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Cole seu ID aqui
  },
};
```

### Passo 5: Atualizar app.json com seus App IDs

Abra `app.json` e substitua os IDs de teste:

```json
[
  "react-native-google-mobile-ads",
  {
    "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
    "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
  }
]
```

### Passo 6: Rebuild do app

```bash
# Limpar cache
npx expo start -c

# Rebuild para iOS
npx expo run:ios

# Rebuild para Android
npx expo run:android
```

---

## 💰 Estratégias de monetização

### 1. Banners (já implementado)
- **Onde**: Tela principal, no final da lista
- **Frequência**: Sempre visível
- **Ganho estimado**: R$ 0,10 - R$ 0,50 por dia (depende do uso)

### 2. Intersticiais (implementado, mas não ativado)
- **Onde usar**: Após ações importantes
  - Depois de salvar um ganho
  - Depois de marcar um agendamento como concluído
  - Ao abrir relatórios
- **Frequência**: Máximo 1 vez a cada 3-5 minutos
- **Ganho estimado**: R$ 0,50 - R$ 2,00 por dia

#### Como ativar intersticiais:

Exemplo na tela de adicionar ganho (`app/ganho/index.tsx`):

```typescript
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

export default function AddIncomeScreen() {
  const { showAd } = useInterstitialAd();
  
  const handleSave = async () => {
    // Salvar o ganho
    await saveIncome(data);
    
    // Mostrar anúncio após salvar
    await showAd();
    
    // Voltar para a tela anterior
    router.back();
  };
  
  // resto do código...
}
```

### 3. Onde adicionar mais banners

#### Tela de Relatórios
```typescript
// app/(tabs)/relatorios.tsx
import { AdBanner } from '@/components/AdBanner';

// Adicionar no final da tela
<AdBanner size="MEDIUM_RECTANGLE" />
```

#### Tela de Clientes
```typescript
// app/(tabs)/clientes.tsx
import { AdBanner } from '@/components/AdBanner';

// Adicionar no final da lista
<AdBanner size="BANNER" />
```

---

## ⚠️ IMPORTANTE: Regras do Google AdMob

### ❌ NUNCA FAÇA ISSO (pode banir sua conta):

1. **Não clique nos seus próprios anúncios**
   - Nem para testar
   - Use os IDs de teste durante desenvolvimento

2. **Não peça para outras pessoas clicarem**
   - "Clica no anúncio pra me ajudar" = BAN
   - Cliques devem ser orgânicos

3. **Não coloque muitos anúncios**
   - Máximo 3 banners por tela
   - Máximo 1 intersticial a cada 3-5 minutos

4. **Não force o usuário a ver anúncios**
   - Nunca bloquear funcionalidades
   - Anúncios devem ser naturais

5. **Não publique com IDs de teste**
   - Sempre use seus IDs reais em produção

### ✅ Boas práticas:

1. **Posicionamento natural**
   - Final de listas
   - Entre seções de conteúdo
   - Após ações concluídas

2. **Experiência do usuário em primeiro lugar**
   - App deve funcionar bem mesmo com anúncios
   - Não atrapalhar navegação

3. **Teste antes de publicar**
   - Use IDs de teste durante desenvolvimento
   - Teste em dispositivos reais

---

## 📊 Quanto vou ganhar?

### Estimativas realistas (Brasil, 2026):

| Usuários ativos/dia | Ganho mensal estimado |
|---------------------|----------------------|
| 10 usuários         | R$ 5 - R$ 15         |
| 50 usuários         | R$ 30 - R$ 80        |
| 100 usuários        | R$ 80 - R$ 200       |
| 500 usuários        | R$ 500 - R$ 1.500    |
| 1.000 usuários      | R$ 1.200 - R$ 3.000  |

**Fatores que influenciam:**
- Tempo de uso do app
- Localização dos usuários
- Tipo de anúncio (banner vs intersticial)
- Taxa de cliques (CTR)
- Nicho do app

---

## 🔧 Troubleshooting

### Anúncios não aparecem

1. **Verifique os IDs**
   - IDs de teste funcionam?
   - IDs de produção estão corretos?

2. **Rebuild do app**
   ```bash
   npx expo start -c
   ```

3. **Verifique o console**
   - Procure por erros do AdMob
   - `console.log` no componente AdBanner

4. **Aguarde aprovação**
   - Novos apps podem levar 24-48h para aprovar

### Anúncios aparecem em branco

- Normal nos primeiros dias
- AdMob está aprendendo sobre seu público
- Aguarde 2-3 dias de uso real

### "Ad failed to load"

- Sem internet
- IDs incorretos
- App não aprovado ainda no AdMob

---

## 📱 Próximos passos

1. ✅ Criar conta no AdMob
2. ✅ Adicionar app (iOS e Android)
3. ✅ Criar unidades de anúncio
4. ✅ Substituir IDs no código
5. ✅ Rebuild do app
6. ✅ Testar em dispositivo real
7. ✅ Publicar nas lojas
8. 💰 Começar a ganhar!

---

## 🆘 Suporte

- **Documentação oficial**: https://developers.google.com/admob
- **Console AdMob**: https://apps.admob.com/
- **Suporte Google**: https://support.google.com/admob

---

**Boa sorte com a monetização! 🚀💰**
