/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
      },
      colors: {
        ink: '#2A2A2A', // Softer off-black for elegant reading
        paper: '#F4F1EA', // Warm, authentic old paper color (not too white)
        'paper-desk': '#E8E5DF', // The desk background - provides contrast to the paper
        quiet: {
          sage: '#EBEFE9', // Extremely pale sage
          sand: '#F4F1EA', // Very pale sand
          rose: '#F2EBEB', // Whisper of rose
          fog:  '#EBECEF', // Mist-like gray blue
          taupe: '#DCD8D3', // Muted warm gray
          border: '#E8E8E8',
        }
      },
      boxShadow: {
        'paper': '0 2px 10px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.01)',
        'paper-hover': '0 8px 20px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}