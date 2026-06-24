# ✅ Splash Screen e Ícone do App Atualizados

## 📱 Alterações Realizadas

### 1. Ícone do App
- **Antes:** `icon.png`
- **Agora:** `logo-app-meucorre.png`
- Este será o ícone que aparece na tela inicial do celular para abrir o app

### 2. Splash Screen (Tela de Abertura)
- **Fundo:** Branco (`#ffffff`) em ambos os modos (claro e escuro)
- **Animação:**
  - **Primeira logo:** `logo-app-meucorre.png` (fade out + scale down)
  - **Segunda logo:** `logo-amj-cinza.png` (fade in + scale up)
  - **Duração total:** 2.4 segundos

### 3. Arquivos Modificados
- ✅ `app.config.js` - Configuração principal do Expo
- ✅ `app.json` - Configuração alternativa do Expo
- ✅ `app/splash.tsx` - Componente de splash screen customizado

## 🚀 Como Aplicar as Mudanças

### Passo 1: Limpar o cache do Expo
```bash
npx expo start -c
```

### Passo 2: Rebuild dos assets nativos
Para que o ícone do app seja atualizado, você precisa fazer rebuild:

#### iOS (Simulador)
```bash
npx expo run:ios
```

#### Android (Emulador)
```bash
npx expo run:android
```

### Passo 3: Build para produção (quando for publicar)
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 📋 Checklist de Verificação

- [ ] Ícone do app aparece como `logo-app-meucorre.png` na tela inicial
- [ ] Splash screen tem fundo branco
- [ ] Primeira logo (`logo-app-meucorre.png`) aparece e desaparece suavemente
- [ ] Segunda logo (`logo-amj-cinza.png`) aparece após a primeira
- [ ] Transição está suave e profissional
- [ ] Funciona tanto no iOS quanto no Android
- [ ] Dark mode também usa fundo branco no splash

## 🎨 Detalhes da Animação

```
Tempo 0s → 0.8s:  logo-app-meucorre.png (fade out + scale down)
Tempo 0.6s → 1.4s: logo-amj-cinza.png (fade in + scale up)
Tempo 2.4s:        App carrega
```

## ⚠️ Observações Importantes

1. **Ícone do app só atualiza após rebuild nativo** - Não basta apenas `expo start`
2. **Splash screen customizado** - Usamos um componente React com animações (não apenas a config do Expo)
3. **Fundo sempre branco** - Mesmo no dark mode, o splash mantém fundo branco conforme solicitado
4. **Logo cinza no fundo branco** - A segunda logo é a versão cinza da AMJ, que contrasta bem com o fundo branco

## 🔧 Troubleshooting

### Ícone não atualiza
- Desinstale o app do simulador/emulador
- Rode `npx expo prebuild --clean`
- Rode novamente `npx expo run:ios` ou `npx expo run:android`

### Splash não aparece
- Verifique se as imagens existem em `assets/images/`
- Limpe o cache: `npx expo start -c`
- Reinicie o Metro bundler

### Imagens não carregam
- Confirme que os arquivos existem:
  - `assets/images/logo-app-meucorre.png`
  - `assets/logo-amj-cinza.png`
