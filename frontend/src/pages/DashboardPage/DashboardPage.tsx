import { type UseMutationResult } from "@tanstack/react-query";
import { type Metric } from "../../api/metrics";
import { Header } from "./components/Header";
import { ExistingMetrics } from "./components/ExistingMetrics";
import { CreateMetric } from "./components/CreateMetric";

export function DashboardPage({
  email,
  logout,
  form,
  setForm,
  createMutation,
  metrics,
  isLoading,
}: {
  email: string | null;
  logout: () => void;
  form: {
    name: string;
    unit: string;
    category: string;
    description: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      unit: string;
      category: string;
      description: string;
    }>
  >;
  createMutation: UseMutationResult<Metric, Error, void, unknown>;
  metrics: Metric[] | undefined;
  isLoading: boolean;
}) {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <Header email={email} logout={logout} />

      <CreateMetric
        form={form}
        setForm={setForm}
        createMutation={createMutation}
      />

      <ExistingMetrics isLoading={isLoading} metrics={metrics} />
    </div>
  );
}
