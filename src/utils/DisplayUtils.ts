export function roundTo(num: number, dec: number): number {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

export function FriendlyFormatNumber(num: number): string {
  if (num == 0) {
    return "0";
  }

  if (num === null) {
    return "0";
  }

  if (num > 1e9) {
    return `${roundTo(num / 1e9, 2)}B`;
  } else if (num > 1e6) {
    return `${roundTo(num / 1e6, 2)}M`;
  } else if (num > 1e3) {
    return `${roundTo(num / 1e3, 2)}K`;
  } else if (num < 1 / 1e3) {
    // For very small numbers, use toFixed with more decimal places
    return num.toFixed(6);
  } else {
    return `${roundTo(num, 4).toString()}`;
  }
}
