type MetricKey = string;

const buffer = new Map<MetricKey, { name: string; labels: Record<string, string>; value: number }>();

function labelsToKey(name: string, labels: Record<string, string>) {
  const sorted = Object.entries(labels).sort().map(([k, v]) => `${k}=${v}`);
  return `${name}|${sorted.join(',')}`;
}

export function addCounterMetric(name: string, labels: Record<string, string>, inc: number = 1) {
  const key = labelsToKey(name, labels);
  const existing = buffer.get(key);

  if (existing) {
    existing.value += inc;
  } else {
    buffer.set(key, { name, labels, value: inc });
  }
}

export function addGaugeMetric(name: string, labels: Record<string, string>, value: number) {
  const key = labelsToKey(name, labels);
  buffer.set(key, { name, labels, value });
}

export function getAllBufferedMetrics() {
  return Array.from(buffer.values());
}
