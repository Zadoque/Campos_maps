import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:43783',
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:43783',
      reuseExistingServer: true,
    },
    {
      command: 'mvn spring-boot:run --file ../backend/pom.xml',
      url: 'http://localhost:43784/api/routes/health',
      reuseExistingServer: true,
    },
  ],
  timeout: 30000,
});
