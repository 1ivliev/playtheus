import { pushTimeseries } from 'prometheus-remote-write';

type TimeseriesMetric = {
  name: string;
  labels: Record<string, string>;
  value: number;
};

export async function sendTimeseriesMetrics(metrics: TimeseriesMetric[]) {
  const timeseries = metrics.map(({ name, labels, value }) => ({
    labels: {
      __name__: name,
      ...Object.fromEntries(
        Object.entries(labels).map(([k, v]) => [k, String(v)])
      ),
    },
    samples: [{
      value,
      timestamp: Date.now(),
    }],
  }));

  await pushTimeseries(timeseries, {
    url: process.env.PROMETHEUS_REMOTE_WRITE_URL || 'http://localhost:9090/api/v1/write',
  });
}
