import { callAPI } from 'lib/api';

const sigchainNotSynced = -23;
const invoiceTransferNotFound = -247;
const invoiceSearchPages = 5;

export function toInvoice(r) {
  const j = r?.json ?? r ?? {};
  return {
    address: r.address,
    owner: r.owner,
    account: j.account,
    to: j.to,
    recipient: j.recipient,
    items: Array.isArray(j.items) ? j.items : [],
    reference: typeof j.reference === 'string' ? j.reference : undefined,
    amount: Number(j.amount ?? 0),
    token: String(j.token ?? '0'),
    status: j.status ?? 'OUTSTANDING',
    created: r.created,
  };
}

//an invoice in transfer has 00 as owner type, the issuer is a user of this network
export function invoiceIssuer(invoice, myGenesis) {
  const owner = invoice.owner || '';
  return owner.startsWith('00') && myGenesis
    ? myGenesis.slice(0, 2) + owner.slice(2)
    : owner;
}

export const isToMe = (invoice, myGenesis) =>
  !!myGenesis && invoice.recipient?.toLowerCase() === myGenesis.toLowerCase();

//open ones: to pay and the ones this profile sent that nobody paid yet
export async function fetchOutstanding() {
  return ((await callAPI('invoices/list/outstanding', { limit: 100 })) || []).map(
    toInvoice
  );
}

//every invoice this profile holds, all states
export async function fetchInvoiceHistory() {
  return ((await callAPI('invoices/list/invoices', { limit: 100 })) || []).map(
    toInvoice
  );
}

export async function fetchInvoice(address) {
  return toInvoice(await callAPI('invoices/get/invoice', { address }));
}

export async function payInvoice(address, from, pin) {
  return await callAPI('invoices/pay/invoice', { address, from, pin });
}

export async function rejectInvoice(address, pin) {
  return await callAPI('invoices/reject/invoice', { address, pin });
}

//to = own account that gets paid, recipient = username or genesis of the payer
export async function createInvoice({ to, recipient, items, reference, pin }) {
  const params = { to, recipient: recipient.trim(), items, pin };
  if (reference) params.reference = reference;
  return await callAPI('invoices/create/invoice', params);
}

//the transaction that made and sent an invoice, among the newest of this profile
async function invoiceTxid(address) {
  for (let page = 0; page < invoiceSearchPages; page++) {
    const list =
      (await callAPI('profiles/transactions/master', {
        verbose: 'summary',
        limit: 100,
        offset: page * 100,
      })) || [];
    const tx = list.find(
      (t) =>
        t.contracts?.some((c) => c.OP === 'CREATE' && c.address === address) &&
        t.contracts.some((c) => c.OP === 'TRANSFER' && c.address === address)
    );
    if (tx) return tx.txid;
    if (list.length < 100) break;
  }
  return null;
}

//only the issuer, only while unpaid
export async function cancelInvoice(address, pin) {
  try {
    return await callAPI('invoices/cancel/invoice', { address, pin });
  } catch (err) {
    //the core's cancel looks the invoice up in the payer's sigchain, which only works when the payer is on this node too
    if (![sigchainNotSynced, invoiceTransferNotFound].includes(err?.code)) {
      throw err;
    }
  }
  //same as the core: void the transfer of the invoice (its condition lets the issuer take it back)
  if ((await fetchInvoice(address)).status !== 'OUTSTANDING') {
    throw new Error('This invoice is not open any more');
  }
  const txid = await invoiceTxid(address);
  if (!txid) throw new Error('Could not find the transaction of this invoice');
  return await callAPI('finance/void/transaction', { txid, pin });
}

//ticker of an invoice's token from the user's own accounts
export function invoiceTicker(invoice, accounts) {
  if (!invoice.token || invoice.token === '0') return 'NXS';
  const acc = (accounts || []).find((a) => a.token === invoice.token);
  return acc?.ticker || invoice.token.slice(0, 6) + '...';
}

export const statusLabel = {
  OUTSTANDING: 'Open',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
};
