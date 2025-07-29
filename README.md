# 📊 Playwright Prometheus Remote Write Reporter

A custom [Playwright](https://playwright.dev/) reporter that sends test metrics directly to [Prometheus](https://prometheus.io/) using the Remote Write API.

Useful for teams who want to **monitor E2E test health in Grafana**, track durations, success/failure counts, and integrate testing into observability dashboards.

---

## ✨ Features

- Sends metrics from Playwright test runs to Prometheus Remote Write.
- Tracks test duration, total runs, pass/fail counts.
- Can be visualized in Grafana (or any Prometheus-compatible tool).
- Lightweight and easy to integrate.

---

## 📦 Installation

```bash
npm install --save-dev playtheus
```

Make sure `@playwright/test` is installed in your project (peer dependency).

---

## 🛠 Usage

Update your `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['playtheus']
  ]
});
```

---

## 📈 Metrics

This reporter sends the following metrics:

| Metric Name                       | Type     | Labels         | Description                          |
|----------------------------------|----------|----------------|--------------------------------------|
| `playwright_test_duration_seconds` | `gauge` | `test`, `status` | Duration of each test in seconds     |
| `playwright_test_total`            | `counter` | `status`       | Total number of tests per status     |

Example in PromQL:

```promql
avg(playwright_test_duration_seconds) by (status)
sum(increase(playwright_test_total[5m])) by (status)
```

---

## 🔒 Configuration

| Option           | Required | Description                                  |
|------------------|----------|----------------------------------------------|
| `PROMETHEUS_REMOTE_WRITE_URL` | ✅       | Full Prometheus remote write endpoint URL    |

---

## 📝 License

MIT — use it freely in commercial or open-source projects.
