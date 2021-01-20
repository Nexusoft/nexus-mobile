import React from 'react';
import { Platform, RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';

import { callAPI } from 'lib/api';
import useRefresh from 'utils/useRefresh';
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
    params: { txid },
  } = route;
  const [transaction, setTransaction] = React.useState(null);
  const loadTransaction = async () => {
    const tx = await callAPI('ledger/get/transaction', {
      txid,
      verbose: 'summary',
    });
    setTransaction(tx);
  };
  const [refreshing, refresh] = useRefresh(() => loadTransaction());
  React.useEffect(() => {
    loadTransaction();
  }, []);
  return (
    <ScreenBody
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      {transaction ? (
        <>
          <TransactionDetails transaction={transaction} />

          <Text sub style={styles.subHeader}>
            Contracts
          </Text>
          {transaction?.contracts?.map((contract) => (
            <ContractDetails key={contract.id} contract={contract} />
          ))}
        </>
      ) : (
        <ActivityIndicator />
      )}
    </ScreenBody>
  );
}

TransactionDetailsScreen.nav = {
  name: 'TransactionDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Transaction' : 'Transaction Details',
  },
};
