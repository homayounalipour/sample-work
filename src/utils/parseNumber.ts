export function parseNumber(
  value: string | undefined,
  fallback: number,
): number {
  if (!value?.trim()) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
