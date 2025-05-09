import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3123,
    strictPort: true // Prevents auto-incrementing
  },
  define: {
    global: 'window',
  }
});
