import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D4F5C', light: '#1A6B7A' },
        accent: { DEFAULT: '#7BC67A', dark: '#4C8A4B' },
        surface: '#F5F7F8',
        border: '#E2E8EA',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7F85',
        'text-hint': '#A0B0B5',
      },
      fontFamily: {
        display: ['var(--font-sora)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-jakarta)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;
