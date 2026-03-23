import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
<<<<<<< HEAD
    port: 3010,
  },
});
=======
    port: 5173,
  },
});
>>>>>>> 53e77e8ca40df7d6d368ca3ae92eb5aaf03b42d1
