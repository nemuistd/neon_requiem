const COMPACT_NUMBER_THRESHOLD = 100_000;

const JAPANESE_COMPACT_UNITS = [
  { value: 1_000_000_000_000, label: "兆" },
  { value: 100_000_000, label: "億" },
  { value: 10_000, label: "万" }
] as const;

export function formatAmount(value: number): string {
  if (shouldUseCompactNumber(value)) {
    return formatCompactJapaneseNumber(value);
  }

  if (value < 100) {
    return value.toFixed(1);
  }

  return Math.floor(value).toLocaleString("ja-JP");
}

export function formatDetailedAmount(value: number): string {
  if (value < 100) {
    return value.toFixed(1);
  }

  return value.toLocaleString("ja-JP", {
    maximumFractionDigits: 2
  });
}

export function formatWholeAmount(value: number): string {
  return Math.max(0, Math.floor(value)).toLocaleString("ja-JP");
}

export function formatRate(value: number): string {
  if (shouldUseCompactNumber(value)) {
    return formatCompactJapaneseNumber(value);
  }

  return formatDetailedRate(value);
}

export function formatDetailedRate(value: number): string {
  return value.toLocaleString("ja-JP", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });
}

export function formatBond(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function shouldUseCompactNumber(value: number): boolean {
  return Number.isFinite(value) && Math.abs(value) >= COMPACT_NUMBER_THRESHOLD;
}

function formatCompactJapaneseNumber(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absoluteValue = Math.abs(value);
  const unit = JAPANESE_COMPACT_UNITS.find((candidate) => absoluteValue >= candidate.value) ?? JAPANESE_COMPACT_UNITS[JAPANESE_COMPACT_UNITS.length - 1];
  const scaledValue = absoluteValue / unit.value;
  const maximumFractionDigits = scaledValue >= 10 ? 1 : 2;

  return `${sign}${scaledValue.toLocaleString("ja-JP", {
    maximumFractionDigits
  })}${unit.label}`;
}
