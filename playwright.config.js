const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  use: { browserName: 'chromium', channel: 'msedge', baseURL: 'http://127.0.0.1:4173' },
  webServer: { command: 'node tests/server.cjs', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
