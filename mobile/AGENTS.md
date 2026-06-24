# 📱 AGENTS.md — SaaS para Autônomos

## 🧠 Contexto do Projeto
App mobile para autônomos (cabeleireiros, diaristas, etc) controlarem
ganhos, gastos, clientes e agendamentos. Foco em simplicidade e
linguagem popular.

## 🛠️ Stack
- React Native com Expo SDK 54
- Expo Router (navegação file-based)
- Supabase (banco de dados e autenticação)
- NativeWind (estilização com Tailwind)
- Zustand (estado global)
- React Hook Form + Zod (formulários e validação)
- date-fns (formatação de datas em português)
- react-native-mask-input (máscaras de campos)
- react-native-gifted-charts (gráficos do dashboard)
- expo-print + expo-sharing (geração e envio de recibos)
- expo-notifications (lembretes de agendamentos)

## 📁 Estrutura de Pastas
- app/(auth)/ → telas de login e cadastro
- app/(tabs)/ → telas principais com tab bar
- app/ganho/ → adicionar ganho
- app/gasto/ → adicionar gasto
- app/recibo/ → visualizar e compartilhar recibo
- components/ → componentes reutilizáveis
- lib/supabase.ts → cliente Supabase
- stores/ → Zustand stores
- hooks/ → custom hooks
- constants/ → cores e constantes

## 🎨 Princípios de UI (OBRIGATÓRIO)
- Botões GRANDES e com texto simples
- Letras grandes, fáceis de ler
- Poucos campos por tela
- Linguagem popular: "Salvar", "Adicionar", "Ver agenda"
- NUNCA usar termos técnicos nas telas
- Cores: verde para ganhos, vermelho para gastos, azul para neutro
- Máximo de 3 ações por tela

## 📐 Padrões de Código
- TypeScript obrigatório em todos os arquivos
- Componentes sempre em arrow function com tipagem explícita
- Estilização APENAS com NativeWind (classes Tailwind)
- NUNCA usar StyleSheet.create()
- Formulários SEMPRE com React Hook Form + Zod
- Chamadas ao Supabase SEMPRE dentro de custom hooks em /hooks
- Estados globais APENAS via Zustand em /stores
- NUNCA buscar dados diretamente dentro de componentes

## 🗄️ Banco de Dados (Supabase)
Tabelas: profiles, transactions, clients, appointments
- transactions.tipo → 'ganho' ou 'gasto'
- appointments.status → 'agendado', 'concluido', 'cancelado'
- Toda query deve filtrar por user_id do usuário autenticado
- Usar Row Level Security (RLS) no Supabase

## ✅ Boas Práticas
- Tratar SEMPRE erros de rede com mensagem amigável ao usuário
- Loading states em toda operação assíncrona
- Confirmar antes de deletar qualquer registro
- Datas sempre formatadas em pt-BR (ex: "Segunda, 5 de maio")
- Valores sempre em R$ com 2 casas decimais

## 🚫 Proibido
- Não usar StyleSheet.create()
- Não fazer fetch direto dentro de componentes
- Não usar termos técnicos nas interfaces
- Não criar telas complexas com muitos campos
- Não usar bibliotecas fora da stack definida sem aprovação

## Padrões de Plataforma (iOS e Android)

### Comportamento por plataforma
- Usar Platform.OS para ajustes específicos quando necessário
- iOS: usar SafeAreaView em todas as telas
- Android: tratar o StatusBar manualmente
- Navegação seguir os padrões nativos de cada plataforma
- Teclado: sempre usar KeyboardAvoidingView com behavior correto
  - iOS: behavior="padding"
  - Android: behavior="height"

### Fontes e tipografia
- Nunca usar fontes customizadas sem fallback nativo
- iOS: SF Pro (System font)
- Android: Roboto (System font)
- Usar fontFamily: Platform.select({ ios: 'System', android: 'Roboto' })

### Ícones e imagens
- Ícones seguir tamanhos mínimos de toque: 44x44pt (iOS) e 48x48dp (Android)
- Imagens sempre com @2x e @3x para iOS
- Imagens otimizadas e comprimidas antes de entrar no projeto

### Acessibilidade (obrigatório para aprovação nas lojas)
- Todo elemento interativo ter accessibilityLabel descritivo
- Inputs sempre com accessibilityHint
- Imagens decorativas com accessible={false}
- Imagens de conteúdo com accessibilityLabel
- Testar com VoiceOver (iOS) e TalkBack (Android)

---

## Requisitos para Publicação nas Lojas

### Geral (ambas as lojas)
- App nunca pode travar ou fechar sozinho (zero crashes na revisão)
- Todas as funcionalidades devem funcionar sem internet quando possível
- Mensagens de erro sempre amigáveis, nunca mostrar erros técnicos
- Loading em toda operação assíncrona, sem telas travadas
- Nunca bloquear o botão voltar do Android
- Deep links configurados corretamente

### Apple App Store (iOS)
- Seguir Human Interface Guidelines (HIG) da Apple
- Nunca mencionar Android, Google Play ou concorrentes dentro do app
- Nunca mencionar "compre em nosso site" para driblar compras in-app
- Tela de privacidade e termos de uso obrigatórios
- Permissões (câmera, localização, etc) com descrição clara do motivo
- Suporte a Dynamic Type (tamanhos de fonte do sistema)
- Suporte a Dark Mode
- Splash screen seguindo as diretrizes da Apple
- Ícone do app sem transparência, sem cantos arredondados (a Apple aplica)
- Screenshots reais do app para a App Store

### Google Play Store (Android)
- Seguir Material Design 3 guidelines
- Permissões solicitadas apenas quando necessário e com explicação
- Nunca solicitar permissões desnecessárias
- APK ou AAB assinado com keystore
- targetSdkVersion sempre atualizado (mínimo API 34 em 2026)
- minSdkVersion 24 (Android 7.0)
- Política de privacidade obrigatória
- Suporte a dark mode
- Ícone com camadas adaptativas (adaptive icon)
- Testar em múltiplas resoluções de tela

---

## Checklist antes de qualquer PR ou entrega de feature

### Interface
- [ ] Testado no simulador iOS
- [ ] Testado no emulador Android
- [ ] Funciona em tela pequena (iPhone SE / Android 5")
- [ ] Funciona em tela grande (iPhone Pro Max / Android 6.7")
- [ ] Dark mode não quebra o layout
- [ ] Teclado não cobre campos de input
- [ ] SafeAreaView aplicado corretamente

### Código
- [ ] Sem console.log no código final
- [ ] Sem credenciais ou chaves de API no código
- [ ] Variáveis de ambiente usando expo-constants ou .env
- [ ] Erros tratados com mensagem amigável
- [ ] Loading state implementado
- [ ] TypeScript sem erros
- [ ] Sem imports não utilizados

### Acessibilidade
- [ ] accessibilityLabel em botões e ícones
- [ ] Contraste de cores suficiente (mínimo 4.5:1)
- [ ] Elementos tocáveis com tamanho mínimo de 44x44

### Performance
- [ ] Listas usando FlatList ou FlashList (nunca ScrollView com map)
- [ ] Imagens com tamanho otimizado
- [ ] Sem re-renders desnecessários
- [ ] useCallback e useMemo onde necessário