// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',     // Calm blue
        background: '#f9fafb',  // Light gray background
        card: '#ffffff',
        text: '#1f2937',        // Dark gray text
      },
      fontSize: {
        base: '1.125rem',   // 18px for readability
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
