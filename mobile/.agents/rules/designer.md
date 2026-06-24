---
trigger: always_on
---

# Design System Rules — Instant Cash App
> Documento de referência para replicar o tema visual do aplicativo Instant Cash em novos layouts.

---

## 1. PALETA DE CORES

### Cores Primárias
```
--color-primary:        #0D4F5C   /* Teal escuro — fundo de headers, botões principais */
--color-primary-light:  #1A6B7A   /* Teal médio — hover states, gradientes */
--color-accent:         #7BC67A   /* Verde lima — logo, ícone de destaque, badge */
```

### Cores Neutras
```
--color-background:     #FFFFFF   /* Fundo principal das telas */
--color-surface:        #F5F7F8   /* Cards, campos de input, áreas de seção */
--color-surface-dark:   #0D4F5C   /* Superfícies invertidas (ex: card "Welcome Back") */
--color-border:         #E2E8EA   /* Bordas suaves de inputs e cards */
--color-divider:        #D0D9DC   /* Separadores de seção */
```

### Cores de Texto
```
--color-text-primary:   #1A1A1A   /* Títulos e texto principal */
--color-text-secondary: #6B7F85   /* Subtítulos, labels, textos auxiliares */
--color-text-inverse:   #FFFFFF   /* Texto sobre fundos escuros */
--color-text-link:      #0D4F5C   /* Links e textos clicáveis */
--color-text-hint:      #A0B0B5   /* Placeholder de inputs */
```

### Cores de Estado
```
--color-success:        #7BC67A   /* Confirmação, check */
--color-error:          #E05555   /* Erros de validação */
--color-warning:        #F0A500   /* Alertas */
--color-disabled:       #C5D0D3   /* Botões e inputs desabilitados */
```

---

## 2. TIPOGRAFIA

### Família de Fontes
- **Display / Títulos:** `DM Sans` (peso 600–700) — moderna, humanista, boa legibilidade em telas pequenas
- **Corpo / Interface:** `DM Sans` (peso 400–500) — manter consistência com fonte única, variando apenas o peso
- **Fallback:** `system-ui, -apple-system, sans-serif`

> A fonte utilizada no app tem características geométricas com terminações suaves, similar a DM Sans ou Plus Jakarta Sans.

### Escala Tipográfica (Mobile-first)
```
--text-xs:    11px / line-height: 1.4   /* Legendas, microtextos, badges */
--text-sm:    13px / line-height: 1.5   /* Labels de campos, textos auxiliares */
--text-base:  15px / line-height: 1.6   /* Corpo de texto padrão */
--text-md:    17px / line-height: 1.5   /* Subtítulos, itens de lista */
--text-lg:    20px / line-height: 1.4   /* Títulos de seção */
--text-xl:    24px / line-height: 1.3   /* Títulos de tela (H1) */
--text-2xl:   28px / line-height: 1.2   /* Valores monetários em destaque */
--text-3xl:   34px / line-height: 1.1   /* Valores grandes (ex: limite de crédito) */
```

### Pesos
```
--font-regular:   400
--font-medium:    500
--font-semibold:  600
--font-bold:      700
```

---

## 3. ESPAÇAMENTO & LAYOUT

### Grid e Margens
```
--screen-padding-h:   20px    /* Margem horizontal padrão da tela */
--screen-padding-v:   24px    /* Margem vertical padrão (topo/bottom) */
--section-gap:        24px    /* Espaço entre seções */
--component-gap:      16px    /* Espaço entre componentes dentro de seção */
--item-gap:           12px    /* Espaço entre itens de lista */
--inner-padding:      16px    /* Padding interno de cards e inputs */
```

### Largura de Conteúdo
- Tela mobile: `375px` base (design)
- Conteúdo centralizado com `padding: 0 20px`
- Largura máxima de componentes: `100%` (full-width na maioria)

---

## 4. BORDAS & SOMBRAS

### Border Radius
```
--radius-sm:    6px    /* Inputs pequenos, tags */
--radius-md:    10px   /* Inputs padrão, cards pequenos */
--radius-lg:    14px   /* Cards principais, modais */
--radius-xl:    20px   /* Cartões destacados, containers de seção */
--radius-full:  999px  /* Botões pill, badges arredondados */
```

