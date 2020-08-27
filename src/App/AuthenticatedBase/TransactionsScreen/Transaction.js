import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import { isConfirmed } from 'lib/transactions';
import Contract from './Contract';

const styles = {
  wrapper: ({ unconfirmed }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    opacity: unconfirmed ? 0.5 : 1,
  }),
  date: {
    paddingVertical: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: 21,
  },
  month: {
    fontSize: 14,
  },
  contracts: {
    flex: 1,
  },
};

function Transaction({ transaction }) {
  const txTime = moment.unix(transaction.timestamp);
  return (
    <TouchableRipple
      onPress={() => {
        navigate('TransactionDetails', { txid: transaction.txid });
      }}
    >
      <View style={styles.wrapper({ unconfirmed: !isConfirmed(transaction) })}>
        <View style={styles.date}>
          <Text style={styles.day}>{txTime.format('DD')}</Text>
          <Text style={styles.month}>{txTime.format('MMM')}</Text>
        </View>

        <View style={styles.contracts}>
          {transaction.contracts.map((contract, i) => (
            <React.Fragment key={i}>
              {i !== 0 && <Divider />}
              <Contract contract={contract} />
            </React.Fragment>
          ))}
        </View>
      </View>
    </TouchableRipple>
  );
}

export default React.memo(Transaction);
