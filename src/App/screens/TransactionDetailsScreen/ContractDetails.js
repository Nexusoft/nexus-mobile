import React from 'react';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import InfoField from 'components/InfoField';
import formatNumber from 'utils/formatNumber';
import { t } from 'lib/i18n';

const styles = {
  wrapper: {
    elevation: 3,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
};

//a function so the labels are translated at render time
const getLabels = () => ({
  OP: t('Operation'),
  from: t('From'),
  to: t('To'),
  account: t('Account'),
  destination: t('Destination'),
  address: t('Address'),
  amount: t('Amount'),
  claimed: t('Claimed'),
  reference: t('Reference'),
  token: t('Token'),
  conditions: t('Conditions'),
});

const hiddenKeys = ['id', 'ticker', 'token_name'];

//the standard send expiry the core adds to every debit
const expiryRegex =
  /^\(caller\.genesis != 0x[0-9a-f]+ AND contract\.timestamp \+ (\d+) > caller\.timestamp\) OR \(caller\.genesis == 0x[0-9a-f]+ AND contract\.timestamp \+ \d+ < caller\.timestamp\)$/;

function describeConditions(conditions) {
  const match = expiryRegex.exec(conditions);
  if (!match) return null;
  const seconds = Number(match[1]);
  const days = seconds / 86400;
  if (!Number.isInteger(days)) {
    return t('The recipient can claim it within {hours} hours, after that the sender can take it back.', { hours: Math.round(seconds / 3600) });
  }
  if (days === 1) {
    return t('The recipient can claim it within 1 day, after that the sender can take it back.');
  }
  return t('The recipient can claim it within {days} days, after that the sender can take it back.', { days });
}

function registerText(value) {
  const lines = [];
  if (value.name) {
    let name = value.namespace
      ? `${value.namespace}::${value.name}`
      : value.name;
    if (value.local && !value.mine) {
      name = t("{name} (another user's local name)", { name });
    }
    lines.push(name);
  }
  if (value.address) lines.push(value.address);
  return lines.join('\n') || JSON.stringify(value, null, 2);
}

function fieldValue(key, value, contract) {
  if (key === 'amount' || key === 'claimed') {
    const ticker = contract.ticker || contract.token_name || '';
    return `${formatNumber(value, { maximumFractionDigits: 6 })} ${ticker}`.trim();
  }
  if (key === 'token') {
    const ticker = contract.ticker || contract.token_name;
    if (value === '0') return 'NXS';
    return ticker ? `${ticker}\n${value}` : value;
  }
  if (key === 'conditions') {
    const plain = describeConditions(value);
    return plain ? `${plain}\n\n${value}` : value;
  }
  if (value && typeof value === 'object') return registerText(value);
  return value;
}

export default function ContractDetails({ contract }) {
  if (!contract) return null;
  const labels = getLabels();
  const entries = Object.entries(contract).filter(
    ([key, value]) =>
      !hiddenKeys.includes(key) && value !== undefined && value !== null
  );
  return (
    <Surface style={styles.wrapper}>
      {entries.map(([key, value], i) => (
        <React.Fragment key={key}>
          {i !== 0 && <Divider />}
          <InfoField
            compact
            label={labels[key] || key}
            mono={['token', 'conditions'].includes(key)}
            value={String(fieldValue(key, value, contract))}
          />
        </React.Fragment>
      ))}
    </Surface>
  );
}
