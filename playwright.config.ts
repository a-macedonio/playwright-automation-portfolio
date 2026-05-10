// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,

  use: {
    baseURL: 'https://demo.realworld.show',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'ui',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: {
        baseURL: 'https://demo.realworld.show',
      },
    },
    {
      name: 'api',
      workers: 1,
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: 'https://api.realworld.show/api/',
      },
    },
  ],

  retries: 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }]
  ],
});