import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        valorant: {
          red: '#FF4655',
          black: '#0F1923',
          gray: '#1C252C',
        },
      },
    },
  },
  plugins: [],
};

export default config;
