import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import dts from "vite-plugin-dts";


export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["lib"], exclude: "**/*.test.ts", rollupTypes: true }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.tsx"),
      fileName: "usescrolltrigger",
      name: "usescrolltrigger",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
    },
  },
});