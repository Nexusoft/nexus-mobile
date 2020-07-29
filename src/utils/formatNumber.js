const numberRegex = /^(\d+)\.?(\d*)$/;
const nonZeroDigit = /[^0]/;

export default function formatNumber(
  number,
  { maximumFractionDigits } = {
    maximumFractionDigits: 2,
  }
) {
  number = Number(number);
  const string = number.toString();
  const match = numberRegex.exec(string);
  if (!match) return '';

  let [_, integer, fraction] = match;
  integer = Intl.NumberFormat().format(integer);

  let approximate = false;
  if (fraction.length > maximumFractionDigits) {
    if (integer === '0') {
      const firstNonZeroDigitIndex = fraction.search(nonZeroDigit);
      if (firstNonZeroDigitIndex >= maximumFractionDigits) {
        maximumFractionDigits = firstNonZeroDigitIndex + 1;
      }
    }

    const cutOffDigits = fraction.length - maximumFractionDigits;
    if (cutOffDigits) {
      const tempFraction = Number(fraction) / 10 ** cutOffDigits;
      fraction = Math.round(tempFraction).toString();
      approximate = true;
    }
  }

  return `${approximate ? '≈' : ''}${integer}${fraction ? '.' + fraction : ''}`;
}
