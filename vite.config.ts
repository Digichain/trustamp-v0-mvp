import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

console.log("Loading Vite configuration...");

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
    global: 'globalThis',
    'global.Buffer': ['buffer', 'Buffer'],
  },
  build: {
    rollupOptions: {
      external: ['dotenv/config'],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    },
    include: [
      'buffer',
      'crypto-browserify',
      'events',
      'stream-browserify',
      'path-browserify',
      'util'
    ]
  },
}));