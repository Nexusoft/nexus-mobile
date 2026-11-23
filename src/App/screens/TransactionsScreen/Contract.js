import React from 'react';
import { View } from 'react-native';

import Text from 'components/Text';
import TokenName from 'components/TokenName';
import { getDeltaSign, deltaColor } from 'lib/contracts';
import { useTheme } from 'lib/theme';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: ({ background }) => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  }),
  middle: {
    flex: 1,
    minWidth: 0,
  },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  pending: {
    marginLeft: 6,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 9,
    backgroundColor: '#fff3d6',
  },
  amount: {
    marginLeft: 10,
    textAlign: 'right',
  },
};

const kindColors = {
  in: { light: '#def5e8', dark: '#1f3d2e', fg: '#1b9e5a', glyph: '↙' },
  out: { light: '#fde4e2', dark: '#45251f', fg: '#d9534f', glyph: '↗' },
  stake: { light: '#e3f5fe', dark: '#173445', fg: '#0789c2', glyph: '★' },
  other: { light: '#eef1f5', dark: '#2a3038', fg: '#6b7685', glyph: '•' },
};

export const shortAddress = (address) =>
  address && address.length > 11
    ? address.slice(0, 4) + '...' + address.slice(-4)
    : address || '';

//own account name, contact name, global name, else a short address (another user's local name is ambiguous)
export function registerLabel(register) {
  if (!register) return '';
  const { name, address, local, namespace, mine } = register;
  if (mine && name) return name;
  const contacts = getStore()?.getState().contacts;
  const contact =
    contacts &&
    Object.entries(contacts).find(([, c]) => c?.address === address);
  if (contact) return contact[0];
  if (name) {
    if (namespace) return namespace + '::' + name;
    if (!local || mine) return name;
  }
  return shortAddress(address);
}

function creditSource(contract) {
  switch (contract.for) {
    case 'DEBIT':
      return registerLabel(contract.from || contract.to);
    case 'LEGACY':
      return 'Legacy transaction';
    case 'COINBASE':
      return 'Mining reward';
    default:
      return registerLabel(contract.from);
  }
}

export function describeContract(contract) {
  switch (contract.OP) {
    case 'DEBIT':
      return {
        kind: 'out',
        title: registerLabel(contract.to),
        action: 'Sent from ' + registerLabel(contract.from),
      };
    case 'CREDIT':
      return {
        kind: 'in',
        title: creditSource(contract),
        action: 'Received to ' + registerLabel(contract.to),
      };
    case 'LEGACY':
      return {
        kind: 'out',
        title: shortAddress(contract.to?.address),
        action: 'Sent to a legacy address',
      };
    case 'FEE':
      return {
        kind: 'out',
        title: 'Fee',
        action: 'from ' + registerLabel(contract.from),
      };
    case 'TRUST':
      return { kind: 'stake', title: 'Staking reward', action: 'Trust' };
    case 'GENESIS':
      return { kind: 'stake', title: 'Staking started', action: 'Genesis' };
    case 'COINBASE':
      return { kind: 'in', title: 'Mining reward', action: 'Coinbase' };
    case 'MIGRATE':
      return {
        kind: 'in',
        title: 'Migrated from legacy',
        action: 'to ' + (contract.account_name || shortAddress(contract.account)),
      };
    case 'CREATE': {
      const what =
        contract.type === 'OBJECT' && contract.object_type
          ? contract.object_type.toLowerCase()
          : (contract.type || 'register').toLowerCase();
      return {
        kind: 'other',
        title: 'Created ' + what,
        action: shortAddress(contract.address),
      };
    }
    case 'WRITE':
    case 'APPEND':
      return {
        kind: 'other',
        title: 'Updated ' + registerLabel({ address: contract.address }),
        action: contract.OP === 'WRITE' ? 'Write' : 'Append',
      };
    case 'TRANSFER':
      return {
        kind: 'other',
        title: 'Transferred ' + registerLabel({ address: contract.address }),
        action: 'to ' + registerLabel({ address: contract.destination }),
      };
    case 'CLAIM':
      return {
        kind: 'other',
        title: 'Claimed ' + registerLabel({ address: contract.address }),
        action: 'Claim',
      };
    case 'AUTHORIZE':
      return {
        kind: 'other',
        title: 'Authorized transaction',
        action: shortAddress(contract.txid),
      };
    default:
      return { kind: 'other', title: contract.OP, action: '' };
  }
}

export default function Contract({ contract, time, pending }) {
  const theme = useTheme();
  const sign = getDeltaSign(contract);
  const { kind, title, action } = describeContract(contract);
  const colors = kindColors[kind];
  return (
    <View style={styles.row}>
      <View
        style={styles.icon({
          background: theme.dark ? colors.dark : colors.light,
        })}
      >
        <Text style={{ color: colors.fg, fontSize: 17 }}>{colors.glyph}</Text>
      </View>
      <View style={styles.middle}>
        <Text bold numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.sub}>
          <Text sub size={12} numberOfLines={1}>
            {[action, time].filter(Boolean).join(' · ')}
          </Text>
          {pending && (
            <View style={styles.pending}>
              <Text size={11} style={{ color: '#a4720a' }}>
                Pending
              </Text>
            </View>
          )}
        </View>
      </View>
      {!!contract.amount && (
        <Text
          size={14}
          style={[
            styles.amount,
            { color: deltaColor(sign) },
          ]}
        >
          {sign}
          {formatNumber(contract.amount, { maximumFractionDigits: 6 })}{' '}
          {contract.token && contract.token !== '0'
            ? TokenName.from({ contract })
            : 'NXS'}
        </Text>
      )}
    </View>
  );
}
