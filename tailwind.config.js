/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         keyframes: {
            marquee: {
               "100%": { transform: "translateX(100%)" },
               "0%": { transform: "translateX(-100%)" },
            },
         },
         animation: {
            marquee: "marquee 10s linear infinite",
         },
         colors: {
            "green-color": "#006A67",
            "sgreen-color": "#03c988",
            "white-color": "#F5F7F8",
         },
         container: {
            center: true,
            padding: "1.5rem",
            screens: {
               sm: "100%",
               md: "100%",
               lg: "100%",
               xl: "1200px",
            },
         },
      },
   },
   plugins: [],
};
