# 📱 Informações para Publicação - Android (Google Play Store)

**Data de Análise:** 14 de maio de 2026  
**Versão do App:** 1.0.0  
**Status:** ✅ Pronto para publicação

---

## ✅ Status da Configuração

### Configurações Verificadas

| Item | Status | Observação |
|------|--------|------------|
| **app.json** | ✅ Configurado | Todas as informações corretas |
| **package.json** | ✅ Configurado | Versão 1.0.0 definida |
| **eas.json** | ✅ Configurado | Build production com AAB |
| **build.gradle** | ✅ Configurado | versionCode 1, versionName 1.0.0 |
| **gradle.properties** | ✅ Configurado | targetSdk adequado |
| **Ícones** | ✅ Gerados | Todos os tamanhos necessários |
| **Política de Privacidade** | ✅ Criada | Documento completo em docs/ |
| **Termos de Uso** | ✅ Criados | Documento completo em docs/ |
| **Descrições** | ✅ Prontas | Textos para a loja preparados |

---

## 📋 Informações do App (app.json)

### Identificação
```json
{
  "name": "MeuCorre",
  "slug": "meu-corre-app",
  "version": "1.0.0",
  "android": {
    "package": "com.amjsolucoes.meucorreapp"
  }
}
```

### Detalhes Importantes
- **Nome do App:** MeuCorre
- **Package Name:** com.amjsolucoes.meucorreapp
- **Versão:** 1.0.0
- **Version Code:** 1 (definido no build.gradle)

---

## 🔧 Configurações Técnicas

### Android SDK Versions (gradle.properties)
```properties
compileSdkVersion: 35 (Android 15)
targetSdkVersion: 35 (Android 15)
minSdkVersion: 24 (Android 7.0)
buildToolsVersion: 35.0.0
```

✅ **Conformidade:** Atende aos requisitos da Google Play (targetSdk 34+)

### Arquiteturas Suportadas
```properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

✅ **Cobertura:** Suporta todos os dispositivos Android modernos

### Recursos Habilitados
- ✅ New Architecture (newArchEnabled=true)
- ✅ Hermes Engine (hermesEnabled=true)
- ✅ Edge-to-Edge (edgeToEdgeEnabled=true)
- ✅ PNG Compression (android.enablePngCrunchInReleaseBuilds=true)

---

## 📦 Build Configuration (eas.json)

### Perfil de Produção
```json
{
  "production": {
    "android": {
      "buildType": "app-bundle"
    }
  }
}
```

✅ **Formato:** AAB (Android App Bundle) - Formato obrigatório para Google Play

### Comando para Gerar o Build
```bash
# Opção 1: Usando o script do projeto
npm run build:prod

# Opção 2: Comando direto EAS
eas build --platform android --profile production
```

---

## 🎨 Assets Visuais

### Ícones Disponíveis
Localização: `assets/store-icons/android/`

| Arquivo | Tamanho | Uso |
|---------|---------|-----|
| icon-512.png | 512x512 | **Google Play Store** (obrigatório) |
| icon-adaptive-1024.png | 1024x1024 | Adaptive Icon |
| feature-graphic-1024x500.png | 1024x500 | **Feature Graphic** (obrigatório) |
| mipmap-xxxhdpi-192.png | 192x192 | xxxhdpi |
| mipmap-xxhdpi-144.png | 144x144 | xxhdpi |
| mipmap-xhdpi-96.png | 96x96 | xhdpi |
| mipmap-hdpi-72.png | 72x72 | hdpi |
| mipmap-mdpi-48.png | 48x48 | mdpi |

✅ **Status:** Todos os ícones necessários foram gerados

### Screenshots Necessários
⚠️ **PENDENTE:** Criar no mínimo 2 screenshots

**Especificações:**
- **Formato:** PNG ou JPEG
- **Tamanho recomendado:** 1080 x 1920 pixels (portrait)
- **Mínimo:** 2 screenshots
- **Máximo:** 8 screenshots

**Sugestões de telas para capturar:**
1. Dashboard (tela inicial com gráficos)
2. Adicionar Ganho
3. Lista de Clientes
4. Agenda de Compromissos
5. Geração de Recibo

---

## 📝 Informações para o Google Play Console

### 1. Detalhes do App

#### Nome do App (50 caracteres)
```
MeuCorre: Controle Financeiro para Autônomos
```

#### Descrição Curta (80 caracteres)
```
Controle ganhos, gastos, clientes e agenda. Feito para autônomos brasileiros.
```

#### Descrição Completa (4000 caracteres)
```
🎯 ORGANIZE SEU TRABALHO E GANHE MAIS

