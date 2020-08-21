export default function formatNumber(
  number,
  { maximumFractionDigits } = {
    maximumFractionDigits: 6,
  }
) {
  number = Number(number);
  if (!Number.isFinite(number)) return '';

  if (number) {
    const absNumber = Math.abs(number);
    while (absNumber < 10 ** -maximumFractionDigits) {
      ++maximumFractionDigits;
    }
  }

  return Intl.NumberFormat('en', {
    maximumFractionDigits,
  }).format(number);
}
