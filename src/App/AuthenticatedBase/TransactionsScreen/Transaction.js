import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import Contract from './Contract';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

export default function Transaction({ transaction }) {
  const txTime = moment.unix(transaction.timestamp);
  return (
    <TouchableRipple
      onPress={() => {
        navigate('TransactionDetails', { transaction });
      }}
    >
      <View style={styles.wrapper}>
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
