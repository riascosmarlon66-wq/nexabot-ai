import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        typing: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '80px 80px' },
        },
        shine: {
          '0%': { transform: 'translateX(-130%) skewX(-20deg)' },
          '100%': { transform: 'translateX(130%) skewX(-20deg)' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s linear infinite alternate',
        typing: 'typing 1s ease-in-out infinite',
        marquee: 'marquee 22s linear infinite',
        'grid-pan': 'grid-pan 28s linear infinite',
        shine: 'shine 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
