import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        // Kaizen Brand Color Palette
        kaizen: {
          // Light theme colors
          'light-bg': '#F5F9F8',      // Light background/paper
          'light-text': '#575669',    // Primary text
          'light-muted': '#A1A2AB',   // Secondary text, borders
          
          // Dark theme colors
          'dark-bg': '#252330',       // Dark background
          'dark-surface': '#3B3A4A',  // Dark surface/cards
          'dark-text': '#F5F9F8',     // Light text on dark
          'dark-muted': '#A1A2AB',    // Muted text on dark
          
          // Accent colors
          'accent': '#595168',        // Dusty purple accent
          'accent-light': '#A1A2AB',  // Light accent variant
          'accent-dark': '#3B3A4A',   // Dark accent variant
          
          // Semantic colors
          'primary': '#575669',       // Primary brand color
          'secondary': '#A1A2AB',     // Secondary elements
          'surface': '#F5F9F8',       // Surface/card backgrounds
          'border': '#A1A2AB',        // Border color
          'muted': '#A1A2AB',         // Muted text and elements
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
