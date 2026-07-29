"use client";

import type { FrequencyRow } from "../lib/statistics";
import { formatNumber } from "../lib/statistics";

type Metric = "fi" | "Hi";

export function DistributionChart({
  rows,
  metric,
}: {
  rows: FrequencyRow[];
  metric: Metric;
}) {
  const maxValue =
    metric === "fi" ? Math.max(1, ...rows.map((row) => row.fi)) : 1;

  return (
    <div className="chart" role="img" aria-label={`Gráfico de ${metric}`}>
      <div className="chart-grid" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="chart-bars">
        {rows.map((row) => {
          const value = metric === "fi" ? row.fi : row.Hi;
          const height = Math.max(4, (value / maxValue) * 100);
          return (
            <div className="bar-column" key={row.key}>
              <div className="bar-value">
                {metric === "fi" ? value : `${formatNumber(value * 100)}%`}
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${height}%` }} />
              </div>
              <span title={row.label}>{row.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
