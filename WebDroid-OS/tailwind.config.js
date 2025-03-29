/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-sans, Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif)',
        mono: 'var(--font-mono, JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace)',
        display: 'var(--font-display, Inter, Roboto, system-ui, sans-serif)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-base)',
        'btn': 'var(--radius-button)',
        'card': 'var(--radius-card)',
        'lg': 'var(--radius-large)',
        'xl': 'var(--radius-xlarge)',
      },
      colors: {
        // Semantic color tokens
        'primary': 'var(--color-primary)',
        'primary-container': 'var(--color-primary-container)',
        'on-primary': 'var(--color-on-primary)',
        'on-primary-container': 'var(--color-on-primary-container)',
        
        'secondary': 'var(--color-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        'on-secondary': 'var(--color-on-secondary)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        
        'tertiary': 'var(--color-tertiary)',
        'tertiary-container': 'var(--color-tertiary-container)',
        'on-tertiary': 'var(--color-on-tertiary)',
        'on-tertiary-container': 'var(--color-on-tertiary-container)',
        
        'error': 'var(--color-error)',
        'error-container': 'var(--color-error-container)',
        'on-error': 'var(--color-on-error)',
        'on-error-container': 'var(--color-on-error-container)',
        
        'background': 'var(--color-background)',
        'on-background': 'var(--color-on-background)',
        
        'surface': 'var(--color-surface)',
        'surface-variant': 'var(--color-surface-variant)',
        'surface-container': 'var(--color-surface-container)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface-dim': 'var(--color-surface-dim)',
        'page-background': 'var(--color-page-background)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        
        'outline': 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        
        'shadow': 'var(--color-shadow)',
        'scrim': 'var(--color-scrim)',
        'inverse-surface': 'var(--color-inverse-surface)',
        'inverse-on-surface': 'var(--color-inverse-on-surface)',
        'inverse-primary': 'var(--color-inverse-primary)',
        
        // Keep backward compatibility
        'accent': 'var(--color-tertiary)',
        'border': 'var(--color-outline-variant)',
      },
    },
  },
  plugins: [],
} 