/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional Light & Dark Color Palette
        primary: {
          light: '#F5F7FA',      // Lightest background
          50: '#F8FAFC',         // Very light gray
          100: '#F1F5F9',        // Light gray
          200: '#E2E8F0',        // Light accent
          300: '#CBD5E1',        // Medium light
          400: '#94A3B8',        // Medium gray
          500: '#64748B',        // Medium (primary)
          600: '#475569',        // Dark medium
          700: '#334155',        // Dark
          800: '#1E293B',        // Very dark
          900: '#0F172A',        // Darkest
          dark: '#0A0E27',       // Darkest background
        },
        accent: {
          light: '#DBEAFE',      // Light blue accent
          DEFAULT: '#3B82F6',    // Professional blue
          dark: '#1E40AF',       // Dark blue
        },
        success: {
          light: '#DCFCE7',
          DEFAULT: '#22C55E',
          dark: '#16A34A',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      travelhub: {
        primary: {
          DEFAULT: '#06b6d4',
          600: '#0891b2',
        },
        secondary: '#06d6a0',
        accent: '#fb923c',
        hero: '#071029',
        glass: 'rgba(255,255,255,0.06)',
        surface: '#0f172a',
        muted: '#94a3b8',
      },
    },
  },
  plugins: [],
}

