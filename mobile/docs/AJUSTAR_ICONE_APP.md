# 🎨 Como Ajustar o Ícone do App

## 📋 Problema
O ícone do app "Meu Corre" está muito grudado nas bordas quando exibido no Android. Isso acontece porque o Android usa "Adaptive Icons" que podem cortar ou ampliar a imagem.

## ✅ Solução Rápida (Recomendada)

### Opção 1: Usar Script Automático

Se você tem ImageMagick instalado:

```bash
# 1. Instale ImageMagick (se ainda não tiver)
brew install imagemagick

# 2. Execute o script
./scripts/ajustar-icone-android.sh

# 3. Atualize o app.json para usar o novo ícone
# Mude de:
#   "foregroundImage": "./assets/images/logo-app-meucorre.png"
# Para:
#   "foregroundImage": "./assets/images/logo-app-meucorre-android.png"

# 4. Reconstrua o app
npx expo prebuild --clean
```

### Opção 2: Ajuste Manual (Sem ImageMagick)

1. **Abra a logo em um editor:**
   - Arquivo: `assets/images/logo-app-meucorre.png`
   - Use Figma, Photoshop, Canva ou qualquer editor de imagens

2. **Crie uma nova versão:**
   - Crie um novo canvas 1024x1024px com fundo branco
   - Cole a logo atual
   - Reduza o tamanho da logo para 75% (aproximadamente 768x768px)
   - Centralize a logo no canvas
   - Salve como `logo-app-meucorre-android.png`

3. **Atualize o app.json:**
   ```json
   "android": {
     "adaptiveIcon": {
       "foregroundImage": "./assets/images/logo-app-meucorre-android.png",
       "backgroundColor": "#FFFFFF"
     }
   }
   ```

4. **Reconstrua:**
   ```bash
   npx expo prebuild --clean
   ```

## 🎯 Por que isso acontece?

### Android Adaptive Icons
O Android usa "Adaptive Icons" que têm duas camadas:
- **Foreground**: A imagem principal (sua logo)
- **Background**: Cor ou imagem de fundo

O sistema pode:
- Aplicar diferentes formatos (círculo, quadrado, squircle)
- Fazer zoom in/out
- Cortar as bordas

### Safe Zone
O Android define uma "safe zone" de 66dp dentro de um canvas de 108dp:
- Área total: 108x108dp
- Safe zone: 66x66dp (centro)
- Isso significa que apenas ~61% do centro é garantido estar visível

## 📐 Proporções Recomendadas

```
┌─────────────────────────────┐
│                             │  ← 12.5% margem
│    ┌───────────────────┐    │
│    │                   │    │
│    │       LOGO        │    │  ← Logo 75% do tamanho
│    │     (visível)     │    │
│    │                   │    │
│    └───────────────────┘    │
│                             │  ← 12.5% margem
└─────────────────────────────┘
```

## 🔄 Após Ajustar

1. **Limpe o cache:**
   ```bash
   npx expo start -c
   ```

2. **Reconstrua o app:**
   ```bash
   npx expo prebuild --clean
   ```

3. **Teste no Android:**
   ```bash
   npx expo run:android
   ```

4. **Verifique:**
   - Instale no dispositivo real
   - Veja como aparece na tela inicial
   - Teste com diferentes launchers (alguns aplicam formatos diferentes)

## 🛠️ Ferramentas Online (Sem instalação)

Se não quiser instalar nada, use estas ferramentas online:

1. **Photopea** (Photoshop online grátis)
   - https://www.photopea.com
   - Abra a logo, reduza para 75%, centralize, exporte

2. **Canva** (Editor online)
   - https://www.canva.com
   - Crie design 1024x1024px
   - Importe a logo, redimensione, centralize

3. **Icon Kitchen** (Gerador de ícones Android)
   - https://icon.kitchen
   - Upload da logo
   - Ajuste o padding
   - Download do adaptive icon

## ⚠️ Importante

- **iOS não precisa de ajuste** - o iOS já aplica suas próprias margens
- **Mantenha o fundo branco** - combina com o tema do app
- **Teste em dispositivo real** - emuladores podem não mostrar o problema
- **Diferentes launchers** - cada launcher pode aplicar formato diferente

## 📱 Teste Visual

Após aplicar a correção, o ícone deve aparecer assim:

**Antes:** Logo colada nas bordas, pode ser cortada
**Depois:** Logo com respiro, sempre visível completamente

## 🆘 Problemas Comuns

### "ImageMagick não instalado"
```bash
brew install imagemagick
```

### "Script não executa"
```bash
chmod +x scripts/ajustar-icone-android.sh
```

### "Ícone não mudou após rebuild"
```bash
# Limpe completamente
rm -rf android ios
npx expo prebuild --clean
```

### "Ainda está colado"
- Reduza ainda mais (70% em vez de 75%)
- Execute o script novamente com ajuste manual

