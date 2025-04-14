/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            "green-color": "#006A67",
            "sgreen-color": "#03c988",
            "white-color": "#F5F7F8",
         },
      },
   },
   plugins: [],
};
