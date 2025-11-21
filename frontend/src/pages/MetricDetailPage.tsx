import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../auth/authStore';
import { fetchMetricById, fetchDataPoints, addDataPoint } from '../api/metrics';

export function MetricDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: metric } = useQuery({
    queryKey: ['metric', id],
    queryFn: () => fetchMetricById(token!, id!),
  });

  const { data: points } = useQuery({
    queryKey: ['dataPoints', id],
    queryFn: () => fetchDataPoints(token!, id!),
  });

  const [form, setForm] = useState({
    value: '',
    recordedAt: '',
    note: '',
  });

  const addMutation = useMutation({
    mutationFn: () =>
      addDataPoint(token!, id!, {
        value: parseFloat(form.value),
        recordedAt: form.recordedAt || undefined,
        note: form.note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['dataPoints', id]);
      setForm({ value: '', recordedAt: '', note: '' });
    },
  });

  if (!metric) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h1>{metric.name}</h1>
      <p>{metric.description}</p>

      <section style={{ marginTop: 30, marginBottom: 50 }}>
        <h2>Add Data Point</h2>

        <form
          onSubmit={e => {
            e.preventDefault();
            addMutation.mutate();
          }}
        >
          <input
            placeholder={`Value (${metric.unit})`}
            value={form.value}
            onChange={e => setForm({ ...form, value: e.target.value })}
          />
          <input
            placeholder="Recorded at (optional ISO string)"
            value={form.recordedAt}
            onChange={e => setForm({ ...form, recordedAt: e.target.value })}
            style={{ marginLeft: 8 }}
          />
          <input
            placeholder="Note (optional)"
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            style={{ marginLeft: 8 }}
          />

          <button type="submit" style={{ marginLeft: 8 }}>
            Add
          </button>
        </form>
      </section>

      <section>
        <h2>Data Points</h2>

        {!points?.length && <p>No data points yet.</p>}

        <ul>
          {points?.map(p => (
            <li key={p.id} style={{ marginBottom: 8 }}>
              {p.value} ({metric.unit}) — {new Date(p.recordedAt).toLocaleString()}
              {p.note && ` — ${p.note}`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