### Sombras
```
--shadow-sm:    0 1px 4px rgba(13, 79, 92, 0.08)
--shadow-md:    0 4px 12px rgba(13, 79, 92, 0.12)
--shadow-lg:    0 8px 24px rgba(13, 79, 92, 0.16)
--shadow-card:  0 2px 8px rgba(0, 0, 0, 0.06)
```

---

## 5. COMPONENTES

### 5.1 Botão Primário (CTA Principal)
```
Background:     var(--color-primary)        /* #0D4F5C */
Text:           var(--color-text-inverse)   /* #FFFFFF */
Font:           15–16px, font-weight: 600
Border-radius:  var(--radius-full)          /* pill shape */
Height:         52px
Width:          100% (full-width)
Padding:        0 24px

Estado Hover/Active:
  Background:   var(--color-primary-light)
  Transform:    scale(0.99)

Estado Disabled:
  Background:   var(--color-disabled)
  Cursor:       not-allowed
```

### 5.2 Botão Secundário / Outline
```
Background:     transparent
Border:         1.5px solid var(--color-primary)
Text:           var(--color-primary)
Font:           15–16px, font-weight: 600
Border-radius:  var(--radius-full)
Height:         52px
Width:          100%
```

### 5.3 Campo de Input (Text Field)
```
Background:     var(--color-surface)        /* #F5F7F8 */
Border:         1px solid var(--color-border)
Border-radius:  var(--radius-md)            /* 10px */
Height:         52px
Padding:        0 16px
Font:           15px, font-weight: 400
Color:          var(--color-text-primary)
Placeholder:    var(--color-text-hint)

Estado Focus:
  Border-color: var(--color-primary)
  Background:   #FFFFFF
  Box-shadow:   0 0 0 3px rgba(13, 79, 92, 0.1)

Estado Error:
  Border-color: var(--color-error)
```

### 5.4 Dropdown / Select
```
Mesmo estilo do Input padrão +
Ícone chevron-down alinhado à direita (16px, cor: --color-text-secondary)
```

### 5.5 Card
```
Background:     var(--color-background)     /* #FFFFFF */
Border-radius:  var(--radius-lg)            /* 14px */
Padding:        16px 20px
Box-shadow:     var(--shadow-card)
Border:         1px solid var(--color-border)  /* opcional, sutil */
```

### 5.6 Card Invertido (Dark Card)
```
Background:     var(--color-surface-dark)   /* #0D4F5C */
Border-radius:  var(--radius-xl)            /* 20px */
Padding:        20px
Text:           var(--color-text-inverse)
```

### 5.7 List Item (Menu / Navegação)
```
Layout:         flex, align-items: center, justify-content: space-between
Padding:        14px 0
Border-bottom:  1px solid var(--color-divider)
Icon:           20px, cor var(--color-primary)
Text:           15px, font-weight: 500, var(--color-text-primary)
Chevron:        12px, cor var(--color-text-secondary)
```

### 5.8 Progress Indicator (Steps / Onboarding)
```
Dot inativo:    8px × 8px, border-radius: 50%, background: --color-border
Dot ativo:      24px × 8px, border-radius: 4px, background: --color-primary
Gap entre dots: 6px
```

### 5.9 Progress Bar (Formulário em etapas)
```
Track:          height: 4px, background: --color-border, border-radius: 2px
Fill:           background: --color-primary, border-radius: 2px
Transition:     width 0.3s ease
```

### 5.10 Badge / Chip
```
Background:     rgba(13, 79, 92, 0.1)
Color:          var(--color-primary)
Font:           11px, font-weight: 600
Padding:        4px 10px
Border-radius:  var(--radius-full)
```

---

## 6. ESTRUTURA DE TELA

### Header de Navegação
```
Height:         56px
Background:     var(--color-background)
Layout:         flex, align-items: center
Logo/Title:     centralizado
Back button:    esquerda (← icon, 20px, cor --color-primary)
Action icon:    direita (help/notification, 20px)
Border-bottom:  1px solid var(--color-divider) (opcional)
```

### Bottom Navigation Bar
```
Height:         64px + safe-area-inset-bottom
Background:     var(--color-background)
Border-top:     1px solid var(--color-divider)
Layout:         flex, justify-content: space-around
Icon ativo:     var(--color-primary), 22px
Icon inativo:   var(--color-text-secondary), 22px
Label:          10px, font-weight: 500
```

