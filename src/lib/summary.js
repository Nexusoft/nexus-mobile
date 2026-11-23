import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import moment from 'moment';

import { callAPI } from 'lib/api';

const pageSize = 100;
const maxTransactions = 10000;

//all transactions from a moment on (null = whole history), newest first
export async function fetchTransactionsSince(since, onProgress) {
  //the core compares whole days, the exact cut is made below
  const where = since
    ? `results.timestamp>date(\`${moment(since)
        .subtract(1, 'day')
        .format('YYYY-MM-DD')}\`);`
    : undefined;
  const sinceUnix = since ? moment(since).unix() : 0;
  let all = [];
  for (let offset = 0; offset < maxTransactions; offset += pageSize) {
    const params = { verbose: 'summary', limit: pageSize, offset };
    if (where) params.where = where;
    const page = (await callAPI('profiles/transactions/master', params)) || [];
    all = all.concat(page);
    onProgress?.(all.length);
    if (page.length < pageSize) break;
  }
  return all.filter((tx) => tx.timestamp >= sinceUnix);
}

const side = (part) =>
  part && typeof part === 'object'
    ? part.name || part.address || ''
    : part || '';

function kindOf(contract) {
  switch (contract.OP) {
    case 'DEBIT':
    case 'LEGACY':
      return contract.to?.mine ? 'own' : 'out';
    case 'CREDIT':
      return contract.from?.mine ? 'own' : 'in';
    case 'MIGRATE':
    case 'COINBASE':
      return 'in';
    case 'TRUST':
    case 'GENESIS':
      return 'stake';
    case 'FEE':
      return 'fee';
    default:
      return null;
  }
}

export const tickerOf = (contract) =>
  contract.ticker ||
  (!contract.token || contract.token === '0'
    ? 'NXS'
    : contract.token.slice(0, 6) + '...');

//one row per contract that moves an amount
export function toEntries(transactions) {
  const entries = [];
  for (const tx of transactions || []) {
    for (const contract of tx.contracts || []) {
      const kind = kindOf(contract);
      if (!kind || !contract.amount) continue;
      const sign = kind === 'out' || kind === 'fee' ? -1 : 1;
      entries.push({
        txid: tx.txid,
        timestamp: tx.timestamp,
        confirmations: tx.confirmations || 0,
        op: contract.OP,
        kind,
        //own transfers count as out on the sending side, in on the claiming side
        amount:
          kind === 'own'
            ? contract.OP === 'CREDIT'
              ? contract.amount
              : -contract.amount
            : sign * contract.amount,
        ticker: tickerOf(contract),
        token: contract.token || '0',
        from: side(contract.from),
        to: side(contract.to),
        reference: contract.reference || '',
      });
    }
  }
  return entries;
}

export const monthStart = (date) => moment(date).startOf('month');

export function summarize(entries, ticker, start, end) {
  const from = moment(start).unix();
  const to = moment(end).unix();
  const sum = { in: 0, out: 0, stake: 0, fee: 0, own: 0, count: 0 };
  for (const e of entries) {
    if (e.ticker !== ticker || e.timestamp < from || e.timestamp >= to) continue;
    sum.count++;
    if (e.kind === 'own') sum.own++;
    else sum[e.kind] += Math.abs(e.amount);
  }
  sum.net = sum.in + sum.stake - sum.out - sum.fee;
  return sum;
}

//tickers that moved, NXS first, then by number of entries
export function tickersIn(entries) {
  const counts = {};
  for (const e of entries) counts[e.ticker] = (counts[e.ticker] || 0) + 1;
  return Object.keys(counts).sort((a, b) =>
    a === 'NXS' ? -1 : b === 'NXS' ? 1 : counts[b] - counts[a]
  );
}

const csvCell = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const typeNames = {
  in: 'Received',
  out: 'Sent',
  stake: 'Staking reward',
  fee: 'Fee',
  own: 'Between own accounts',
};

export function toCsv(entries) {
  const header = [
    'Date (UTC)',
    'Type',
    'Operation',
    'Amount',
    'Token',
    'Token address',
    'From',
    'To',
    'Reference',
    'Transaction ID',
    'Confirmations',
  ];
  const rows = entries.map((e) => [
    moment.unix(e.timestamp).utc().format('YYYY-MM-DD HH:mm:ss'),
    typeNames[e.kind],
    e.op,
    e.amount,
    e.ticker,
    e.token,
    e.from,
    e.to,
    e.reference,
    e.txid,
    e.confirmations,
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n') + '\n';
}

//phone: file in the cache folder, then the share sheet (mail, drive...); web: download
export async function shareCsv(fileName, text) {
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  const uri = FileSystem.cacheDirectory + fileName;
  await FileSystem.writeAsStringAsync(uri, text, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    UTI: 'public.comma-separated-values-text',
    dialogTitle: fileName,
  });
}
