//accepts 1.5 and 1,5 (comma keyboards), NaN when not a plain number
export default function parseAmount(text) {
  const normalized = String(text ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace(',', '.');
  if (!/^\d*\.?\d+$|^\d+\.$/.test(normalized)) return NaN;
  return Number(normalized);
}
