# ✅ Checklist Rápido de Publicação

## 🎯 Passo a Passo Simplificado

### 1️⃣ Gerar Ícones (✅ FEITO)

```bash
./scripts/gerar-icones-lojas.sh
```

**Resultado:**
- ✅ 11 ícones iOS em `assets/store-icons/ios/`
- ✅ 7 ícones Android em `assets/store-icons/android/`
- ✅ Feature Graphic 1024x500 para Google Play

---

### 2️⃣ Criar Screenshots (FAZER)

**iOS - Mínimo 3 screenshots:**
- Tamanho: 1290 x 2796 pixels (iPhone 15 Pro Max)
- Telas sugeridas: Dashboard, Adicionar Ganho, Agenda

**Android - Mínimo 2 screenshots:**
- Tamanho: 1080 x 1920 pixels
- Telas sugeridas: Dashboard, Adicionar Ganho

**Como criar:**
```bash
# iOS
npx expo run:ios
# Tire screenshots com Cmd+S no simulador

# Android
npx expo run:android
# Tire screenshots com Ctrl+S no emulador
```

---

### 3️⃣ Criar Política de Privacidade (FAZER)

**Obrigatório para ambas as lojas!**

Publique em: `https://seusite.com/privacidade-meucorre`

**Deve conter:**
- Quais dados são coletados (email, nome, dados financeiros)
- Como os dados são usados
- Como os dados são protegidos
- Contato para dúvidas

---

### 4️⃣ Criar Contas de Desenvolvedor

**Apple Developer:**
- URL: https://developer.apple.com
- Custo: $99 USD/ano
- Tempo de aprovação: 1-2 dias

**Google Play Console:**
- URL: https://play.google.com/console
- Custo: $25 USD (pagamento único)
- Aprovação imediata

---

### 5️⃣ Gerar Builds de Produção

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar
eas build:configure

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

---

### 6️⃣ Submeter para as Lojas

#### iOS (App Store Connect):

1. Acesse: https://appstoreconnect.apple.com
2. Crie novo app
3. Preencha informações:
   - Nome: "Meu Corre - Controle Financeiro"
   - Categoria: Finanças
   - Ícone: `assets/store-icons/ios/icon-1024.png`
   - Screenshots (mínimo 3)
   - Descrição
   - Política de privacidade (URL)
4. Selecione o build do EAS
5. Submit for Review

#### Android (Google Play Console):

1. Acesse: https://play.google.com/console
2. Crie novo app
3. Preencha informações:
   - Nome: "Meu Corre - Controle Financeiro para Autônomos"
   - Categoria: Finanças
   - Ícone: `assets/store-icons/android/icon-512.png`
   - Feature Graphic: `assets/store-icons/android/feature-graphic-1024x500.png`
   - Screenshots (mínimo 2)
   - Descrição
   - Política de privacidade (URL)
4. Upload do arquivo .aab do EAS
5. Review and Rollout

---

## 📋 Checklist Completo

### Preparação:

- [x] Ícones gerados
- [ ] Screenshots criados (mínimo 2-3 por plataforma)
- [ ] Política de privacidade publicada online
- [ ] Descrição do app escrita
- [ ] Conta Apple Developer criada ($99/ano)
- [ ] Conta Google Play Console criada ($25 único)

### Builds:

- [ ] EAS CLI instalado
- [ ] Build iOS gerado
- [ ] Build Android gerado
- [ ] Builds testados (sem crashes)

### App Store (iOS):

- [ ] App criado no App Store Connect
- [ ] Nome e subtítulo definidos
- [ ] Categoria selecionada (Finanças)
- [ ] Ícone 1024x1024 enviado
- [ ] Screenshots enviados (mínimo 3)
- [ ] Descrição preenchida
- [ ] Palavras-chave definidas
- [ ] Política de privacidade (URL)
- [ ] Email de suporte
- [ ] Classificação etária (4+)
- [ ] Build selecionado
- [ ] Submetido para revisão

### Google Play (Android):

- [ ] App criado no Google Play Console
- [ ] Nome definido
- [ ] Categoria selecionada (Finanças)
- [ ] Ícone 512x512 enviado
- [ ] Feature Graphic 1024x500 enviado
- [ ] Screenshots enviados (mínimo 2)
- [ ] Descrição curta e completa preenchidas
- [ ] Política de privacidade (URL)
- [ ] Email de contato
- [ ] Classificação de conteúdo preenchida
- [ ] Data safety preenchido
- [ ] Build .aab enviado
- [ ] Submetido para revisão

---

## ⏱️ Tempo Estimado

| Etapa | Tempo |
|-------|-------|
| Gerar ícones | ✅ 2 minutos (feito) |
| Criar screenshots | 30-60 minutos |
| Escrever descrição | 20-30 minutos |
| Criar política de privacidade | 30-60 minutos |
| Criar contas | 15-30 minutos |
| Gerar builds | 30-45 minutos |
| Preencher informações iOS | 30-45 minutos |
| Preencher informações Android | 30-45 minutos |
| **TOTAL** | **3-5 horas** |

---

## 🕐 Tempo de Revisão

- **iOS:** 24-48 horas (média)
- **Android:** 1-7 dias (média, pode ser mais rápido)

---

## 📁 Arquivos Importantes

### Ícones (✅ Gerados):
```
assets/store-icons/
├── ios/
│   ├── icon-1024.png          ← App Store (obrigatório)
│   ├── icon-60@2x.png
│   ├── icon-60@3x.png
│   └── ... (outros tamanhos)
└── android/
    ├── icon-512.png           ← Google Play (obrigatório)
    ├── feature-graphic-1024x500.png  ← Feature Graphic (obrigatório)
    └── ... (outros tamanhos)
```

### Screenshots (CRIAR):
```
screenshots/
├── ios/
│   ├── 01-dashboard.png       (1290 x 2796)
│   ├── 02-adicionar-ganho.png (1290 x 2796)
│   └── 03-agenda.png          (1290 x 2796)
└── android/
    ├── 01-dashboard.png       (1080 x 1920)
    └── 02-adicionar-ganho.png (1080 x 1920)
```

---

## 🆘 Problemas Comuns

### "Não tenho $99 para Apple Developer"
- Comece apenas com Android ($25)
- Publique no Google Play primeiro
- Depois adicione iOS quando tiver budget

### "Não sei criar screenshots profissionais"
- Use Figma (gratuito) com templates
- Use Canva (gratuito) com mockups
- Tire prints simples do app funcionando

### "Não tenho site para política de privacidade"
- Use GitHub Pages (gratuito)
- Use Google Sites (gratuito)
- Use Notion (gratuito) e publique a página

### "Build do EAS está demorando muito"
- Tempo normal: 10-30 minutos
- Se falhar, leia os logs de erro
- Verifique se o app.json está correto

---

## 🎯 Próximos Passos

1. **Agora:** Criar screenshots
2. **Depois:** Escrever política de privacidade
3. **Depois:** Criar contas de desenvolvedor
4. **Depois:** Gerar builds com EAS
5. **Por último:** Submeter para as lojas

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `docs/GUIA_PUBLICACAO_LOJAS.md` - Guia completo passo a passo

---

**Boa sorte! 🚀**
