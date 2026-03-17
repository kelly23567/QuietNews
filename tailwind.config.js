/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Quicksand"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      colors: {
        primary: '#4A4A4A', // Soft charcoal
        secondary: '#FDFBF7', // Paper white
        accent: '#D4C4B7', // Warm beige accent
        morandi: {
          sage: '#A3B5A5', // Soft dusty green
          rose: '#DBCBCB', // Dusty pink
          taupe: '#B9ADA2', // Warm grey-brown
          fog: '#9BA9B0', // Blue-grey
          sand: '#E5DDD0', // Light beige
          clay: '#C8B6A6', // Reddish brown
          oat: '#F0EAD6', // Creamy white
          linen: '#EAE6DA', // Textured white
        },
        paper: '#FDFBF7',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'paper-float': 'paperFloat 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        paperFloat: {
          '0%, 100%': { transform: 'rotate(-1deg) translateY(0)' },
          '50%': { transform: 'rotate(1deg) translateY(-5px)' },
        }
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRkRGQkY3Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNDQ0MiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')",
        'washi-tape': "linear-gradient(45deg, rgba(255,255,255,0.8) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.8) 75%, transparent 75%, transparent)",
      },
      boxShadow: {
        'sticker': '2px 2px 5px rgba(0,0,0,0.1)',
        'polaroid': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}