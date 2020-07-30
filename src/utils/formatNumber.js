export default function formatNumber(
  number,
  { maximumFractionDigits } = {
    maximumFractionDigits: 2,
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

  const approximate = !Number.isInteger(number * 10 ** maximumFractionDigits);
  return `${approximate ? '~' : ''}${Intl.NumberFormat('en', {
    maximumFractionDigits,
  }).format(number)}`;
}
