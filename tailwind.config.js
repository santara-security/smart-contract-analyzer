module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["animate-[shine_5s_linear_infinite]"],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '100%' },
          '100%': { backgroundPosition: '-100%' },
        },
        testfade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shine: "shine 5s linear infinite",
        testfade: "testfade 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};