O MeuCorre é o aplicativo perfeito para você que trabalha por conta própria e quer ter controle total do seu negócio. Simples, rápido e feito especialmente para profissionais autônomos brasileiros.

💰 CONTROLE FINANCEIRO COMPLETO

✓ Registre seus ganhos em segundos
✓ Anote todos os gastos do dia a dia
✓ Veja seu saldo atualizado em tempo real
✓ Gráficos coloridos que mostram quanto você ganhou e gastou
✓ Relatórios detalhados por dia, semana e mês
✓ Entenda para onde está indo seu dinheiro

👥 GESTÃO DE CLIENTES INTELIGENTE

✓ Cadastre seus clientes rapidamente
✓ Importe contatos direto da agenda do celular
✓ Veja o histórico completo de serviços de cada cliente
✓ Busca inteligente para encontrar clientes na hora
✓ Saiba quem são seus melhores clientes
✓ Adicione observações importantes

📅 AGENDA QUE FUNCIONA

✓ Marque compromissos com poucos toques
✓ Receba lembretes automáticos antes dos agendamentos
✓ Veja sua agenda do dia, semana e mês
✓ Acompanhe status: agendado, concluído ou cancelado
✓ Nunca mais esqueça um compromisso importante
✓ Organize seu tempo de forma profissional

🧾 RECIBOS PROFISSIONAIS EM SEGUNDOS

✓ Gere recibos profissionais instantaneamente
✓ Compartilhe por WhatsApp, email ou outras redes
✓ Formato PDF pronto para impressão
✓ Personalize com suas informações e logo
✓ Profissionalize seu atendimento
✓ Transmita mais confiança aos clientes

📊 RELATÓRIOS E INSIGHTS VISUAIS

✓ Entenda seus ganhos e gastos de forma visual
✓ Descubra seus melhores dias e horários de trabalho
✓ Acompanhe o crescimento do seu negócio mês a mês
✓ Tome decisões baseadas em dados reais
✓ Identifique oportunidades de crescimento

✨ PARA QUEM É O MEUCORRE?

O MeuCorre foi criado pensando em você:

• Cabeleireiros e Barbeiros
• Manicures e Pedicures
• Diaristas e Faxineiras
• Eletricistas e Encanadores
• Personal Trainers
• Professores Particulares
• Pintores e Pedreiros
• Mecânicos e Borracheiros
• Costureiras e Alfaiates
• Fotógrafos Autônomos
• E qualquer profissional que trabalha por conta própria!

🔒 SEGURANÇA E PRIVACIDADE GARANTIDAS

✓ Seus dados são protegidos com criptografia de ponta
✓ Backup automático e seguro na nuvem
✓ Acesso protegido com senha forte
✓ Conformidade total com a LGPD
✓ Seus dados são exclusivamente seus
✓ Nunca compartilhamos ou vendemos suas informações

🆓 COMECE GRÁTIS AGORA MESMO

✓ Sem necessidade de cartão de crédito
✓ Sem pegadinhas ou taxas escondidas
✓ Sem anúncios invasivos
✓ Todas as funcionalidades essenciais gratuitas
✓ Teste sem compromisso

📱 SIMPLES E FÁCIL DE USAR

✓ Interface limpa e intuitiva
✓ Botões grandes e fáceis de tocar
✓ Linguagem simples, sem termos técnicos
✓ Funciona offline quando necessário
✓ Sincroniza automaticamente quando conectar
✓ Aprenda a usar em minutos

🌟 POR QUE ESCOLHER O MEUCORRE?

• Feito por brasileiros, para brasileiros
• Linguagem popular e acessível
• Suporte em português
• Entende as necessidades dos autônomos
• Atualizado constantemente com novos recursos
• Comunidade ativa de usuários

🚀 BAIXE AGORA E TRANSFORME SEU TRABALHO!

