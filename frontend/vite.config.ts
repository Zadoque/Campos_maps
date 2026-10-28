import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 43783,
    allowedHosts: ['jaunt-paradox-obsessive.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'http://localhost:43784',
        changeOrigin: true,
      },
    },
  },
  test: { environment: 'jsdom', exclude: ['tests/e2e/**', 'node_modules/**'] },
});
