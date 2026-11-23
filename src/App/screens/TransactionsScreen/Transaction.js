import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { TouchableRipple } from 'react-native-paper';

import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';
import { isConfirmed } from 'lib/transactions';
import Contract from './Contract';

function Transaction({ transaction }) {
  const time = moment.unix(transaction.timestamp).format('HH:mm');
  const pending = !isConfirmed(transaction);
  return (
    <TouchableRipple
      onPress={() => {
        navigate('TransactionDetails', { txid: transaction.txid });
      }}
    >
      <View>
        {transaction.contracts?.map((contract, i) => (
          <React.Fragment key={i}>
            {i !== 0 && <Divider inset={64} />}
            <Contract contract={contract} time={time} pending={pending} />
          </React.Fragment>
        ))}
      </View>
    </TouchableRipple>
  );
}

export default React.memo(Transaction);
