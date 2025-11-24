import { Link } from "react-router-dom";
import type { Metric } from "../../api/metrics";

export const ExistingMetrics = ({
  isLoading,
  metrics,
}: {
  isLoading: boolean;
  metrics: Metric[] | undefined;
}) => {
  return (
    <>
      <h2 className="py-3 text-lg font-semibold">Existing Metrics</h2>
      {isLoading && <p>Loading...</p>}

      {!isLoading && metrics?.length === 0 && <p>No metrics yet.</p>}

      <ul className="list-disc list-inside">
        {metrics?.map((m: Metric) => (
          <li key={m.id} className="py-1">
            <Link to={`/metrics/${m.id}`}>
              {m.name} ({m.unit})
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
