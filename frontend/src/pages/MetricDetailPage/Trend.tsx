import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Trend = ({
  points,
  pointsLoading,
  chartData,
}: {
  points?: { id: string; value: number; recordedAt: string; note?: string }[];
  pointsLoading: boolean;
  chartData: { value: number; recordedAtLabel: string }[];
}) => {
  return (
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
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ r: 3, fill: "#818cf8" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
