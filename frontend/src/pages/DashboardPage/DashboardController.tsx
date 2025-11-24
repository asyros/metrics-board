import { DashboardPage } from "./DashboardPage";
import { useAuth } from "../../auth/authStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMetric, fetchMetrics } from "../../api/metrics";
import { useState } from "react";

export const DashboardController = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: () => fetchMetrics(token!),
  });

  const { token, email, logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    description: "",
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => createMetric(token!, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
      setForm({ name: "", unit: "", category: "", description: "" });
    },
  });

  return (
    <DashboardPage
      email={email}
      logout={logout}
      form={form}
      setForm={setForm}
      createMutation={createMutation}
      metrics={metrics}
      isLoading={isLoading}
    />
  );
};
