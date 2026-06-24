# 🔧 Solução: Erro "Invalid Refresh Token: Refresh Token Not Found"

## 🐛 Problema

Ao iniciar o app no emulador, aparecia o erro:
```
[AuthApiError: Invalid Refresh Token: Refresh Token Not Found]
```

Este erro acontecia porque:
1. O app tentava restaurar uma sessão antiga com um **refresh token inválido ou expirado**
2. O Supabase tentava fazer refresh automático múltiplas vezes
3. O código não tratava adequadamente o erro antes de tentar limpar o storage

## ✅ Solução Implementada

### 1. Melhorias no `hooks/use-auth.ts`

**Antes:**
- Erro não era capturado adequadamente
- Limpeza do storage acontecia tarde demais

**Depois:**
- Adicionado `try/catch` robusto na inicialização
- Logs de erro para debug
- Tratamento separado para erro vs. sessão inexistente
- Limpeza do storage acontece ANTES de qualquer tentativa de refresh

### 2. Configuração do cliente Supabase (`lib/supabase.ts`)

Adicionado `storageKey` explícito para evitar conflitos:
```typescript
auth: {
  storage: LargeStorageAdapter,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
  flowType: 'pkce',
  storageKey: 'supabase.auth.token', // ← NOVO
}
```

### 3. Script de limpeza de cache

Criado `scripts/limpar-cache.sh` para facilitar a limpeza completa do cache.

## 🚀 Como Resolver Agora

### Opção 1: Limpar dados do app no emulador (RECOMENDADO)

**Android:**
1. Abra o emulador
2. Vá em **Configurações > Apps > Meu Corre**
3. Toque em **Limpar dados** e **Limpar cache**
4. Reinicie o app

**iOS:**
1. Pressione e segure o ícone do app no simulador
2. Toque em **Remover App**
3. Reinstale o app com `npx expo run:ios`

### Opção 2: Usar o script de limpeza

```bash
./scripts/limpar-cache.sh
```

Depois, reinicie o servidor Expo:
```bash
npx expo start --clear
```

### Opção 3: Limpar manualmente via código

Se preferir limpar via código, adicione temporariamente no `app/_layout.tsx`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

useEffect(() => {
  // TEMPORÁRIO - remover depois de testar
  AsyncStorage.clear().then(() => {
    console.log('Storage limpo!');
  });
}, []);
```

## 🔍 Como Prevenir no Futuro

1. **Sempre trate erros de autenticação com try/catch**
2. **Limpe o storage quando detectar tokens inválidos**
3. **Use logs para debug em desenvolvimento**
4. **Teste logout/login frequentemente durante o desenvolvimento**

## 📚 Referências

- [Supabase Auth Errors](https://supabase.com/docs/guides/auth/debugging)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
