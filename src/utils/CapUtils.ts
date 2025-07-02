const MAX_UINT = 2n ** 256n - 1n;

export function decodeCap(cap: number) {
  if (cap === 0) return MAX_UINT; // Unlimited
  const exponent = BigInt(cap & 63);
  const mantissa = BigInt(cap >> 6);
  return (10n ** exponent * mantissa) / 100n;
}