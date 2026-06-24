# ✅ Checklist: Publicar App com AdMob

Use este checklist antes de publicar seu app nas lojas para garantir que tudo está configurado corretamente.

---

## 📋 Pré-Publicação

### 1. Conta Google AdMob
- [ ] Conta criada em https://apps.admob.com/
- [ ] Informações fiscais preenchidas (CPF/CNPJ)
- [ ] Forma de pagamento configurada
- [ ] Termos de serviço aceitos

### 2. Apps Cadastrados no AdMob
- [ ] App iOS cadastrado no AdMob
- [ ] App Android cadastrado no AdMob
- [ ] App IDs copiados (formato: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)

### 3. Unidades de Anúncio Criadas

#### iOS:
- [ ] Banner criado
- [ ] Intersticial criado
- [ ] Recompensado criado (opcional)
- [ ] IDs copiados

#### Android:
- [ ] Banner criado
- [ ] Intersticial criado
- [ ] Recompensado criado (opcional)
- [ ] IDs copiados

### 4. Código Atualizado
- [ ] IDs de produção substituídos em `constants/admob.ts`
- [ ] App IDs substituídos em `app.json`
- [ ] Variável `USE_TEST_IDS` configurada corretamente
- [ ] Sem `console.log` relacionados a anúncios no código final

### 5. Testes Realizados
- [ ] Testado com IDs de teste em desenvolvimento
- [ ] Anúncios carregam corretamente
- [ ] Anúncios não quebram o layout
- [ ] Anúncios não bloqueiam funcionalidades
- [ ] Testado em iOS (simulador + dispositivo real)
- [ ] Testado em Android (emulador + dispositivo real)
- [ ] Testado em diferentes tamanhos de tela

---

## 🚀 Publicação

### 6. Build de Produção
- [ ] Versão do app incrementada em `app.json`
- [ ] Build de produção gerado (não development)
- [ ] IDs de teste NÃO estão sendo usados
- [ ] App testado em dispositivo real com build de produção

### 7. App Store (iOS)
- [ ] App publicado na App Store
- [ ] Screenshots incluem anúncios (se visíveis)
- [ ] Descrição menciona que o app contém anúncios
- [ ] Política de privacidade atualizada (mencionar AdMob)

### 8. Google Play Store (Android)
- [ ] App publicado no Google Play
- [ ] Screenshots incluem anúncios (se visíveis)
- [ ] Descrição menciona que o app contém anúncios
- [ ] Política de privacidade atualizada (mencionar AdMob)

---

## 📊 Pós-Publicação

### 9. Monitoramento (Primeiros 7 dias)
- [ ] Verificar console AdMob diariamente
- [ ] Confirmar que anúncios estão sendo exibidos
- [ ] Verificar taxa de preenchimento (fill rate)
- [ ] Verificar taxa de cliques (CTR)
- [ ] Verificar receita estimada

### 10. Otimização
- [ ] Analisar quais telas têm melhor performance
- [ ] Ajustar posicionamento se necessário
- [ ] Testar diferentes tamanhos de banner
- [ ] Ajustar frequência de intersticiais se necessário

---

## ⚠️ Verificações de Segurança

### 11. Conformidade com Políticas
- [ ] Não há cliques fraudulentos
- [ ] Anúncios não estão escondidos
- [ ] Anúncios não são forçados
- [ ] App não incentiva cliques
- [ ] Conteúdo do app é apropriado para anúncios

### 12. Experiência do Usuário
- [ ] App funciona bem mesmo com anúncios
- [ ] Anúncios não cobrem conteúdo importante
- [ ] Anúncios não aparecem durante ações críticas
- [ ] Tempo de carregamento não foi afetado
- [ ] App não trava por causa dos anúncios

---

## 🔧 Troubleshooting

### Se anúncios não aparecem após publicação:

1. **Aguarde 24-48 horas**
   - AdMob precisa aprovar novos apps
   - Pode levar tempo para começar a servir anúncios

2. **Verifique o console AdMob**
   - Status do app: "Pronto" ou "Aguardando aprovação"?
   - Unidades de anúncio: "Ativas"?

3. **Verifique os logs**
   - Erros de carregamento?
   - IDs corretos?

4. **Teste com IDs de teste**
   - Se IDs de teste funcionam, problema é com IDs de produção
   - Verifique se copiou os IDs corretos

---

## 📱 Contatos Úteis

- **Console AdMob**: https://apps.admob.com/
- **Suporte Google**: https://support.google.com/admob
- **Documentação**: https://developers.google.com/admob
- **Políticas do AdMob**: https://support.google.com/admob/answer/6128543

---

## 💰 Expectativas Realistas

### Primeiros 30 dias:
- Ganhos podem ser baixos (R$ 5-50)
- AdMob está aprendendo sobre seu público
- Taxa de preenchimento pode ser baixa no início

### Após 60 dias:
- Ganhos devem estabilizar
- Taxa de preenchimento melhora
- Você terá dados para otimizar

### Longo prazo:
- Foque em crescer a base de usuários
- Mais usuários = mais impressões = mais dinheiro
- Otimize baseado em dados reais

---

## ✨ Dicas Finais

1. **Paciência**: Monetização leva tempo
2. **Qualidade**: App bom = usuários engajados = mais anúncios vistos
3. **Dados**: Use o console AdMob para tomar decisões
4. **Testes**: Sempre teste antes de publicar
5. **Conformidade**: Siga as regras do Google à risca

**Boa sorte! 🚀💰**

---

## 📅 Histórico de Versões

- **v1.0** (Maio 2026): Implementação inicial do AdMob
  - Banner na tela principal
  - Hook de intersticiais
  - Hook de controle de frequência
  - Documentação completa