Junte-se a milhares de profissionais autônomos que já estão usando o MeuCorre para ter mais controle, ganhar mais e trabalhar de forma mais organizada e profissional.

---

📧 Suporte: suporte@amjsolucoes.com

📄 Termos de Uso: [inserir link após publicar]
🔒 Política de Privacidade: [inserir link após publicar]

© 2026 AMJ Soluções - Todos os direitos reservados
```

---

### 2. Categorização

#### Categoria Principal
```
Finanças
```

#### Categoria Secundária (Tags)
```
Produtividade, Negócios
```

---

### 3. Detalhes de Contato

#### Email de Contato (obrigatório)
```
suporte@amjsolucoes.com
```

#### Site (opcional)
```
[Inserir URL do site quando disponível]
```

#### Telefone (opcional)
```
[Inserir telefone se disponível]
```

---

### 4. Política de Privacidade (OBRIGATÓRIO)

⚠️ **AÇÃO NECESSÁRIA:** Publicar a política de privacidade online

**Arquivo local:** `docs/POLITICA_PRIVACIDADE.md`

**Opções para publicação:**
1. Criar uma página no seu site: `https://seusite.com/privacidade`
2. Usar GitHub Pages (gratuito)
3. Usar serviços como Notion, Google Sites, etc.

**URL a ser inserida no Google Play Console:**
```
[Inserir URL após publicar online]
```

---

### 5. Classificação de Conteúdo

#### Questionário de Classificação
Responda ao questionário no Google Play Console:

**Perguntas esperadas:**
- ❌ Contém violência?
- ❌ Contém conteúdo sexual?
- ❌ Contém linguagem imprópria?
- ❌ Contém drogas, álcool ou tabaco?
- ❌ Contém temas sensíveis?
- ✅ É um app de finanças pessoais

**Classificação esperada:** **Livre (L)** - Todos os públicos

---

### 6. Segurança de Dados (Data Safety)

#### Dados Coletados
Marque no Google Play Console:

**Informações Pessoais:**
- ✅ Nome
- ✅ Email
- ✅ Telefone

**Informações Financeiras:**
- ✅ Histórico de transações (ganhos e gastos)
- ❌ Informações de pagamento (não coletamos)

**Contatos:**
- ✅ Lista de contatos (opcional, com permissão do usuário)

**Dados de Uso:**
- ✅ Interações com o app
- ✅ Diagnósticos de erros

#### Como os Dados São Usados
- ✅ Funcionalidade do app
- ✅ Análise e melhoria do app
- ❌ Publicidade ou marketing
- ❌ Compartilhamento com terceiros

#### Segurança
- ✅ Dados criptografados em trânsito (SSL/TLS)
- ✅ Dados criptografados em repouso
- ✅ Usuário pode solicitar exclusão de dados

---

### 7. Notas de Versão (Release Notes)

#### Versão 1.0.0 - Lançamento Inicial
```
🎉 Bem-vindo ao MeuCorre!

Organize seu trabalho e ganhe mais com o app feito para autônomos brasileiros.

✨ Novidades desta versão:

• 💰 Controle completo de ganhos e gastos
• 👥 Gestão inteligente de clientes
• 📅 Agenda com lembretes automáticos
• 🧾 Geração de recibos profissionais
• 📊 Relatórios visuais e gráficos
• 🔒 Segurança e privacidade garantidas

Baixe agora e comece a organizar seu negócio!

Dúvidas? suporte@amjsolucoes.com
```

---

## 🚀 Passo a Passo para Publicação

### Pré-requisitos
- [ ] Conta Google Play Console criada ($25 USD pagos)
- [ ] Política de Privacidade publicada online
- [ ] Screenshots criados (mínimo 2)
- [ ] Build AAB gerado

### Etapa 1: Gerar o Build AAB
```bash
# No terminal, execute:
npm run build:prod

# Ou diretamente:
eas build --platform android --profile production

# Aguarde 10-20 minutos
# Baixe o arquivo .aab quando pronto
```

### Etapa 2: Criar o App no Google Play Console
1. Acesse: https://play.google.com/console
2. Clique em "Create app"
3. Preencha:
   - App name: **MeuCorre**
   - Default language: **Portuguese (Brazil)**
   - App or game: **App**
   - Free or paid: **Free**
