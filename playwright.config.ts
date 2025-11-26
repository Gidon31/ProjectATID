import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://atid.store/',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { open: 'never' }]
  ]
});
