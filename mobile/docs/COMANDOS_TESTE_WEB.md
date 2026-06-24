# 🚀 Comandos para Testar o App na Web

## ✅ Solução Aplicada

Adicionamos o campo `"browser"` no `package.json` que mapeia automaticamente a biblioteca nativa `react-native-google-mobile-ads` para o mock quando rodar na web.

## 📋 Passo a Passo

### 1️⃣ Limpar Cache (OBRIGATÓRIO na primeira vez)

```bash
npx expo start --clear
```

**Por quê?** O Expo/Metro mantém cache dos módulos. Sem limpar, ele vai continuar tentando usar a versão nativa.

### 2️⃣ Abrir no Navegador

Após o servidor iniciar, pressione:
- **`w`** - Abre no navegador automaticamente
- Ou acesse manualmente: `http://localhost:8081`

### 3️⃣ Verificar se Funcionou

✅ **Sucesso:** App abre no navegador sem erros  
❌ **Falhou:** Ainda mostra erro de "codegenNativeComponent"

## 🔄 Se o Erro Persistir

### Opção 1: Limpar Cache Completo

```bash
# Parar o servidor (Ctrl+C)

# Limpar tudo
rm -rf node_modules/.cache
rm -rf .expo
rm -rf web-build

# Reiniciar com cache limpo
npx expo start --clear
```

### Opção 2: Reinstalar Dependências

```bash
# Parar o servidor (Ctrl+C)

# Remover node_modules
rm -rf node_modules

# Reinstalar
npm install

# Iniciar com cache limpo
npx expo start --clear
```

### Opção 3: Usar Webpack Config (Fallback)

Se o campo "browser" não funcionar, o `webpack.config.js` já está configurado como backup.

## 🎯 Comandos Úteis

### Desenvolvimento Normal

```bash
# Web (com cache limpo)
npx expo start --clear
# Pressione 'w'

# Android
npm run android

# iOS
npm run ios
```

### Limpar Cache Específico

```bash
# Apenas cache do Metro
npx expo start --clear

# Apenas cache do Expo
rm -rf .expo

# Apenas cache do Webpack
rm -rf web-build
```

### Verificar Configuração

```bash
# Ver conteúdo do package.json (campo browser)
cat package.json | grep -A 3 '"browser"'

# Ver se o mock existe
ls -la react-native-google-mobile-ads.web.js
```

## 📊 Resultado Esperado

### ✅ Na Web (Navegador)
- App abre sem erros
- Navegação funciona
- Formulários funcionam
- **Anúncios NÃO aparecem** (esperado, não há suporte web)

### ✅ No Android/iOS
- App funciona normalmente
- **Anúncios APARECEM** e funcionam
- Todas as funcionalidades nativas funcionam

## 🐛 Troubleshooting Rápido

### Erro: "Module not found: react-native-google-mobile-ads"

```bash
# Verificar se o mock existe na raiz
ls -la react-native-google-mobile-ads.web.js

# Se não existir, algo apagou o arquivo
# Restaure do backup em mocks/
cp mocks/react-native-google-mobile-ads.web.js .
```

### Erro: "Cannot find module './react-native-google-mobile-ads.web.js'"

```bash
# O caminho no package.json está errado
# Verifique se o arquivo está na raiz do projeto
pwd
ls -la react-native-google-mobile-ads.web.js
```

### Erro Persiste Mesmo Após Limpar Cache

```bash
# Última tentativa: reset completo
rm -rf node_modules
rm -rf .expo
rm -rf web-build
rm -rf node_modules/.cache
npm install
npx expo start --clear
```

## 📝 Checklist de Verificação

Antes de testar, confirme:

- [ ] Arquivo `react-native-google-mobile-ads.web.js` existe na raiz
- [ ] Campo `"browser"` está no `package.json`
- [ ] Servidor foi iniciado com `--clear`
- [ ] Navegador foi aberto APÓS o servidor iniciar

## 🎯 Próximos Passos

Após confirmar que funciona na web:

1. ✅ Testar todas as telas no navegador
2. ✅ Testar no Android/iOS para confirmar que anúncios funcionam
3. ✅ Gerar novo AAB com o package name correto
4. ✅ Enviar para o Google Play Console

---

**Comando Principal:**
```bash
npx expo start --clear
```

**Depois pressione:** `w`

**Resultado Esperado:** App abre no navegador sem erros! 🎉
