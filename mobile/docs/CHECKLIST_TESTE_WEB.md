# ✅ Checklist: Testar App na Web

## 📋 Pré-requisitos

Antes de começar, verifique:

- [ ] Node.js instalado (versão 18+)
- [ ] npm ou yarn instalado
- [ ] Projeto `meu-corre-app` aberto no terminal
- [ ] Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🔍 Verificação dos Arquivos

Execute estes comandos para confirmar que tudo está no lugar:

### 1. Verificar Mock na Raiz

```bash
ls -la react-native-google-mobile-ads.web.js
```

**Resultado esperado:** Arquivo existe e tem ~4KB

### 2. Verificar Campo "browser" no package.json

```bash
cat package.json | grep -A 3 '"browser"'
```

**Resultado esperado:**
```json
"browser": {
  "react-native-google-mobile-ads": "./react-native-google-mobile-ads.web.js"
}
```

### 3. Verificar Backup do Mock

```bash
ls -la mocks/react-native-google-mobile-ads.web.js
```

**Resultado esperado:** Arquivo existe

---

## 🚀 Passo a Passo para Testar

### Passo 1: Limpar Cache

```bash
npx expo start --clear
```

**O que esperar:**
- Terminal mostra "Starting Metro Bundler"
- Aparece QR code
- Mostra opções: `› Press w │ open web`

**Tempo estimado:** 30-60 segundos

### Passo 2: Abrir no Navegador

**Opção A:** Pressione `w` no terminal

**Opção B:** Acesse manualmente `http://localhost:8081`

**O que esperar:**
- Navegador abre automaticamente
- Mostra "Loading..." por alguns segundos
- App carrega completamente

**Tempo estimado:** 10-30 segundos

### Passo 3: Verificar se Funcionou

#### ✅ Sucesso - Você deve ver:

- [ ] Tela de login/cadastro aparece
- [ ] Sem mensagens de erro no navegador
- [ ] Console do navegador sem erros vermelhos (F12 para abrir)
- [ ] App responde a cliques e navegação

#### ❌ Falha - Se você ver:

- [ ] Erro: "Importing native-only module"
- [ ] Tela branca
- [ ] Erro no console do navegador

**Se falhou, vá para a seção "Troubleshooting" abaixo.**

---

## 🧪 Testes Funcionais na Web

Após o app abrir com sucesso, teste:

### Navegação

- [ ] Consegue navegar entre telas
- [ ] Botões respondem ao clique
- [ ] Tab bar funciona (se aplicável)

### Formulários

- [ ] Consegue digitar em campos de texto
- [ ] Máscaras de input funcionam (CPF, telefone, etc)
- [ ] Validações aparecem corretamente
- [ ] Botões de submit funcionam

### Dashboard

- [ ] Gráficos aparecem
- [ ] Dados são exibidos
- [ ] Cards de resumo funcionam

### Anúncios (Esperado: NÃO aparecer)

- [ ] Espaços de anúncios estão vazios (esperado)
- [ ] Sem erros relacionados a anúncios
- [ ] App funciona normalmente sem anúncios

---

## 🐛 Troubleshooting

### Problema 1: Erro "Importing native-only module" Persiste

#### Solução A: Limpar Cache Completo

```bash
# Parar o servidor (Ctrl+C no terminal)

# Limpar tudo
rm -rf node_modules/.cache
rm -rf .expo
rm -rf web-build

# Reiniciar
npx expo start --clear
```

#### Solução B: Reinstalar Dependências

```bash
# Parar o servidor (Ctrl+C)

# Remover e reinstalar
rm -rf node_modules
npm install

# Reiniciar
npx expo start --clear
```

#### Solução C: Verificar Arquivos

```bash
# Mock existe?
ls -la react-native-google-mobile-ads.web.js

# Se não existir, copiar do backup
cp mocks/react-native-google-mobile-ads.web.js .

# Reiniciar
npx expo start --clear
```

### Problema 2: Tela Branca no Navegador

#### Verificar Console do Navegador

1. Abra o navegador
2. Pressione `F12` (ou `Cmd+Option+I` no Mac)
3. Vá na aba "Console"
4. Procure por erros em vermelho

**Erros comuns:**

- **"Module not found"** → Arquivo mock não existe, copie do backup
- **"Cannot resolve"** → Limpe o cache e reinstale
- **"Syntax error"** → Arquivo mock pode estar corrompido

### Problema 3: App Muito Lento na Web

**Normal:** A primeira vez sempre é mais lenta (compilação inicial)

**Se continuar lento:**

```bash
# Limpar cache
npx expo start --clear

# Ou usar modo de produção
npx expo start --clear --no-dev
```

### Problema 4: Porta 8081 Já em Uso

```bash
# Matar processo na porta 8081
lsof -ti:8081 | xargs kill -9

# Ou usar outra porta
npx expo start --clear --port 8082
```

---

## 📊 Resultados Esperados

### ✅ Web (Navegador)

| Funcionalidade | Status Esperado |
|----------------|-----------------|
| App abre | ✅ Funciona |
| Navegação | ✅ Funciona |
| Formulários | ✅ Funciona |
| Dashboard | ✅ Funciona |
| Gráficos | ✅ Funciona |
| Anúncios | ❌ Não aparecem (esperado) |

### ✅ Android/iOS (Dispositivos)

| Funcionalidade | Status Esperado |
|----------------|-----------------|
| App abre | ✅ Funciona |
| Navegação | ✅ Funciona |
| Formulários | ✅ Funciona |
| Dashboard | ✅ Funciona |
| Gráficos | ✅ Funciona |
| Anúncios | ✅ Aparecem e funcionam |

---

## 🎯 Checklist Final

Antes de considerar concluído:

- [ ] App abre na web sem erros
- [ ] Testei navegação entre telas
- [ ] Testei formulários
- [ ] Testei dashboard
- [ ] Console do navegador sem erros críticos
- [ ] Documentei qualquer problema encontrado

---

## 📝 Registro de Teste

**Data do teste:** ___/___/______

**Navegador usado:** ________________

**Resultado:**
- [ ] ✅ Sucesso - App funciona na web
- [ ] ❌ Falha - Erro persiste

**Observações:**
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## 🎉 Próximos Passos

Após confirmar que funciona na web:

1. **Testar no Android/iOS**
   ```bash
   npm run android
   # ou
   npm run ios
   ```

2. **Gerar novo AAB** (com package name correto)
   ```bash
   eas build --platform android --profile production
   ```

3. **Enviar para Google Play Console**
   - Upload do AAB
   - Preencher informações da loja
   - Enviar para revisão

---

## 📞 Ajuda Adicional

Se precisar de mais ajuda, consulte:

- `docs/SOLUCAO_ERRO_WEB_ADMOB.md` - Explicação completa
- `docs/COMANDOS_TESTE_WEB.md` - Comandos detalhados
- `docs/RESUMO_CORRECAO_WEB.md` - Resumo executivo

---

**Comando principal para começar:**

```bash
npx expo start --clear
```

**Depois pressione:** `w`

**Boa sorte! 🚀**
