/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D4F5C',
          light: '#1A6B7A',
        },
        accent: '#7BC67A',
        border: '#E2E8EA',
        surface: {
          DEFAULT: '#F5F7F8',
          dark: '#0D4F5C',
        },
        divider: '#D0D9DC',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7F85',
        'text-inverse': '#FFFFFF',
        'text-hint': '#A0B0B5',
        success: '#7BC67A',
        error: '#E05555',
        warning: '#F0A500',
        disabled: '#C5D0D3',
        // Preserve some previous configurations
        'soft-dark': '#2D3436',
        gray: {
          900: '#2D3436',
        }
      }
    },
  },
  plugins: [],
}
