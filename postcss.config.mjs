export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "react-strict-dom/postcss-plugin": {
      include: ["src/**/*.{js,jsx,mjs,ts,tsx}"],
    },
  },
};
