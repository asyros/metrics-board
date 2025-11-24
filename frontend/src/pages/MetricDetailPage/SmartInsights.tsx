export const SmartInsights = ({
  points,
  insights,
  insightsLoading,
  insightsError,
}: {
  points?: { id: string; value: number; recordedAt: string; note?: string }[];
  insights?: { summary: string };
  insightsLoading: boolean;
  insightsError: unknown;
}) => {
  return (
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
  );
};
