import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';

import Divider from 'components/Divider';
import Text from 'components/Text';
import { navigate } from 'lib/navigation';
import { isConfirmed } from 'lib/transactions';
import { useTheme } from 'lib/theme';
import { t } from 'lib/i18n';
import Contract from './Contract';

const styles = {
  group: ({ theme }) => ({
    marginHorizontal: 8,
    marginVertical: 6,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.04)' : '#f5f9fd',
    overflow: 'hidden',
  }),
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  groupCount: ({ theme }) => ({
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
  }),
};

function Transaction({ transaction }) {
  const theme = useTheme();
  const time = moment.unix(transaction.timestamp).format('HH:mm');
  const pending = !isConfirmed(transaction);
  const contracts = transaction.contracts || [];
  const grouped = contracts.length > 1;
  return (
    <TouchableRipple
      style={grouped ? styles.group({ theme }) : undefined}
      onPress={() => {
        navigate('TransactionDetails', { txid: transaction.txid });
      }}
    >
      <View>
        {grouped && (
          <View style={styles.groupHeader}>
            <View style={styles.groupCount({ theme })}>
              <Text size={11} bold color="#fff">
                {contracts.length}
              </Text>
            </View>
            <Text sub size={12}>
              {t('{count} parts in one transaction', {
                count: contracts.length,
              })}
            </Text>
          </View>
        )}
        {contracts.map((contract, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <Divider inset={grouped ? 62 : 64} />}
            <Contract contract={contract} time={time} pending={pending} />
          </React.Fragment>
        ))}
      </View>
    </TouchableRipple>
  );
}

export default React.memo(Transaction);
