import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/authStore';
import { createMetric, fetchMetrics, type Metric } from '../api/metrics';

export function DashboardPage() {
  const { token, email, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => fetchMetrics(token!),
  });

  const [form, setForm] = useState({
    name: '',
    unit: '',
    category: '',
    description: '',
  });

  const createMutation = useMutation({
    mutationFn: () => createMetric(token!, form),
    onSuccess: () => {
      queryClient.invalidateQueries(['metrics']);
      setForm({ name: '', unit: '', category: '', description: '' });
    }
  });

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1>Your Metrics</h1>
        <div>
          <span style={{ marginRight: 8 }}>{email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2>Create a Metric</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <input
            placeholder="Name (e.g. Weight)"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Unit (e.g. kg)"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
            style={{ marginLeft: 8 }}
          />
          <input
            placeholder="Category (optional)"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ marginLeft: 8 }}
          />
          <input
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ marginLeft: 8, width: 200 }}
          />

          <button type="submit" style={{ marginLeft: 8 }}>
            Create
          </button>
        </form>
      </section>

      <section>
        <h2>Existing Metrics</h2>
        {isLoading && <p>Loading...</p>}

        {!isLoading && metrics?.length === 0 && <p>No metrics yet.</p>}

        <ul>
          {metrics?.map((m: Metric) => (
            <li key={m.id} style={{ marginBottom: 12 }}>
              <Link to={`/metrics/${m.id}`}>
                <strong>{m.name}</strong> ({m.unit})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
