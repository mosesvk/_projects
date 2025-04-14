/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Include jsx/tsx files
    ],
    darkMode: 'class', // Enable dark mode based on class
    theme: {
      extend: {
        // Add custom colors if needed, based on qb.html's usage
        colors: {
           // Example: map backgroundBlue if it's custom
          'backgroundBlue': '#YOUR_BLUE_COLOR_HEX', // Replace with actual color
          'backgroundGreen': '#YOUR_GREEN_COLOR_HEX', // Replace with actual color
          'capinGrey': '#YOUR_GREY_COLOR_HEX', // Replace with actual color
          // You might need to inspect the original CSS/JS to find these hex codes
        }
      },
    },
    plugins: [],
  }