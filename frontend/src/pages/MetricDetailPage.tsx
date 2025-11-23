import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useAuth } from "../auth/authStore";
import {
  fetchMetricById,
  fetchDataPoints,
  addDataPoint,
  fetchInsights,
} from "../api/metrics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function MetricDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data: metric, isLoading: metricLoading } = useQuery({
    queryKey: ["metric", id],
    queryFn: () => fetchMetricById(token!, id!),
  });

  const { data: points, isLoading: pointsLoading } = useQuery({
    queryKey: ["dataPoints", id],
    queryFn: () => fetchDataPoints(token!, id!),
  });

  const {
    data: insights,
    isLoading: insightsLoading,
    error: insightsError,
  } = useQuery({
    queryKey: ["insights", id],
    queryFn: () => fetchInsights(token!, id!),
    enabled: !!points && (points?.length ?? 0) > 0, // only fetch when we have data
  });

  const [form, setForm] = useState({
    value: "",
    recordedAt: "",
    note: "",
  });

  const addMutation = useMutation({
    mutationFn: () =>
      addDataPoint(token!, id!, {
        value: parseFloat(form.value),
        recordedAt: form.recordedAt || undefined,
        note: form.note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["dataPoints", id]);
      setForm({ value: "", recordedAt: "", note: "" });
    },
  });

  const chartData = useMemo(
    () =>
      (points ?? []).map((p) => ({
        value: p.value,
        recordedAtLabel: new Date(p.recordedAt).toLocaleDateString(),
      })),
    [points]
  );

  if (metricLoading || !metric) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading metric...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-3xl font-semibold">{metric.name}</h1>
            {metric.description && (
              <p className="mt-1 text-slate-400">{metric.description}</p>
            )}
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-300">
            Unit: {metric.unit}
          </span>
        </div>

        <div className="md:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Trend</h2>
            <div className="text-xs text-slate-400">
              {points && points.length > 1
                ? `${points.length} datapoints`
                : "Not enough data"}
            </div>
          </div>

          {pointsLoading ? (
            <p className="text-slate-400 text-sm">Loading...</p>
          ) : chartData.length < 2 ? (
            <p className="text-slate-400 text-sm">
              Add at least 2 datapoints to see trends.
            </p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="recordedAtLabel"
                    stroke="#94a3b8"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgb(15 23 42)",
                      border: "1px solid rgb(51 65 85)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#818cf8" // indigo-400
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#818cf8" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Add Data Point */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-medium mb-4">Add Data Point</h2>

          <form
            className="flex flex-col md:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              addMutation.mutate();
            }}
          >
            <input
              placeholder={`Value (${metric.unit})`}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
              type="number"
            />
            <input
              placeholder="Recorded at (optional ISO string)"
              value={form.recordedAt}
              onChange={(e) => setForm({ ...form, recordedAt: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
            />
            <input
              placeholder="Note (optional)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-medium"
            >
              Add
            </button>
          </form>
        </section>

        {/* Data points list */}
        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-medium mb-4">Data Points</h2>

          {!points?.length && (
            <p className="text-slate-400 text-sm">No data points yet.</p>
          )}

          <ul className="space-y-2">
            {points?.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-900"
              >
                <div>
                  <div className="text-sm font-medium">
                    {p.value} {metric.unit}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(p.recordedAt).toLocaleString()}
                    {p.note ? ` — ${p.note}` : ""}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">Smart Insights</h2>

        {!points || points.length === 0 ? (
          <p className="text-slate-400 text-sm">
            Add some datapoints to generate insights.
          </p>
        ) : insightsLoading ? (
          <p className="text-slate-400 text-sm">Thinking...</p>
        ) : insightsError ? (
          <p className="text-rose-400 text-sm">
            Could not load insights. Check API key.
          </p>
        ) : (
          <p className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">
            {insights?.summary}
          </p>
        )}
      </div>
    </div>
  );
}
