    /** @type {import('tailwindcss').Config} */
    module.exports = {
        content: [
          "./src/**/*.{js,jsx,ts,tsx}", // Scan all your component files
        ],
        theme: {
          extend: {
            colors: {
              // Add your specific brand colors from the prototype
              'brand-green': '#4CAF50',
              'brand-orange': '#FF9800',
            },
          },
        },
        plugins: [],
      }
      