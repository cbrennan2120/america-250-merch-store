import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://127.0.0.1:4399",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
    { name: "tablet-chromium", use: { ...devices["iPad Mini"], browserName: "chromium" } },
    { name: "large-desktop-chromium", use: { viewport: { width: 1600, height: 1000 } } }
  ],
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4399",
    url: "http://127.0.0.1:4399",
    reuseExistingServer: false
  }
});
