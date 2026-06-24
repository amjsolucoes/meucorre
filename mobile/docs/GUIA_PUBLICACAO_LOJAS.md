# 📱 Guia Completo de Publicação nas Lojas

## 🎯 Visão Geral

Este guia cobre TUDO que você precisa para publicar o app **Meu Corre** na App Store (iOS) e Google Play (Android).

---

## ✅ Checklist Geral (Antes de Publicar)

### Obrigatório para AMBAS as lojas:

- [ ] App testado e funcionando sem crashes
- [ ] Todas as funcionalidades testadas
- [ ] Ícones gerados (✅ já feito com `./scripts/gerar-icones-lojas.sh`)
- [ ] Screenshots criados (mínimo 2 por plataforma)
- [ ] Descrição do app escrita
- [ ] Política de Privacidade publicada online
- [ ] Termos de Uso (se aplicável)
- [ ] Conta de desenvolvedor criada e paga

---

## 🍎 App Store (iOS)

### 📋 Requisitos Técnicos

#### 1. Ícones (✅ Já gerados)

Localização: `assets/store-icons/ios/`

| Tamanho | Uso | Arquivo |
|---------|-----|---------|
| 1024x1024 | **App Store** (obrigatório) | `icon-1024.png` |
| 180x180 | iPhone @3x | `icon-60@3x.png` |
| 120x120 | iPhone @2x | `icon-60@2x.png` |
| 167x167 | iPad Pro | `icon-83.5@2x.png` |
| 152x152 | iPad @2x | `icon-76@2x.png` |
| 76x76 | iPad | `icon-76.png` |

#### 2. Screenshots (OBRIGATÓRIO)

**Tamanhos necessários:**

- **6.7" Display (iPhone 15 Pro Max)** - Obrigatório
  - Resolução: 1290 x 2796 pixels
  - Mínimo: 3 screenshots
  - Máximo: 10 screenshots

- **5.5" Display (iPhone 8 Plus)** - Recomendado
  - Resolução: 1242 x 2208 pixels
  - Mínimo: 3 screenshots

**Como criar:**
```bash
# Use o simulador iOS
npx expo run:ios

# Tire screenshots com Cmd+S no simulador
# Ou use ferramentas como:
# - Fastlane Snapshot
# - App Store Screenshot Generator
```

#### 3. Informações do App

**Nome do App:**
- Máximo: 30 caracteres
- Sugestão: "Meu Corre - Controle Financeiro"

**Subtítulo:**
- Máximo: 30 caracteres
- Sugestão: "Para Autônomos e Freelancers"

**Descrição:**
- Máximo: 4000 caracteres
- Foco em benefícios, não em recursos técnicos
- Use linguagem popular (público-alvo: autônomos)

**Palavras-chave:**
- Máximo: 100 caracteres
- Separadas por vírgula
- Sugestão: "autônomo,freelancer,ganhos,gastos,agenda,clientes,recibo,diarista,cabeleireiro"

**Categoria:**
- Primária: **Finanças**
- Secundária: **Produtividade**

#### 4. Política de Privacidade (OBRIGATÓRIO)

- Deve estar hospedada online (URL pública)
- Deve explicar quais dados são coletados
- Deve explicar como os dados são usados
- Deve ter link para contato

**Exemplo de estrutura:**
```
https://seusite.com/privacidade-meucorre
```

#### 5. Informações de Contato

- Email de suporte (obrigatório)
- URL do site (opcional)
- Telefone (opcional)

#### 6. Classificação Etária

Para este app:
- **4+** (Todos os públicos)

#### 7. Preço

- Gratuito ou Pago
- Se tiver compras in-app, declarar

---

### 🚀 Processo de Submissão (iOS)

#### Passo 1: Criar conta Apple Developer

1. Acesse: https://developer.apple.com
2. Inscreva-se no Apple Developer Program
3. **Custo:** $99 USD/ano
4. Aguarde aprovação (1-2 dias)

#### Passo 2: Configurar App Store Connect

1. Acesse: https://appstoreconnect.apple.com
2. Clique em "My Apps" → "+" → "New App"
3. Preencha:
   - Platform: iOS
   - Name: Meu Corre
   - Primary Language: Portuguese (Brazil)
   - Bundle ID: `com.amjsolucoes.meucorreapp`
   - SKU: `meucorre-001`

#### Passo 3: Preparar o Build

```bash
# 1. Instale EAS CLI
npm install -g eas-cli

# 2. Configure EAS
eas login
eas build:configure

# 3. Crie o build para iOS
eas build --platform ios --profile production

# 4. Aguarde o build (15-30 minutos)
# O build será automaticamente enviado para App Store Connect
```

#### Passo 4: Preencher Informações no App Store Connect

1. **App Information:**
   - Nome, subtítulo, categoria
   - Política de privacidade (URL)

2. **Pricing and Availability:**
   - Gratuito
   - Disponível em todos os países

3. **App Privacy:**
   - Declarar quais dados são coletados
   - Para este app: email, nome, dados financeiros

