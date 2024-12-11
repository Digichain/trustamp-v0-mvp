import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add polyfills for Node.js built-in modules
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      events: 'events',
      path: 'path-browserify',
      util: 'util',
      buffer: 'buffer',
    },
  },
  define: {
    'process.env': {},
    global: {},
  },
  build: {
    rollupOptions: {
      external: ['dotenv/config'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
}));