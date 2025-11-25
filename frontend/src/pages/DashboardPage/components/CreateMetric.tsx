import type { UseMutationResult } from "@tanstack/react-query";
import type { Metric } from "../../../api/metrics";

export const CreateMetric = ({
  form,
  setForm,
  createMutation,
}: {
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
}) => {
  const { name, unit, category, description } = form;
  const metricInputClassName =
    "px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm";
  return (
    <section className="py-5">
      <h2 className="py-3 text-lg font-semibold">Create a Metric</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <input
          placeholder="Name (e.g. Weight)"
          value={name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={metricInputClassName}
        />
        <input
          placeholder="Unit (e.g. kg)"
          value={unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className={metricInputClassName}
        />
        <input
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className={metricInputClassName}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={metricInputClassName}
        />

        <button
          type="submit"
          className="mt-5 ml-4 mr-7 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-sm font-medium float-right"
        >
          Create
        </button>
      </form>
    </section>
  );
};
