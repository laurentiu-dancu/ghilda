/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#f7f3ed',
          100: '#e8dfd3',
          200: '#d4c3ae',
          300: '#bca089',
          400: '#a68469',
          500: '#8b6d52',
          600: '#735a44',
          700: '#5c4736',
          800: '#44352a',
          900: '#2d241c',
        },
        forest: {
          50: '#f3f7ed',
          100: '#e1ebd3',
          200: '#c5d8ae',
          300: '#a3c089',
          400: '#85aa69',
          500: '#698f52',
          600: '#557544',
          700: '#425c36',
          800: '#31442a',
          900: '#212d1c',
        },
      },
      backgroundImage: {
        'texture': "url('https://images.pexels.com/photos/4737484/pexels-photo-4737484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}