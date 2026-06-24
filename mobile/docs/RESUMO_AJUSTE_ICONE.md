# 🚀 Resumo: Como Corrigir o Ícone Colado nas Bordas

## ⚡ Solução Rápida (3 passos)

### 1️⃣ Crie uma versão com mais espaço

**Opção A - Com ImageMagick (automático):**
```bash
brew install imagemagick
./scripts/ajustar-icone-android.sh
```

**Opção B - Manual (qualquer editor):**
- Abra `assets/images/logo-app-meucorre.png` em Figma/Canva/Photoshop
- Crie canvas 1024x1024px com fundo branco
- Cole a logo e reduza para 75% do tamanho
- Centralize
- Salve como `logo-app-meucorre-android.png`

### 2️⃣ Atualize o app.json

Mude esta linha:
```json
"foregroundImage": "./assets/images/logo-app-meucorre.png"
```

Para:
```json
"foregroundImage": "./assets/images/logo-app-meucorre-android.png"
```

### 3️⃣ Reconstrua o app

```bash
npx expo prebuild --clean
npx expo run:android
```

## ✅ Pronto!

O ícone agora terá espaço de respiro e não ficará mais colado nas bordas.

---

📖 **Documentação completa:** `docs/AJUSTAR_ICONE_APP.md`
