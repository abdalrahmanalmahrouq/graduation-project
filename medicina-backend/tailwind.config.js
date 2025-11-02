/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        'medicina-brand': '#3d83c0',
        'medicina-brand-50': '#f0f9ff',
        'medicina-brand-500': '#3d83c0',
        'medicina-brand-600': '#0284c7',
        'medicina-brand-700': '#0369a1',
        'medicina-brand-800': '#075985',
        // Primary colors (using medicina-brand as primary)
        'primary': {
          50: '#f0f9ff',
          500: '#3d83c0',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Secondary colors (complementary to primary)
        'secondary': {
          500: '#10b981',  // Green
          600: '#059669',
          700: '#047857',
        },
      },
     
    },
  },
  plugins: [],
}