4. **Prepare for Submission:**
   - Upload screenshots (6.7" obrigatório)
   - Upload ícone 1024x1024
   - Descrição do app
   - Palavras-chave
   - URL de suporte
   - Classificação etária

5. **Build:**
   - Selecione o build enviado pelo EAS

6. **Submit for Review**

#### Passo 5: Aguardar Revisão

- Tempo médio: 24-48 horas
- Apple pode rejeitar se:
  - App crashar
  - Falta de funcionalidade
  - Violação de guidelines
  - Política de privacidade inadequada

---

## 🤖 Google Play (Android)

### 📋 Requisitos Técnicos

#### 1. Ícones (✅ Já gerados)

Localização: `assets/store-icons/android/`

| Tamanho | Uso | Arquivo |
|---------|-----|---------|
| 512x512 | **Google Play** (obrigatório) | `icon-512.png` |
| 1024x1024 | Adaptive Icon | `icon-adaptive-1024.png` |
| 192x192 | xxxhdpi | `mipmap-xxxhdpi-192.png` |
| 144x144 | xxhdpi | `mipmap-xxhdpi-144.png` |
| 96x96 | xhdpi | `mipmap-xhdpi-96.png` |
| 72x72 | hdpi | `mipmap-hdpi-72.png` |
| 48x48 | mdpi | `mipmap-mdpi-48.png` |

#### 2. Feature Graphic (OBRIGATÓRIO)

- **Tamanho:** 1024 x 500 pixels
- **Formato:** PNG ou JPEG
- **Localização:** `assets/store-icons/android/feature-graphic-1024x500.png`
- ✅ Já gerado automaticamente

#### 3. Screenshots (OBRIGATÓRIO)

**Requisitos:**
- Mínimo: 2 screenshots
- Máximo: 8 screenshots
- Formato: PNG ou JPEG
- Tamanho mínimo: 320px
- Tamanho máximo: 3840px
- Proporção: 16:9 ou 9:16

**Tamanhos recomendados:**
- **Phone:** 1080 x 1920 pixels (portrait)
- **Tablet 7":** 1200 x 1920 pixels
- **Tablet 10":** 1600 x 2560 pixels

**Como criar:**
```bash
# Use o emulador Android
npx expo run:android

# Tire screenshots com Ctrl+S no emulador
# Ou use ADB:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

#### 4. Informações do App

**Nome do App:**
- Máximo: 50 caracteres
- Sugestão: "Meu Corre - Controle Financeiro para Autônomos"

**Descrição Curta:**
- Máximo: 80 caracteres
- Sugestão: "Controle seus ganhos, gastos, clientes e agenda de forma simples"

**Descrição Completa:**
- Máximo: 4000 caracteres
- Use formatação (negrito, listas)
- Destaque benefícios

**Categoria:**
- Primária: **Finanças**
- Tags: Produtividade, Negócios

#### 5. Política de Privacidade (OBRIGATÓRIO)

- URL pública obrigatória
- Mesma estrutura do iOS

#### 6. Classificação de Conteúdo

Para este app:
- **Livre** (L) - Todos os públicos

#### 7. Preço

- Gratuito ou Pago
- Se tiver compras in-app, declarar

---

### 🚀 Processo de Submissão (Android)

#### Passo 1: Criar conta Google Play Console

1. Acesse: https://play.google.com/console
2. Crie uma conta de desenvolvedor
3. **Custo:** $25 USD (pagamento único)
4. Preencha informações da conta

#### Passo 2: Criar o App

1. No Google Play Console, clique em "Create app"
2. Preencha:
   - App name: Meu Corre
   - Default language: Portuguese (Brazil)
   - App or game: App
   - Free or paid: Free

#### Passo 3: Preparar o Build

```bash
# 1. Instale EAS CLI (se ainda não instalou)
npm install -g eas-cli

# 2. Configure EAS
eas login
eas build:configure

# 3. Crie o build para Android (AAB)
eas build --platform android --profile production

# 4. Aguarde o build (10-20 minutos)
# Baixe o arquivo .aab gerado
```

#### Passo 4: Preencher Informações no Google Play Console

**1. Store Presence → Main Store Listing:**
- App name
- Short description
- Full description
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (mínimo 2)

**2. Store Presence → Store Settings:**
- App category: Finance
- Tags: Productivity, Business
- Contact details: email, website

**3. Policy → App Content:**
- Privacy policy (URL)
- Ads: Não contém anúncios
- Target audience: Todos os públicos
- Content rating: Preencher questionário

**4. Policy → Data Safety:**
- Declarar quais dados são coletados
- Como os dados são usados
- Se os dados são compartilhados

**5. Release → Production:**
- Upload do arquivo .aab
- Release name: "1.0.0"
- Release notes: "Primeira versão do Meu Corre"

**6. Review and Rollout**

#### Passo 5: Aguardar Revisão

- Tempo médio: 1-7 dias (pode ser mais rápido)
- Google pode rejeitar se:
  - App crashar
  - Violação de políticas
  - Conteúdo inadequado
  - Falta de informações

---

## 📸 Dicas para Screenshots

### O que mostrar:

1. **Tela de Dashboard** - Mostre o resumo financeiro
2. **Adicionar Ganho** - Mostre como é fácil registrar
3. **Minha Agenda** - Mostre os agendamentos
4. **Lista de Clientes** - Mostre a gestão de clientes
5. **Recibo** - Mostre a geração de recibo

### Ferramentas recomendadas:

- **Figma** - Para criar mockups profissionais
- **Canva** - Templates prontos para screenshots
- **Fastlane Frameit** - Adiciona molduras de dispositivos
- **App Mockup** - Gera screenshots com dispositivos

### Dicas de design:

- Use texto descritivo em cada screenshot
- Destaque os benefícios, não só as telas
- Use cores consistentes com a identidade do app
- Mostre o app em uso real (com dados de exemplo)

---

## 📝 Exemplo de Descrição do App

### Título:
```
Meu Corre - Controle Financeiro para Autônomos
```

### Descrição Curta:
```
Controle seus ganhos, gastos, clientes e agenda de forma simples e rápida.
```

### Descrição Completa:
```
📊 CONTROLE FINANCEIRO SIMPLES PARA AUTÔNOMOS

O Meu Corre é o app perfeito para você que trabalha por conta própria e precisa organizar suas finanças de forma rápida e fácil.

✅ PRINCIPAIS FUNCIONALIDADES:

💰 Ganhos e Gastos
• Registre seus ganhos e gastos em segundos
• Veja seu saldo atualizado em tempo real
• Acompanhe seu lucro mensal

📅 Agenda de Serviços
• Organize seus agendamentos
• Receba lembretes automáticos
• Marque serviços como concluídos

👥 Gestão de Clientes
• Cadastre seus clientes
• Veja o histórico de cada cliente
• Tenha todas as informações em um só lugar

🧾 Recibos Profissionais
• Gere recibos automaticamente
• Compartilhe por WhatsApp, email ou imprima
• Mantenha registro de todos os pagamentos

📊 Relatórios Visuais
• Gráficos claros e fáceis de entender
• Filtre por período (semana, mês, ano)
• Veja onde está gastando mais

🎯 IDEAL PARA:
• Cabeleireiros e barbeiros
• Diaristas e faxineiras
• Manicures e esteticistas
• Eletricistas e encanadores
• Pintores e pedreiros
• Qualquer profissional autônomo

🔒 SEGURANÇA:
• Seus dados são protegidos
• Backup automático na nuvem
• Acesso apenas com sua senha

💡 SIMPLES E RÁPIDO:
• Interface intuitiva
• Letras grandes e botões fáceis de usar
• Não precisa ser expert em tecnologia

📱 BAIXE GRÁTIS E COMECE AGORA!

Organize suas finanças, controle sua agenda e profissionalize seu trabalho com o Meu Corre.
```

---

## 🔗 Links Úteis

### Apple (iOS):
- Apple Developer: https://developer.apple.com
- App Store Connect: https://appstoreconnect.apple.com
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

### Google (Android):
- Google Play Console: https://play.google.com/console
- Material Design: https://m3.material.io/
- Play Console Help: https://support.google.com/googleplay/android-developer

### Expo:
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- App Store Deployment: https://docs.expo.dev/distribution/app-stores/

---

## ✅ Checklist Final

### Antes de Submeter:

- [ ] Ícones gerados (✅ feito)
- [ ] Screenshots criados (mínimo 2 por plataforma)
- [ ] Descrição escrita
- [ ] Política de privacidade publicada
- [ ] App testado sem crashes
- [ ] Conta de desenvolvedor criada e paga
- [ ] Build gerado com EAS
- [ ] Todas as informações preenchidas no console

### Após Submeter:

- [ ] Aguardar revisão (24-48h iOS, 1-7 dias Android)
- [ ] Responder a possíveis rejeições
- [ ] Publicar nas redes sociais quando aprovado
- [ ] Monitorar reviews e feedback dos usuários

---

## 🆘 Problemas Comuns

### iOS:

**"App crashes on launch"**
- Teste no TestFlight antes de submeter
- Verifique logs de crash no Xcode

**"Missing privacy policy"**
- Publique a política online e adicione a URL

**"Incomplete information"**
- Preencha TODOS os campos obrigatórios

### Android:

**"App not compatible with devices"**
- Verifique o targetSdkVersion (mínimo 34)
- Teste em diferentes tamanhos de tela

**"Missing content rating"**
- Preencha o questionário de classificação

**"Invalid APK/AAB"**
- Use EAS para gerar o build
- Não use APK de debug

---

## 📞 Suporte

Se tiver dúvidas:
1. Consulte a documentação oficial das lojas
2. Acesse os fóruns de desenvolvedores
3. Entre em contato com o suporte das plataformas

**Boa sorte com a publicação! 🚀**
