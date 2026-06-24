# 📚 Documentação do MeuCorre App

Índice completo de toda a documentação do projeto.

---

## 🚀 Início Rápido

- **[Comandos Rápidos](COMANDOS_RAPIDOS.md)** - Comandos mais usados para copiar e colar
- **[Resumo da Sessão](RESUMO_SESSAO_CORRECOES.md)** - Visão geral de todas as correções aplicadas

---

## 🐛 Problemas e Soluções

### Erro do AdMob na Web
- **[Solução Completa](SOLUCAO_ERRO_WEB_ADMOB.md)** - Explicação detalhada do problema e solução
- **[Comandos para Testar](COMANDOS_TESTE_WEB.md)** - Passo a passo para testar na web
- **[Checklist de Teste](CHECKLIST_TESTE_WEB.md)** - Lista de verificação completa
- **[Resumo da Correção](RESUMO_CORRECAO_WEB.md)** - Resumo executivo

### Erro BuildConfig no Android
- **[Correção do BuildConfig](CORRECAO_ERRO_ANDROID_BUILDCONFIG.md)** - Como corrigir o erro de compilação Android

### Package Name
- **[Correção do Package Name](CORRECAO_PACKAGE_NAME.md)** - Mudança de com.amjsolucoes.meucorreapp para com.amjsolucoes.meucorre

---

## 📱 Publicação nas Lojas

### Google Play Store (Android)
- **[Informações para Publicação](INFORMACOES_PUBLICACAO_ANDROID.md)** - Dados técnicos e textos prontos
- **[Guia de Publicação](GUIA_PUBLICACAO_LOJAS.md)** - Passo a passo completo
- **[Gerar AAB Local](GERAR_AAB_LOCAL.md)** - Como gerar AAB sem usar EAS Build

### Textos para as Lojas
- **[Descrições](DESCRICOES_LOJAS.md)** - Títulos, descrições curtas e longas
- **[Política de Privacidade](POLITICA_PRIVACIDADE.md)** - Texto completo
- **[Termos de Uso](TERMOS_USO.md)** - Texto completo

---

## 🛠️ Scripts Úteis

### Verificação
- **[Verificar Config Web](../scripts/verificar-config-web.sh)** - Script para verificar configuração web

---

## 📋 Estrutura da Documentação

```
docs/
├── README.md                              (Este arquivo - Índice)
├── COMANDOS_RAPIDOS.md                    (Comandos mais usados)
├── RESUMO_SESSAO_CORRECOES.md             (Resumo de todas as correções)
│
├── Problemas e Soluções/
│   ├── SOLUCAO_ERRO_WEB_ADMOB.md          (Erro AdMob na web)
│   ├── COMANDOS_TESTE_WEB.md              (Comandos para testar web)
│   ├── CHECKLIST_TESTE_WEB.md             (Checklist de teste web)
│   ├── RESUMO_CORRECAO_WEB.md             (Resumo correção web)
│   ├── CORRECAO_ERRO_ANDROID_BUILDCONFIG.md (Erro BuildConfig Android)
│   └── CORRECAO_PACKAGE_NAME.md           (Correção package name)
│
├── Publicação/
│   ├── INFORMACOES_PUBLICACAO_ANDROID.md  (Dados para Google Play)
│   ├── GUIA_PUBLICACAO_LOJAS.md           (Guia completo)
│   ├── GERAR_AAB_LOCAL.md                 (Build local)
│   ├── DESCRICOES_LOJAS.md                (Textos prontos)
│   ├── POLITICA_PRIVACIDADE.md            (Política)
│   └── TERMOS_USO.md                      (Termos)
│
└── Scripts/
    └── ../scripts/verificar-config-web.sh (Verificação web)
```

---

## 🎯 Guias por Situação

### "Quero testar o app na web"
1. Leia: [Comandos para Testar Web](COMANDOS_TESTE_WEB.md)
2. Execute: `npx expo start --clear` e pressione `w`
3. Se der erro: [Solução Erro Web](SOLUCAO_ERRO_WEB_ADMOB.md)

### "Quero testar o app no Android"
1. Execute: `npm run android`
2. Se der erro de BuildConfig: [Correção BuildConfig](CORRECAO_ERRO_ANDROID_BUILDCONFIG.md)
3. Se der erro de package name: [Correção Package Name](CORRECAO_PACKAGE_NAME.md)

### "Quero publicar na Google Play Store"
1. Leia: [Guia de Publicação](GUIA_PUBLICACAO_LOJAS.md)
2. Prepare: [Informações para Publicação](INFORMACOES_PUBLICACAO_ANDROID.md)
3. Gere AAB: [Gerar AAB Local](GERAR_AAB_LOCAL.md) ou use EAS Build
4. Use textos: [Descrições](DESCRICOES_LOJAS.md)

