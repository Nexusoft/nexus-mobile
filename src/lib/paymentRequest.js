import parseAmount from 'utils/parseAmount';

//payment links other apps, shops and dapps can open or show as a QR code:
//  nexus:ADDRESS?amount=1.5&reference=42&label=Order%2042
//  nexus://pay?to=ADDRESS&... and nexuswallet://pay?to=ADDRESS&... work too
//the wallet only fills in the Send form, the user still checks and confirms with the PIN

const schemeRegex = /^(nexus|nexuswallet):(\/\/)?/i;
const maxLabelLength = 100;

function readQuery(query) {
  const params = {};
  for (const part of (query || '').split('&')) {
    if (!part) continue;
    const [key, ...rest] = part.split('=');
    try {
      params[decodeURIComponent(key).toLowerCase()] = decodeURIComponent(
        rest.join('=').replace(/\+/g, ' ')
      );
    } catch (err) {}
  }
  return params;
}

//null when the text is not a payment link
export function parsePaymentRequest(text) {
  const trimmed = String(text ?? '').trim();
  if (!schemeRegex.test(trimmed)) return null;
  const [path, query] = trimmed.replace(schemeRegex, '').split('?');
  const params = readQuery(query);
  const isPayPath = /^pay\/?$/i.test(path);
  const address = (isPayPath ? params.to : decodeURIComponent(path)) || '';
  if (!address.trim()) return null;

  const request = { address: address.trim() };
  const amount = parseAmount(params.amount);
  if (amount > 0) request.amount = String(amount);
  if (/^\d+$/.test(params.reference || '')) request.reference = params.reference;
  if (params.label) request.label = params.label.slice(0, maxLabelLength);
  return request;
}

export function buildPaymentRequest({ address, amount, reference, label }) {
  const params = [];
  const value = parseAmount(amount);
  if (value > 0) params.push('amount=' + value);
  if (/^\d+$/.test(String(reference ?? ''))) params.push('reference=' + reference);
  if (label) params.push('label=' + encodeURIComponent(label));
  return 'nexus:' + address + (params.length ? '?' + params.join('&') : '');
}
