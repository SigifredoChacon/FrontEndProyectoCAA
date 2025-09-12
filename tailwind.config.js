/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            pantone: {
                blue: "#002855", // Azul oscuro (Pantone 295C)
                red: "#EF3340",  // Rojo (Pantone 032C)
            },
        },
    },
  },
  plugins: [],
};

