# Headless-browser test runner for the guide-validation harness.
# The Playwright base image ships the matching browser binaries, so the only
# dependency to install is @playwright/test itself (pinned in package.json).
FROM mcr.microsoft.com/playwright:v1.49.0-noble
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
CMD ["npx", "playwright", "test"]
