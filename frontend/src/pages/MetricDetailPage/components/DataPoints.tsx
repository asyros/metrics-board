export const DataPoints = ({
  points,
  metric,
}: {
  points?: { id: string; value: number; recordedAt: string; note?: string }[];
  metric: { unit: string };
}) => {
  return (
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
  );
};
