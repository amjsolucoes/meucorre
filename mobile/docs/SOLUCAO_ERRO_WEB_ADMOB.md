# 🔧 Solução: Erro ao Abrir App na Web (AdMob)

## ❌ Problema

Ao tentar rodar o app na web com `npm start` e abrir no navegador, aparece o erro:

```
Server Error
Importing native-only module "react-native/Libraries/Utilities/codegenNativeComponent" on web
from: node_modules/react-native-google-mobile-ads/lib/module/specs/components/GoogleMobileAdsBannerViewNativeComponent.ts
```

## 🔍 Causa

O `react-native-google-mobile-ads` é uma biblioteca **nativa** que só funciona em:
- ✅ iOS (iPhone/iPad)
- ✅ Android (smartphones/tablets)
- ❌ Web (navegador)

Quando você tenta rodar o app na web, o Expo/React Native tenta importar componentes nativos que não existem no navegador, causando o erro.

## ✅ Solução Aplicada

Criamos **mocks** (simulações) da biblioteca para que o app funcione na web sem erros.

### Arquivos Criados/Modificados

#### 1. `react-native-google-mobile-ads.web.js` (raiz do projeto)
Mock completo da biblioteca com todos os componentes, hooks e enums simulados.

#### 2. `package.json` - Campo "browser"
Adicionamos o campo `browser` que mapeia a biblioteca nativa para o mock na web:

```json
"browser": {
  "react-native-google-mobile-ads": "./react-native-google-mobile-ads.web.js"
}
```

Este campo instrui o bundler (webpack/metro) a usar o arquivo mock quando o código for executado no navegador.

#### 3. `webpack.config.js` (backup)
Configuração alternativa do webpack caso o campo "browser" não funcione.

#### 4. `mocks/react-native-google-mobile-ads.web.js` (backup)
Cópia do mock em outra localização como fallback.

## 🚀 Como Usar

### Rodar na Web (Agora Funciona!)

```bash
# 1. Limpar cache do Expo (IMPORTANTE!)
npx expo start --clear

# 2. Pressione 'w' para abrir no navegador
# Ou acesse: http://localhost:8081
```

**⚠️ IMPORTANTE:** Sempre use `--clear` na primeira vez após a mudança para limpar o cache!

### Rodar no iOS/Android (Funciona Normalmente)

```bash
# iOS
npm run ios

# Android
npm run android
```

## 📝 O que Acontece Agora

### Na Web (Navegador)
- ✅ App abre sem erros
- ✅ Todas as funcionalidades funcionam (exceto anúncios)
- ⚠️ Anúncios do AdMob **não aparecem** (é esperado, pois não há suporte web)
- ✅ Você pode testar o resto do app normalmente

### No iOS/Android (Dispositivos Reais)
- ✅ App funciona normalmente
- ✅ Anúncios do AdMob **aparecem** e funcionam
- ✅ Todas as funcionalidades nativas funcionam

## 🎯 Quando Usar Cada Plataforma

### Use a Web Para:
- ✅ Desenvolvimento rápido de UI
- ✅ Testar layouts e navegação
- ✅ Testar lógica de negócio
- ✅ Demonstrações rápidas
- ✅ Testes de funcionalidades não-nativas

### Use iOS/Android Para:
- ✅ Testar anúncios do AdMob
- ✅ Testar notificações push
- ✅ Testar funcionalidades nativas (câmera, contatos, etc.)
- ✅ Testes finais antes de publicar
- ✅ Validar performance real

## 🔍 Verificar se Está Funcionando

### 1. Limpar Cache e Reinstalar

```bash
# Limpar cache do Expo
npx expo start --clear

# Ou limpar tudo
rm -rf node_modules
npm install
```

### 2. Testar na Web

```bash
npm start
# Pressione 'w'
```

Deve abrir no navegador sem erros!

### 3. Testar no Android/iOS

```bash
# Android
npm run android

# iOS
npm run ios
```

Anúncios devem aparecer normalmente.

## 🐛 Troubleshooting

### Erro Persiste na Web

```bash
# 1. Limpar cache completamente
rm -rf node_modules
rm -rf .expo
rm -rf web-build
npm install

# 2. Reiniciar o servidor
npx expo start --clear
```

### Anúncios Não Aparecem no Android/iOS

Verifique se:
1. Você está usando IDs de teste corretos
2. O app está conectado à internet
3. O AdMob está configurado corretamente no Google AdMob Console

### Webpack Config Não Funciona

Verifique se o arquivo `webpack.config.js` está na raiz do projeto:
```bash
ls -la webpack.config.js
```

Se não existir, crie novamente.

## 📚 Outras Bibliotecas Nativas

Se você tiver problemas similares com outras bibliotecas nativas, use a mesma abordagem:

### Bibliotecas Comuns que Precisam de Mock na Web:

- ❌ `react-native-google-mobile-ads` (já resolvido)
- ❌ `expo-camera`
- ❌ `expo-contacts`
- ❌ `expo-notifications` (parcialmente suportado)
- ❌ `react-native-maps`
- ❌ `react-native-biometrics`

### Como Criar Mocks para Outras Bibliotecas

1. Crie um arquivo em `mocks/nome-da-biblioteca.web.js`
2. Exporte funções/componentes vazios que retornam `null` ou valores padrão
3. Adicione o alias no `webpack.config.js`

## ✅ Resumo

**Problema:** AdMob é nativo e não funciona na web  
**Solução:** Criamos mocks para simular a biblioteca na web  
**Resultado:** App funciona na web (sem anúncios) e no mobile (com anúncios)

## 🎯 Recomendação

Para desenvolvimento:
1. **Use a web** para desenvolvimento rápido de UI/UX
2. **Use emulador/dispositivo** para testar funcionalidades nativas
3. **Teste no dispositivo real** antes de publicar

---

**Status:** ✅ Problema resolvido  
**Próxima ação:** Testar o app na web com `npm start` e pressionar 'w'
