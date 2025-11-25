import { Link } from "react-router-dom";

export const Header = ({
  metric,
}: {
  metric: { name: string; description?: string; unit: string };
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Link to="/" className="text-sm text-slate-400 hover:text-slate-200">
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
  );
};
