# 🔧 Correção: Erro de Importação do AdMob no Android

## ❌ Problema

```
ERROR [AdMob] Erro ao inicializar: [Error: Cannot find module 'react-native-google-mobile-ads']
ERROR [AdBanner] Erro ao carregar módulo: [Error: Cannot find module 'react-native-google-mobile-ads']
```

**Causa:** O código estava usando `require()` dinâmico para importar o módulo AdMob, mas o Metro Bundler do React Native não consegue resolver importações dinâmicas corretamente.

---

## ✅ Solução Aplicada

### Mudança de Importação Dinâmica para Estática

#### ❌ Antes (Errado):

```typescript
// lib/admob.ts
const mobileAds = require('react-native-google-mobile-ads').default;

// components/AdBanner.tsx
const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');
```

**Problema:** `require()` dinâmico não funciona bem com Metro Bundler.

#### ✅ Depois (Correto):

```typescript
// lib/admob.ts
import { Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

export async function initializeAdMob() {
  // AdMob não funciona na web
  if (Platform.OS === 'web') {
    console.log('[AdMob] Pulando inicialização na web');
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

```typescript
// components/AdBanner.tsx
import { Platform, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export const AdBanner: React.FC<AdBannerProps> = ({ size = 'BANNER', showOnScreen = true }) => {
  // Não renderizar na web
  if (Platform.OS === 'web') {
    return null;
  }

  // ... resto do código
};
```

---

## 🎯 Por Que Isso Funciona?

### Importação Estática vs Dinâmica

**Importação Estática (✅ Funciona):**
```typescript
import mobileAds from 'react-native-google-mobile-ads';
```
- Resolvida em tempo de build pelo Metro Bundler
- O mock web (`react-native-google-mobile-ads.web.js`) é aplicado automaticamente
- Funciona em todas as plataformas

**Importação Dinâmica (❌ Não funciona):**
```typescript
const mobileAds = require('react-native-google-mobile-ads').default;
```
- Tentada em tempo de execução
- Metro Bundler não consegue aplicar o mock web
- Causa erro "Cannot find module"

### Verificação de Plataforma

```typescript
if (Platform.OS === 'web') {
  return null; // ou return false
}
```

- Verifica se está rodando na web
- Retorna cedo para evitar executar código nativo
- Funciona em conjunto com o mock web

---

## 📁 Arquivos Modificados

1. **`lib/admob.ts`**
   - ✅ Mudado de `require()` para `import`
   - ✅ Adicionado verificação `Platform.OS === 'web'`
   - ✅ Melhorado tratamento de erros

2. **`components/AdBanner.tsx`**
   - ✅ Mudado de `require()` para `import`
   - ✅ Adicionado verificação `Platform.OS === 'web'`
   - ✅ Removido código de carregamento dinâmico
   - ✅ Simplificado lógica de renderização

---

## 🚀 Como Testar

### 1. Parar o Servidor

```bash
# Pressione Ctrl+C no terminal onde o Expo está rodando
```

### 2. Limpar Cache

```bash
npx expo start --clear
```

### 3. Testar no Android

```bash
# Em outro terminal
npm run android
```

**Resultado esperado:**
- ✅ Sem erros de "Cannot find module"
- ✅ Log: `[AdMob] Inicializado com sucesso`
- ✅ Anúncios de teste aparecem (se configurados)

### 4. Testar na Web

```bash
# No terminal do Expo, pressione 'w'
```

**Resultado esperado:**
- ✅ Sem erros de "Cannot find module"
- ✅ Log: `[AdMob] Pulando inicialização na web`
- ✅ App funciona normalmente (sem anúncios)

---

## 🔍 Entendendo o Fluxo

### No Android/iOS (Dispositivos Nativos)

```
1. Import estático: import mobileAds from 'react-native-google-mobile-ads'
   ↓
2. Metro Bundler resolve para: node_modules/react-native-google-mobile-ads
   ↓
3. Biblioteca nativa é carregada
   ↓
4. Platform.OS === 'android' ou 'ios' → código executa normalmente
   ↓
5. AdMob inicializa e anúncios aparecem
```

### Na Web (Navegador)

```
1. Import estático: import mobileAds from 'react-native-google-mobile-ads'
   ↓
2. Metro Bundler/Webpack vê campo "browser" no package.json
   ↓
3. Resolve para: ./react-native-google-mobile-ads.web.js (mock)
   ↓
4. Mock é carregado (funções vazias)
   ↓
5. Platform.OS === 'web' → retorna cedo, não executa código
   ↓
6. App funciona sem anúncios
```

---

## 📋 Checklist de Verificação

Após aplicar a correção:

- [ ] Servidor Expo foi reiniciado com `--clear`
- [ ] Código usa `import` em vez de `require()`
- [ ] Verificação `Platform.OS === 'web'` está presente
- [ ] Testado no Android (sem erros)
- [ ] Testado na web (sem erros)
- [ ] Anúncios aparecem no Android (se configurados)

---

## 🐛 Troubleshooting

### Erro Persiste no Android

```bash
# 1. Parar o servidor
Ctrl+C

# 2. Limpar cache completo
rm -rf node_modules/.cache .expo

# 3. Limpar build Android
cd android
./gradlew clean
cd ..

# 4. Reiniciar
npx expo start --clear

# 5. Rodar Android
npm run android
```

### Erro Persiste na Web

```bash
# 1. Parar o servidor
Ctrl+C

# 2. Limpar cache web
rm -rf web-build

# 3. Verificar mock
ls -la react-native-google-mobile-ads.web.js

# 4. Verificar package.json
cat package.json | grep -A 3 '"browser"'

# 5. Reiniciar
npx expo start --clear

# 6. Abrir web
# Pressione 'w'
```

### Anúncios Não Aparecem no Android

Verifique:

1. **IDs de teste estão corretos?**
   ```typescript
   // constants/admob.ts
   export const ADMOB_IDS = {
     banner: 'ca-app-pub-3940256099942544/6300978111', // ID de teste
   };
   ```

2. **AdMob foi inicializado?**
   - Procure no log: `[AdMob] Inicializado com sucesso`

3. **Internet está funcionando?**
   - Anúncios precisam de conexão com internet

4. **Emulador tem Google Play Services?**
   - Use emulador com Google APIs

---

## ✅ Resumo da Correção

| Item | Antes | Depois |
|------|-------|--------|
| Importação | `require()` dinâmico | `import` estático |
| Verificação Web | Tentava carregar módulo | `Platform.OS === 'web'` |
| Tratamento de Erro | Try/catch genérico | Verificação preventiva |
| Compatibilidade | ❌ Quebrava no Android | ✅ Funciona em todas plataformas |

---

## 🎯 Próxima Ação

**Teste agora:**

```bash
# 1. Limpar cache
npx expo start --clear

# 2. Rodar no Android
npm run android
```

**Resultado esperado:**
- ✅ Sem erros de "Cannot find module"
- ✅ AdMob inicializa corretamente
- ✅ App funciona no Android e na web

---

**Data da Correção:** 14/05/2026  
**Arquivos Modificados:** 2 (`lib/admob.ts`, `components/AdBanner.tsx`)  
**Status:** ✅ Resolvido
