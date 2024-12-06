/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          primary: 'var(--primary-color)',
          secondary: 'var(--secondary-color)',
          background: 'var(--background-color)',
          text: 'var(--text-color)',
        }
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'courier': ['"Courier New"', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
};