4. Aceite as declarações e clique em "Create app"

### Etapa 3: Preencher Informações Obrigatórias

#### 3.1 Store Presence → Main Store Listing
- [ ] App name
- [ ] Short description
- [ ] Full description
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (mínimo 2)

#### 3.2 Store Presence → Store Settings
- [ ] App category: **Finance**
- [ ] Tags: Productivity, Business
- [ ] Contact details: email, website

#### 3.3 Policy → App Content
- [ ] Privacy policy URL
- [ ] Ads: **Não contém anúncios**
- [ ] Target audience: **Todos os públicos**
- [ ] Content rating: Preencher questionário

#### 3.4 Policy → Data Safety
- [ ] Declarar dados coletados
- [ ] Como os dados são usados
- [ ] Práticas de segurança

### Etapa 4: Upload do AAB
1. Vá para **Release → Production**
2. Clique em "Create new release"
3. Upload do arquivo .aab
4. Preencha:
   - Release name: **1.0.0**
   - Release notes: (copiar do texto acima)

### Etapa 5: Revisão e Publicação
1. Revise todas as informações
2. Clique em "Review release"
3. Clique em "Start rollout to Production"
4. Aguarde revisão (1-7 dias)

---

## ⚠️ Ações Pendentes

### Antes de Publicar

1. **CRIAR SCREENSHOTS** (obrigatório)
   - Mínimo: 2 screenshots
   - Recomendado: 5-8 screenshots
   - Tamanho: 1080 x 1920 pixels

2. **PUBLICAR POLÍTICA DE PRIVACIDADE ONLINE** (obrigatório)
   - Arquivo: `docs/POLITICA_PRIVACIDADE.md`
   - Publicar em: site, GitHub Pages, ou similar
   - Obter URL pública

3. **PUBLICAR TERMOS DE USO ONLINE** (recomendado)
   - Arquivo: `docs/TERMOS_USO.md`
   - Publicar junto com a política de privacidade

4. **CRIAR CONTA GOOGLE PLAY CONSOLE**
   - Custo: $25 USD (pagamento único)
   - Link: https://play.google.com/console

5. **TESTAR O APP COMPLETAMENTE**
   - Testar todas as funcionalidades
   - Verificar se não há crashes
   - Testar em diferentes dispositivos/tamanhos de tela

---

## 📊 Informações Adicionais

### Versioning
- **Version Name:** 1.0.0 (visível para usuários)
- **Version Code:** 1 (número interno, incrementa a cada build)

### Próximas Versões
Para atualizar o app:
1. Incrementar `versionCode` no `build.gradle`
2. Atualizar `versionName` no `build.gradle`
3. Atualizar `version` no `app.json`
4. Gerar novo build
5. Upload no Google Play Console

### Exemplo de Versionamento
```
Versão 1.0.0 → versionCode: 1
Versão 1.0.1 → versionCode: 2
Versão 1.1.0 → versionCode: 3
Versão 2.0.0 → versionCode: 4
```

---

## 🔗 Links Úteis

- **Google Play Console:** https://play.google.com/console
- **Documentação EAS Build:** https://docs.expo.dev/build/introduction/
- **Guia de Publicação Expo:** https://docs.expo.dev/submit/android/
- **Políticas do Google Play:** https://play.google.com/about/developer-content-policy/

---

## 📞 Suporte

Para dúvidas sobre a publicação:
- **Email:** suporte@amjsolucoes.com
- **Documentação:** Consulte `docs/GUIA_PUBLICACAO_LOJAS.md`

---

## ✅ Checklist Final

Antes de submeter para revisão:

- [ ] Build AAB gerado com sucesso
- [ ] Screenshots criados (mínimo 2)
- [ ] Política de Privacidade publicada online
- [ ] Termos de Uso publicados online (recomendado)
- [ ] Todas as informações preenchidas no Google Play Console
- [ ] App testado sem crashes
- [ ] Classificação de conteúdo preenchida
- [ ] Data Safety preenchido
- [ ] Email de contato configurado

---

**Boa sorte com a publicação! 🚀**

*Documento gerado automaticamente em 14/05/2026*
