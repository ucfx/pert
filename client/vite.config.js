import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: "/src",
            components: "/src/components",
            pages: "/src/pages",
            utils: "/src/utils",
            hooks: "/src/hooks",
            assets: "/src/assets",
            styles: "/src/styles",
            context: "/src/context",
            data: "/src/data",
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