### Safe Areas (Mobile)
```
Padding-top:    status bar height (geralmente 44–54px)
Padding-bottom: home indicator (34px no iOS, variável no Android)
```

---

## 7. ICONOGRAFIA

- **Estilo:** Line icons (stroke), peso 1.5–2px
- **Tamanhos:** 20px (interface), 24px (ações primárias), 40–48px (ilustrações de tela)
- **Cor padrão:** `var(--color-primary)` (#0D4F5C)
- **Cor secundária:** `var(--color-text-secondary)` (#6B7F85)
- **Bibliotecas recomendadas:** Lucide Icons, Phosphor Icons, Heroicons

### Ilustrações (Onboarding)
```
Estilo:         Outline/line art, monocromático em --color-primary
Fundo:          Círculo ou shape suave em rgba(13, 79, 92, 0.08)
Tamanho:        120–140px de altura na área de ilustração
```

---

## 8. ANIMAÇÕES & TRANSIÇÕES

```
--transition-fast:    150ms ease
--transition-base:    250ms ease
--transition-slow:    400ms ease-in-out

/* Transição de tela (slide) */
Enter:  translateX(100%) → translateX(0), duration: 300ms, ease-out
Exit:   translateX(0) → translateX(-30%), duration: 300ms, ease-in

/* Fade de elementos */
Opacity: 0 → 1, duration: 200ms

/* Botão press */
Transform: scale(0.97), duration: 100ms
```

---

## 9. ESTADOS ESPECIAIS

### Tela de Splash / Loading
```
Background:     var(--color-primary)          /* Teal escuro */
Logo:           Centralizado, 80px × 80px
Logo bg:        var(--color-accent) (#7BC67A), border-radius: 20px
```

### Empty State
```
Ícone:          48px, cor --color-text-hint
Título:         17px, semibold, --color-text-primary
Descrição:      14px, regular, --color-text-secondary
```

### Checkbox / Toggle de Permissão
```
Unchecked:      border: 2px solid --color-border, background: transparent
Checked:        background: --color-primary, checkmark branco
Border-radius:  4px
Tamanho:        20px × 20px
```

---

## 10. FORMULÁRIOS MULTI-STEP

### Indicador de Progresso de Etapa
```
Posição:        abaixo do header, acima do título
Cor ativa:      var(--color-primary)
Cor inativa:    var(--color-border)
```

### Agrupamento de campos
```
Cada seção de campos:  gap de 12px entre inputs
Entre grupos distintos: gap de 20px
Label acima do campo:  8px abaixo do label, 12px font-size, --color-text-secondary
```

---

## 11. VALORES FINANCEIROS

### Exibição de Valores Monetários
```
Símbolo (₦):   text-xl (20px), font-weight: 500, alinhado ao topo do valor
Valor:          text-3xl (34px), font-weight: 700
Cor:            var(--color-text-primary) ou --color-text-inverse (em dark cards)
```

### Cards de Limite
```
Label:          11px, font-weight: 500, --color-text-secondary
Valor:          28–34px, font-weight: 700
Background:     var(--color-surface-dark) com gradiente sutil
```

---

## 12. REGRAS GERAIS DE CONSISTÊNCIA

1. **Sempre usar border-radius pill (`999px`) para botões de ação primária.**
2. **Inputs nunca têm label flutuante — usar label estático acima ou placeholder.**
3. **Toda tela tem padding horizontal de 20px.**
4. **Espaçamento vertical entre seções: mínimo 24px.**
5. **Ícones de navegação: sempre teal escuro (`--color-primary`) quando ativo.**
6. **Não usar cores vibrantes além do verde-lima (`--color-accent`) como destaque secundário.**
7. **Texto de aviso legal / política: sempre em --color-text-secondary, font-size mínimo 11px.**
8. **Proibido usar contornos pretos, bordas escuras ou outlines retrôs (`border border-border`) em cards, botões, badges ou inputs.**
9. **Usar sombras elegantes (`shadow-sm`, `shadow-md`, `shadow-lg`) e contrastes suaves de fundo (ex: `bg-surface` ou `bg-white`) para delimitar e elevar elementos de forma moderna e premium.**
10. **Botão primário: sempre `width: 100%` na parte inferior da tela.**
11. **Fundo de tela: sempre branco puro `#FFFFFF` — nunca off-white acinzentado.**

