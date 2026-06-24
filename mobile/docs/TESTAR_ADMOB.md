# 🧪 Como Testar o AdMob

## 🎯 Testes em Desenvolvimento

### 1. IDs de Teste (Já Configurado)

O app já está configurado para usar IDs de teste automaticamente em modo de desenvolvimento (`__DEV__ = true`).

**IDs de teste do Google:**
- Sempre carregam anúncios
- Não geram receita
- Seguros para clicar
- Não violam políticas do AdMob

### 2. Iniciar o App

```bash
# Limpar cache
npx expo start -c

# iOS
npx expo run:ios

# Android
npx expo run:android
```

### 3. O que Verificar

#### Banner na Tela Principal:
1. Abra o app
2. Role até o final da tela principal
3. Você deve ver um banner de teste do Google
4. Pode ter texto como "Test Ad" ou "Anúncio de Teste"

#### Estados do Banner:
- **Carregando**: Mostra "Carregando anúncio..."
- **Carregado**: Mostra o banner do Google
- **Erro**: Mostra "Anúncio indisponível"

---

## 🔍 Testes Avançados

### 1. Testar Intersticial (Tela Cheia)

Adicione temporariamente em uma tela para testar:

```typescript
// app/(tabs)/index.tsx (temporário, apenas para teste)
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

export default function HomeScreen() {
  const { showAd, loaded } = useInterstitialAd();
  
  // Adicionar botão de teste
  return (
    <View>
      {/* Seu conteúdo normal */}
      
      {/* BOTÃO DE TESTE - REMOVER DEPOIS */}
      <TouchableOpacity 
        onPress={showAd}
        className="bg-red-500 p-4 m-4 rounded"
      >
        <Text className="text-white font-bold text-center">
          [TESTE] Mostrar Anúncio Intersticial
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

**O que deve acontecer:**
1. Clique no botão
2. Anúncio de tela cheia aparece
3. Você pode fechar clicando no X
4. Volta para o app normalmente

### 2. Testar Controle de Frequência

```typescript
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useAdFrequency } from '@/hooks/useAdFrequency';

export default function TestScreen() {
  const { showAd, loaded } = useInterstitialAd();
  const { shouldShowAd, getTimeUntilNextAd } = useAdFrequency(1); // 1 minuto para teste
  
  const handleTest = async () => {
    if (loaded && shouldShowAd()) {
      await showAd();
      console.log('Anúncio mostrado!');
    } else {
      const timeLeft = getTimeUntilNextAd();
      console.log(`Aguarde ${timeLeft} minuto(s) para o próximo anúncio`);
    }
  };
  
  return (
    <TouchableOpacity onPress={handleTest}>
      <Text>Testar Frequência</Text>
    </TouchableOpacity>
  );
}
```

### 3. Testar Diferentes Tamanhos de Banner

```typescript
import { AdBanner } from '@/components/AdBanner';

export default function TestScreen() {
  return (
    <ScrollView>
      <Text>Banner Pequeno (320x50):</Text>
      <AdBanner size="BANNER" />
      
      <Text>Banner Grande (320x100):</Text>
      <AdBanner size="LARGE_BANNER" />
      
      <Text>Retângulo Médio (300x250):</Text>
      <AdBanner size="MEDIUM_RECTANGLE" />
    </ScrollView>
  );
}
```

---

## 📱 Testes em Dispositivo Real

### Por que testar em dispositivo real?

- Simuladores/emuladores podem ter comportamento diferente
- Anúncios podem não carregar em simuladores
- Performance real só é visível em dispositivos

### Como testar:

#### iOS (iPhone/iPad):
```bash
# Conectar iPhone via cabo
npx expo run:ios --device
```

#### Android:
```bash
# Conectar Android via cabo ou WiFi
npx expo run:android --device
```

---

## 🐛 Problemas Comuns e Soluções

### 1. "Anúncio indisponível" aparece sempre

**Causas:**
- Sem conexão com internet
- IDs incorretos
- Problema temporário do AdMob

**Solução:**
```bash
# Verificar se está usando IDs de teste
# Abrir constants/admob.ts e confirmar USE_TEST_IDS = __DEV__

# Limpar cache e rebuild
npx expo start -c
```

### 2. Banner não aparece

**Verificar:**
```typescript
// Adicionar logs temporários em AdBanner.tsx
onAdLoaded={() => {
  console.log('✅ Banner carregado com sucesso!');
  setAdLoaded(true);
}}
onAdFailedToLoad={(error) => {
  console.log('❌ Erro ao carregar banner:', error);
  setAdError(true);
}}
```

### 3. App trava ao mostrar anúncio

**Verificar:**
- Rebuild do app após instalar AdMob
- Permissões de internet no AndroidManifest.xml
- IDs corretos no app.json

**Solução:**
```bash
# Rebuild completo
npx expo prebuild --clean
npx expo run:ios
npx expo run:android
```

### 4. Intersticial não carrega

**Verificar:**
```typescript
// Adicionar logs no hook
const { loaded, showAd } = useInterstitialAd();

console.log('Intersticial carregado?', loaded);

// Ao tentar mostrar
if (!loaded) {
  console.log('❌ Intersticial ainda não carregou');
} else {
  console.log('✅ Mostrando intersticial...');
  await showAd();
}
```

---

## ✅ Checklist de Testes

### Antes de Publicar:

- [ ] Banner aparece na tela principal
- [ ] Banner não quebra o layout
- [ ] Banner carrega em menos de 3 segundos
- [ ] Intersticial funciona (se implementado)
- [ ] Intersticial não aparece com muita frequência
- [ ] App não trava ao mostrar anúncios
- [ ] Anúncios não cobrem conteúdo importante
- [ ] Testado em iOS (dispositivo real)
- [ ] Testado em Android (dispositivo real)
- [ ] Testado com internet lenta
- [ ] Testado sem internet (deve mostrar "indisponível")

### Após Publicar (com IDs reais):

- [ ] Aguardar 24-48h
- [ ] Verificar console AdMob
- [ ] Confirmar que anúncios aparecem
- [ ] Verificar taxa de preenchimento
- [ ] Monitorar por 7 dias

---

## 📊 Logs Úteis para Debug

```typescript
// Adicionar em AdBanner.tsx
console.log('[AdMob] Iniciando carregamento do banner...');
console.log('[AdMob] ID usado:', ADMOB_IDS.banner);
console.log('[AdMob] Modo:', __DEV__ ? 'TESTE' : 'PRODUÇÃO');

onAdLoaded={() => {
  console.log('[AdMob] ✅ Banner carregado!');
}}

onAdFailedToLoad={(error) => {
  console.log('[AdMob] ❌ Erro:', error);
}}
```

---

## 🎯 Teste Final Antes de Publicar

1. **Mudar para IDs de produção**
   ```typescript
   // constants/admob.ts
   const USE_TEST_IDS = false; // Mudar para false
   ```

2. **Rebuild**
   ```bash
   npx expo prebuild --clean
   npx expo run:ios --configuration Release
   npx expo run:android --variant release
   ```

3. **Testar em dispositivo real**
   - Anúncios devem aparecer (pode demorar 24-48h)
   - Não clicar nos seus próprios anúncios!

4. **Voltar para IDs de teste**
   ```typescript
   const USE_TEST_IDS = __DEV__; // Voltar para __DEV__
   ```

---

## 🆘 Suporte

Se nada funcionar:

1. Verificar documentação oficial: https://developers.google.com/admob
2. Verificar console AdMob: https://apps.admob.com/
3. Verificar logs do app
4. Aguardar 24-48h após publicar

**Boa sorte com os testes! 🚀**
