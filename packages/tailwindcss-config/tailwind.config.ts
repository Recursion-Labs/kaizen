import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
