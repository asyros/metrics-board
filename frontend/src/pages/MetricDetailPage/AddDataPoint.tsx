export const AddDataPoint = ({
  metric,
  form,
  setForm,
  addMutation,
}: {
  metric: { unit: string };
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
}) => {
  return (
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
  );
};
