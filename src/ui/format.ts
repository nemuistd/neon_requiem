export function formatAmount(value: number): string {
  if (value < 100) {
    return value.toFixed(1);
  }

  return Math.floor(value).toLocaleString("ja-JP");
}

export function formatRate(value: number): string {
  return value.toFixed(2);
}

export function formatBond(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
