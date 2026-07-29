export type DataMode = "ungrouped" | "grouped";

export type FrequencyRow = {
  key: string;
  label: string;
  mark?: number;
  fi: number;
  Fi: number;
  hi: number;
  Hi: number;
};

export type FrequencyResult = {
  rows: FrequencyRow[];
  total: number;
  minimum: number;
  maximum: number;
  range: number;
  unique: number;
  classCount?: number;
  width?: number;
};

const esFormatter = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 3,
});

export function formatNumber(value: number) {
  return esFormatter.format(Number(value.toFixed(6)));
}

export function parseData(input: string) {
  const matches = input.match(/[-+]?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  return matches.map(Number).filter(Number.isFinite);
}

function finishRows(
  entries: Array<{ key: string; label: string; mark?: number; count: number }>,
  total: number,
) {
  let cumulative = 0;
  return entries.map((entry) => {
    cumulative += entry.count;
    return {
      key: entry.key,
      label: entry.label,
      mark: entry.mark,
      fi: entry.count,
      Fi: cumulative,
      hi: total ? entry.count / total : 0,
      Hi: total ? cumulative / total : 0,
    };
  });
}

export function buildUngrouped(values: number[]): FrequencyResult {
  const counts = new Map<number, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  const sorted = [...counts.entries()].sort(([a], [b]) => a - b);
  const rows = finishRows(
    sorted.map(([value, count]) => ({
      key: String(value),
      label: formatNumber(value),
      mark: value,
      count,
    })),
    values.length,
  );

  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 0;

  return {
    rows,
    total: values.length,
    minimum,
    maximum,
    range: maximum - minimum,
    unique: counts.size,
  };
}

export function sturgesClassCount(total: number) {
  if (total <= 1) return 1;
  return Math.max(3, Math.min(10, Math.ceil(1 + 3.322 * Math.log10(total))));
}

function niceWidth(rawWidth: number, integersOnly: boolean) {
  if (!Number.isFinite(rawWidth) || rawWidth <= 0) return 1;
  if (integersOnly) return Math.max(1, Math.ceil(rawWidth));

  const magnitude = 10 ** Math.floor(Math.log10(rawWidth));
  const fraction = rawWidth / magnitude;
  const niceFraction =
    fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return niceFraction * magnitude;
}

export function buildGrouped(
  values: number[],
  requestedClasses: number,
): FrequencyResult {
  if (!values.length) return buildUngrouped([]);

  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum;
  const integersOnly = values.every(Number.isInteger);

  if (range === 0) {
    return {
      rows: finishRows(
        [
          {
            key: String(minimum),
            label: formatNumber(minimum),
            mark: minimum,
            count: values.length,
          },
        ],
        values.length,
      ),
      total: values.length,
      minimum,
      maximum,
      range,
      unique: 1,
      classCount: 1,
      width: 0,
    };
  }

  const classCount = Math.max(2, Math.min(12, Math.round(requestedClasses)));
  const width = niceWidth(range / classCount, integersOnly);
  const lowerStart = Math.floor(minimum / width) * width;
  const entries = Array.from({ length: classCount }, (_, index) => {
    const lower = lowerStart + index * width;
    const upper = lower + width;
    const isLast = index === classCount - 1;
    return {
      key: `${lower}-${upper}`,
      label: `${formatNumber(lower)} ${isLast ? "–" : "≤ x <"} ${formatNumber(upper)}`,
      mark: (lower + upper) / 2,
      count: 0,
      lower,
      upper,
      isLast,
    };
  });

  values.forEach((value) => {
    let index = Math.floor((value - lowerStart) / width);
    index = Math.max(0, Math.min(classCount - 1, index));
    entries[index].count += 1;
  });

  return {
    rows: finishRows(entries, values.length),
    total: values.length,
    minimum,
    maximum,
    range,
    unique: new Set(values).size,
    classCount,
    width,
  };
}
