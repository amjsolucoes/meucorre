export const Theme = {
  colors: {
    background: '#FFFFFF', // Clean pure white per designer.md rule 10
    white: '#FFFFFF',
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7F85',
      muted: '#A0B0B5',
    },
    accent: {
      ongoing: '#0D4F5C', // Teal escuro para neutro/em andamento
      inProcess: '#F0A500', // Alerta/Aviso
      completed: '#7BC67A', // Verde Lima para concluído/ganho
      cancelled: '#E05555', // Vermelho Suave para gasto/cancelado
    },
    primary: '#0D4F5C', // Teal escuro
    secondary: '#7BC67A', // Verde Lima
  },
  radius: {
    card: 14, // var(--radius-lg) in designer.md
    button: 999, // var(--radius-full) in designer.md
    tabBar: 20, // var(--radius-xl) in designer.md
  }
};

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#FFFFFF',
    tint: '#0D4F5C',
    icon: '#6B7F85',
    tabIconDefault: '#6B7F85',
    tabIconSelected: '#0D4F5C',
  },
  dark: {
    text: '#FFFFFF',
    background: '#151718',
    tint: '#7BC67A',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#7BC67A',
  },
};
