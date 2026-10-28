import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 43783 },
  test: { environment: 'jsdom', exclude: ['tests/e2e/**', 'node_modules/**'] },
});
