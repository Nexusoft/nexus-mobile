import React from 'react';
import { Platform } from 'react-native';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import TransactionDetails from './TransactionDetails';
import ContractDetails from './ContractDetails';

const styles = {
  subHeader: {
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
};

export default function TransactionDetailsScreen({ route }) {
  const {
    params: { transaction },
  } = route;
  return (
    !!transaction && (
      <ScreenBody>
        <TransactionDetails transaction={transaction} />

        <Text sub style={styles.subHeader}>
          Contracts
        </Text>
        {!!transaction.contracts &&
          transaction.contracts.map((contract) => (
            <ContractDetails key={contract.id} contract={contract} />
          ))}
      </ScreenBody>
    )
  );
}

TransactionDetailsScreen.nav = {
  name: 'TransactionDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Transaction' : 'Transaction Details',
  },
};
