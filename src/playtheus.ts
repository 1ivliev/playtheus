import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { addCounterMetric, addGaugeMetric, getAllBufferedMetrics } from './metricsBuffer';
import { sendTimeseriesMetrics } from './remoteWrite';

export default class PrometheusReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const project = (test as any).project?.name || 'unknown';
    const status = result.status;
    const durationSec = result.duration / 1000;

    // Тестов по статусам
    addCounterMetric('playwright_test_total', {
      status,
      project,
    });

    // Продолжительность
    addGaugeMetric('playwright_test_duration_seconds', {
      test: test.title,
      status,
      project,
    }, durationSec);
  }

  async onEnd() {
    const metrics = getAllBufferedMetrics();
    await sendTimeseriesMetrics(metrics);
    console.log(`📤 Pushed ${metrics.length} metrics to Prometheus`);
  }
}
