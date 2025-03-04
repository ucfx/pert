/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        colors: {
            purple: {
                50: "#F0F0F5",
                100: "#D5D5E2",
                200: "#BABACF",
                300: "#9F9FBC",
                400: "#8484A9",
                500: "#696996",
                600: "#4251ab",
                700: "#3F3F5A",
                800: "#2A2A3C",
                900: "#15151E",
            },
            red: {
                50: "#FFEBEE",
                100: "#FFCDD2",
                200: "#EF9A9A",
                300: "#E57373",
                400: "#EF5350",
                500: "#F44336",
                600: "#E53935",
                700: "#D32F2F",
                800: "#C62828",
                900: "#B71C1C",
            },
            blue: {
                50: "#E3F2FD",
                100: "#BBDEFB",
                200: "#90CAF9",
                300: "#64B5F6",
                400: "#42A5F5",
                500: "#2196F3",
                600: "#1E88E5",
                700: "#1976D2",
                800: "#1565C0",
                900: "#0D47A1",
            },
        },
    },
    plugins: [],
};
