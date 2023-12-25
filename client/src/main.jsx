import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "context/AuthContext";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
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
    },
});

import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
    //     <React.StrictMode>
    <AuthProvider>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </AuthProvider>
    //     </React.StrictMode>
);
