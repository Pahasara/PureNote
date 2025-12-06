import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), basicSsl(), tailwindcss(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
    https: true,
  },
});
