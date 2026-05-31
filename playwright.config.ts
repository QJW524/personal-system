import { defineConfig, devices } from '@playwright/test';

const isCI = process.env.CI === 'true';
const devCommand =
  process.platform === 'win32' ? 'npm.cmd run dev -- --port 3001' : 'npm run dev -- --port 3001';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: devCommand,
    url: 'http://localhost:3001/login',
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
