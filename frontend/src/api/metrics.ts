import { apiFetch } from './client';

export type Metric = {
  id: string;
  name: string;
  unit: string;
  category?: string;
  description?: string;
  createdAt: string;
};

export type DataPoint = {
  id: string;
  value: number;
  recordedAt: string;
  note?: string;
};

export async function fetchMetrics(token: string) {
  return apiFetch<Metric[]>('/metrics', {}, token);
}

export async function createMetric(
  token: string,
  body: {
    name: string;
    unit: string;
    category?: string;
    description?: string;
  }
) {
  return apiFetch<Metric>(
    '/metrics',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}

export async function fetchMetricById(token: string, id: string) {
  return apiFetch<Metric>(`/metrics/${id}`, {}, token);
}

export async function fetchDataPoints(token: string, id: string) {
  return apiFetch<DataPoint[]>(`/metrics/${id}/datapoints`, {}, token);
}

export async function addDataPoint(
  token: string,
  id: string,
  body: {
    value: number;
    recordedAt?: string;
    note?: string;
  }
) {
  return apiFetch<DataPoint>(
    `/metrics/${id}/datapoints`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}
