import { MetricDetailPage } from "./MetricDetailPage";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useAuth } from "../../auth/authStore";
import {
  fetchMetricById,
  fetchDataPoints,
  addDataPoint,
  fetchInsights,
} from "../../api/metrics";

export const MetricDetailController = () => {
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
    enabled: !!points && (points?.length ?? 0) > 0,
  });

  const [form, setForm] = useState({
    value: "",
    recordedAt: "",
    note: "",
  });

  const chartData = useMemo(
    () =>
      (points ?? []).map((p) => ({
        value: p.value,
        recordedAtLabel: new Date(p.recordedAt).toLocaleDateString(),
      })),
    [points]
  );

  const addMutation = useMutation({
    mutationFn: () =>
      addDataPoint(token!, id!, {
        value: parseFloat(form.value),
        recordedAt: form.recordedAt || undefined,
        note: form.note,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dataPoints", id] });
      setForm({ value: "", recordedAt: "", note: "" });
    },
  });

  if (metricLoading || !metric) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-300">Loading metric...</p>
      </div>
    );
  }

  return (
    <MetricDetailPage
      metric={metric}
      points={points}
      pointsLoading={pointsLoading}
      insights={insights}
      insightsLoading={insightsLoading}
      insightsError={insightsError}
      chartData={chartData}
      form={form}
      setForm={setForm}
      addMutation={addMutation}
    />
  );
};
