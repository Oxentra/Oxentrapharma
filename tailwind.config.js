/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  safelist: [
    'hidden',
    'flex',
    'block',
    'rotate-180',
    'bg-emerald-600',
    'bg-blue-50',
    'text-brand-blue',
    'border-pink-500',
    'text-pink-600',
    'bg-pink-50',
    'border-red-500',
    'text-red-600',
    'bg-red-50',
    'border-emerald-500',
    'text-emerald-600',
    'bg-emerald-50',
    'border-purple-500',
    'text-purple-600',
    'bg-purple-50',
    'border-blue-500',
    'text-blue-600',
    'bg-blue-50'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#005B82',
          orange: '#F07D00',
          dark: '#002B3E',
          lightBlue: '#0284c7',
          gray: '#475569',
          navy: '#0F172A',
          slate: '#64748B',
          border: '#E7EBF0',
          bgLight: '#FAFBFC',
          pink: '#D91B5C',
          green: '#23C483',
          cyan: '#3AA9D8',
          red: '#EF4444',
          darkBlue: '#005E8A'
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Poppins"', 'sans-serif'],
        display: ['"Inter"', '"Poppins"', 'sans-serif'],
        inter: ['"Inter"', '"SF Pro Display"', '"Manrope"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
