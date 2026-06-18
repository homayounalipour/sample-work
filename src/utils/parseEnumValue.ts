export function parseEnumValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  if (value && allowed.includes(value as T)) {
    return value as T;
  }

  return fallback;
}
