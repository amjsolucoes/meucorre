---
inclusion: always
---

# 📝 Regras de Documentação

## 📁 Organização de Arquivos

### Arquivos de Documentação (.md)

**SEMPRE criar arquivos de documentação/instrução dentro da pasta `docs/`**

#### ✅ Correto:
```
docs/NOME_DO_ARQUIVO.md
docs/GUIA_FEATURE.md
docs/INSTRUCOES_SETUP.md
```

#### ❌ Errado:
```
NOME_DO_ARQUIVO.md (na raiz)
```

### Exceções (podem ficar na raiz):
- `README.md` - Documentação principal do projeto
- `AGENTS.md` - Instruções para agentes de IA
- `CHANGELOG.md` - Histórico de mudanças (se existir)
- `LICENSE.md` - Licença do projeto (se existir)

### Scripts (.sh, .py, .js)

**SEMPRE criar scripts dentro da pasta `scripts/`**

#### ✅ Correto:
```
scripts/nome-do-script.sh
scripts/setup.py
scripts/build.js
```

## 📋 Padrões de Nomenclatura

### Arquivos de Documentação:
- Use UPPER_CASE com underscores: `NOME_ARQUIVO.md`
- Seja descritivo: `SOLUCAO_PROBLEMA_X.md`
- Use prefixos quando relevante:
  - `GUIA_` - Para guias passo a passo
  - `SETUP_` - Para instruções de configuração
  - `TROUBLESHOOTING_` - Para resolução de problemas
  - `CHECKLIST_` - Para listas de verificação

### Scripts:
- Use kebab-case: `nome-do-script.sh`
- Seja descritivo sobre a ação: `rebuild-icone.sh`

## 🎯 Quando Criar Documentação

Crie arquivos de documentação quando:
- Explicar um processo complexo
- Documentar uma solução para um problema
- Criar guias passo a passo
- Registrar decisões técnicas importantes
- Fornecer instruções de setup/configuração
- Criar checklists de verificação

## 📝 Estrutura Recomendada

```markdown
# 🎯 Título Claro e Objetivo

## 📋 Contexto
Breve explicação do que este documento cobre

## ✅ Passos / Instruções
1. Primeiro passo
2. Segundo passo
3. Terceiro passo

## 🐛 Troubleshooting
Problemas comuns e soluções

## 📚 Referências
Links úteis ou documentação relacionada
```

## 🔄 Manutenção

- Mantenha a documentação atualizada
- Remova documentos obsoletos
- Consolide documentos relacionados quando apropriado
- Use links relativos entre documentos: `[Ver guia](./OUTRO_GUIA.md)`
