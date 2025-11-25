import { Header } from "./components/Header";
import { Trend } from "./components/Trend";
import { AddDataPoint } from "./components/AddDataPoint";
import { DataPoints } from "./components/DataPoints";
import { SmartInsights } from "./components/SmartInsights";

export function MetricDetailPage({
  metric,
  points,
  pointsLoading,
  insights,
  insightsLoading,
  insightsError,
  chartData,
  form,
  setForm,
  addMutation,
}: {
  metric: {
    id: string;
    name: string;
    unit: string;
    description?: string;
  };
  points?: { id: string; value: number; recordedAt: string; note?: string }[];
  pointsLoading: boolean;
  insights?: { summary: string };
  insightsLoading: boolean;
  insightsError: unknown;
  chartData: { value: number; recordedAtLabel: string }[];
  form: { value: string; recordedAt: string; note: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ value: string; recordedAt: string; note: string }>
  >;
  addMutation: {
    mutate: () => void;
    isPending: boolean;
    isError: boolean;
    error: unknown;
  };
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header metric={metric} />

        <Trend
          points={points}
          pointsLoading={pointsLoading}
          chartData={chartData}
        />

        <AddDataPoint
          metric={metric}
          form={form}
          setForm={setForm}
          addMutation={addMutation}
        />

        <DataPoints points={points} metric={metric} />
      </div>
      <SmartInsights
        points={points}
        insights={insights}
        insightsLoading={insightsLoading}
        insightsError={insightsError}
      />
    </div>
  );
}
