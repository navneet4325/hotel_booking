module.exports = {
  content: [
    './resources/views/**/*.blade.php',
    './resources/js/**/*.{js,jsx,ts,tsx}',
    './resources/css/app.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Sora', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif',
          'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji',
        ],
        display: [
          'Space Grotesk', 'Sora', 'ui-sans-serif', 'system-ui', 'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          light: '#60a5fa',
          dark: '#1e40af',
        },
        accent: '#fbbf24',
        background: '#f8fafc',
        card: '#fff',
        sidebar: '#f1f5f9',
      },
      borderRadius: {
        '3xl': '2rem',
      },
      boxShadow: {
        xl: '0 10px 32px 0 rgba(37,99,235,0.10)',
      },
    },
  },
  plugins: [require('tw-animate-css')],
};
