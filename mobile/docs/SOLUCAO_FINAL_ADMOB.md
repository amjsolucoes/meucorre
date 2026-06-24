# 🎯 Solução Final - Erro AdMob no Android

## 📋 Problema

Erro persistente ao tentar carregar o módulo `react-native-google-mobile-ads` no Android:

```
ERROR [AdMob] Erro ao inicializar: [Error: Cannot find module 'react-native-google-mobile-ads']
ERROR [AdBanner] Erro ao carregar módulo: [Error: Cannot find module 'react-native-google-mobile-ads']
```

## 🔍 Causa Raiz

O Metro Bundler não estava conseguindo resolver o módulo nativo mesmo após as correções anteriores. Isso acontece porque:

1. **Cache do Metro**: O Metro mantém cache de módulos resolvidos
2. **Importação estática vs dinâmica**: Importações estáticas podem falhar se o módulo não estiver linkado corretamente
3. **Plataforma web**: O módulo não funciona na web e precisa ser tratado condicionalmente

## ✅ Solução Implementada

### 1. Importação Condicional com Try-Catch

**Arquivo: `lib/admob.ts`**

```typescript
import { Platform } from 'react-native';

// Importação condicional para evitar erro na web
let mobileAds: any = null;

if (Platform.OS !== 'web') {
  try {
    mobileAds = require('react-native-google-mobile-ads').default;
  } catch (error) {
    console.warn('[AdMob] Módulo não disponível:', error);
  }
}

export async function initializeAdMob() {
  if (Platform.OS === 'web') {
    console.log('[AdMob] Pulando inicialização na web');
    return false;
  }

  if (!mobileAds) {
    console.warn('[AdMob] Módulo não carregado');
    return false;
  }

  try {
    await mobileAds().initialize();
    console.log('[AdMob] Inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('[AdMob] Erro ao inicializar:', error);
    return false;
  }
}
```

**Arquivo: `components/AdBanner.tsx`**

```typescript
import { Platform, View } from 'react-native';

// Importação condicional para evitar erro na web
let BannerAd: any = null;
let BannerAdSize: any = null;

if (Platform.OS !== 'web') {
  try {
    const admobModule = require('react-native-google-mobile-ads');
    BannerAd = admobModule.BannerAd;
    BannerAdSize = admobModule.BannerAdSize;
  } catch (error) {
    console.warn('[AdBanner] Módulo não disponível:', error);
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({ size, showOnScreen }) => {
  // Não renderizar na web
  if (Platform.OS === 'web') {
    return null;
  }

  // Se o módulo não foi carregado, não renderizar
  if (!BannerAd || !BannerAdSize) {
    return null;
  }

  // ... resto do código
};
```

### 2. Vantagens desta Abordagem

✅ **Graceful degradation**: Se o módulo não estiver disponível, o app não quebra
✅ **Compatibilidade web**: Funciona na web sem erros
✅ **Compatibilidade Android/iOS**: Funciona em plataformas nativas quando o módulo está linkado
✅ **Mensagens claras**: Logs informativos sobre o estado do módulo

## 🚀 Comandos para Aplicar a Correção

### 1. Parar o servidor Expo
```bash
# Pressione Ctrl+C no terminal onde o Expo está rodando
```

### 2. Limpar todo o cache
```bash
# Limpar cache do Metro Bundler
npx expo start --clear

# OU limpar cache do Watchman (se instalado)
watchman watch-del-all

# OU limpar cache do npm
npm cache clean --force
```

### 3. Limpar build do Android
```bash
cd android
./gradlew clean
cd ..
```

### 4. Reinstalar dependências
```bash
# Remover node_modules e reinstalar
rm -rf node_modules
npm install
```

### 5. Rebuild do projeto nativo
```bash
# Regenerar arquivos nativos
npx expo prebuild --clean --platform android
```

### 6. Rodar novamente
```bash
# Iniciar com cache limpo
npx expo start --clear

# Em outro terminal, rodar no Android
npx expo run:android
```

## 🔧 Comandos Rápidos (Copiar e Colar)

### Opção 1: Limpeza Completa (Recomendado)
```bash
# Parar o Expo (Ctrl+C), depois:
rm -rf node_modules
npm install
cd android && ./gradlew clean && cd ..
npx expo prebuild --clean --platform android
npx expo start --clear
```

### Opção 2: Limpeza Rápida
```bash
# Parar o Expo (Ctrl+C), depois:
npx expo start --clear
```

## 📱 Testando

Após aplicar a correção e limpar o cache:

1. **Abrir o app no Android**
2. **Verificar os logs**:
   - ✅ `[AdMob] Inicializado com sucesso` → Módulo carregado
   - ⚠️ `[AdMob] Módulo não carregado` → Módulo não disponível (mas app não quebra)
3. **Verificar se os banners aparecem** (se o módulo estiver linkado)

## 🐛 Troubleshooting

### Erro persiste após limpar cache

1. **Verificar se o módulo está instalado**:
```bash
npm list react-native-google-mobile-ads
```

2. **Reinstalar o módulo**:
```bash
npm uninstall react-native-google-mobile-ads
npm install react-native-google-mobile-ads@^16.3.3
```

3. **Verificar linking nativo**:
```bash
npx expo prebuild --clean --platform android
```

### App funciona mas banners não aparecem

Isso é esperado se:
- Você está usando IDs de teste do AdMob
- O módulo não está completamente linkado
- Não há conexão com internet

**Solução**: Verificar logs para mensagens `[AdBanner]` e `[AdMob]`

## ✅ Resultado Esperado

Após aplicar a correção:

1. ✅ **App não quebra** mesmo se o módulo não estiver disponível
2. ✅ **Funciona na web** sem erros
3. ✅ **Funciona no Android** quando o módulo está linkado
4. ✅ **Logs claros** sobre o estado do módulo

## 📚 Arquivos Modificados

- ✅ `lib/admob.ts` - Importação condicional com try-catch
- ✅ `components/AdBanner.tsx` - Importação condicional com try-catch
- ✅ `docs/SOLUCAO_FINAL_ADMOB.md` - Este documento

## 🎯 Próximos Passos

1. **Aplicar os comandos de limpeza** acima
2. **Testar no Android** para verificar se o erro sumiu
3. **Verificar logs** para confirmar que o módulo foi carregado
4. **Antes de publicar**: Substituir IDs de teste do AdMob pelos IDs reais

---

**Data**: 14/05/2026
**Versão do App**: 1.0.0
**Status**: ✅ Solução implementada - aguardando teste
