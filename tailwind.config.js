/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        ppg: {
          50: '#eef4fb',
          100: '#d6e4f5',
          200: '#b3cdea',
          300: '#84addb',
          400: '#4f87c6',
          500: '#2b6cb0',
          600: '#1e5494',
          700: '#1a4677',
          800: '#193d63',
          900: '#173454',
        },
      },
      fontSize: {
        body: ['17px', { lineHeight: '1.8' }],
        'body-mobile': ['16px', { lineHeight: '1.8' }],
      },
    },
  },
  plugins: [],
};