### "Algo quebrou e não sei o que fazer"
1. Veja: [Comandos Rápidos](COMANDOS_RAPIDOS.md) - seção "Quando Algo Quebra"
2. Leia: [Resumo da Sessão](RESUMO_SESSAO_CORRECOES.md) - seção "Troubleshooting"
3. Execute: Limpar cache e reinstalar dependências

### "Quero entender o que foi feito"
1. Leia: [Resumo da Sessão](RESUMO_SESSAO_CORRECOES.md)
2. Veja problemas específicos nas seções acima

---

## 🔍 Busca Rápida

### Por Erro

| Erro | Documento |
|------|-----------|
| "Importing native-only module" | [Solução Erro Web](SOLUCAO_ERRO_WEB_ADMOB.md) |
| "Unresolved reference 'BuildConfig'" | [Correção BuildConfig](CORRECAO_ERRO_ANDROID_BUILDCONFIG.md) |
| "Package name incorreto" | [Correção Package Name](CORRECAO_PACKAGE_NAME.md) |
| "AdMob não configurado" | [Correção BuildConfig](CORRECAO_ERRO_ANDROID_BUILDCONFIG.md) |

### Por Plataforma

| Plataforma | Documentos |
|------------|------------|
| Web | [Solução Web](SOLUCAO_ERRO_WEB_ADMOB.md), [Comandos Web](COMANDOS_TESTE_WEB.md), [Checklist Web](CHECKLIST_TESTE_WEB.md) |
| Android | [Correção BuildConfig](CORRECAO_ERRO_ANDROID_BUILDCONFIG.md), [Gerar AAB](GERAR_AAB_LOCAL.md), [Publicação](GUIA_PUBLICACAO_LOJAS.md) |
| iOS | [Guia de Publicação](GUIA_PUBLICACAO_LOJAS.md) |

### Por Tarefa

| Tarefa | Documento |
|--------|-----------|
| Testar | [Comandos Rápidos](COMANDOS_RAPIDOS.md), [Checklist Web](CHECKLIST_TESTE_WEB.md) |
| Publicar | [Guia Publicação](GUIA_PUBLICACAO_LOJAS.md), [Informações](INFORMACOES_PUBLICACAO_ANDROID.md) |
| Debugar | [Resumo Sessão](RESUMO_SESSAO_CORRECOES.md), [Comandos Rápidos](COMANDOS_RAPIDOS.md) |
| Entender | [Resumo Sessão](RESUMO_SESSAO_CORRECOES.md), documentos específicos |

---

## 📊 Estatísticas da Documentação

- **Total de documentos:** 14
- **Problemas resolvidos:** 2 críticos
- **Scripts criados:** 1
- **Linhas de documentação:** ~3.000+
- **Comandos documentados:** 40+

---

## ✅ Status do Projeto

| Item | Status |
|------|--------|
| Erro Web (AdMob) | ✅ Resolvido |
| Erro Android (BuildConfig) | ✅ Resolvido |
| Package Name | ✅ Corrigido |
| AdMob Plugin | ✅ Configurado |
| Documentação | ✅ Completa |
| Pronto para Testar | ✅ SIM |
| Pronto para Publicar | ⚠️ Após testes |

---

## 🎯 Próximos Passos

1. **Testar o app:**
   - Web: `npx expo start --clear` → pressione `w`
   - Android: `npm run android`
   - iOS: `npm run ios`

2. **Substituir IDs de teste do AdMob** pelos seus IDs reais

3. **Gerar AAB** para publicação:
   ```bash
   eas build --platform android --profile production
   ```

4. **Publicar na Google Play Store** seguindo o [Guia de Publicação](GUIA_PUBLICACAO_LOJAS.md)

---

## 📞 Suporte

Se encontrar problemas não documentados:

1. Verifique o [Resumo da Sessão](RESUMO_SESSAO_CORRECOES.md)
2. Consulte [Comandos Rápidos](COMANDOS_RAPIDOS.md) - seção "Troubleshooting"
3. Leia o documento específico do problema
4. Execute o script de verificação: `./scripts/verificar-config-web.sh`

---

## 🔄 Atualizações

**Última atualização:** 14/05/2026  
**Versão do App:** 1.0.0  
**Package Name:** com.amjsolucoes.meucorre

---

## 📝 Notas

- Todos os documentos seguem as [Regras de Documentação](../AGENTS.md)
- Scripts estão em `scripts/`
- Documentação em `docs/`
- IDs do AdMob são de TESTE - substituir antes de publicar

---

**Boa sorte com o MeuCorre App! 🚀**
