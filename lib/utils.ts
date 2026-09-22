export const formatPrice = (value: number): string => {
  const NAIRA = '₦';
  if (value >= 1_000_000_000) {
    const b = (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
    return `${NAIRA}${b}B`;
  }
  if (value >= 1_000_000) {
    const m = (value / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `${NAIRA}${m}M`;
  }
  return `${NAIRA}${value.toLocaleString('en-NG')}`;
};
