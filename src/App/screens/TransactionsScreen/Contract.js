import React from 'react';
import { View } from 'react-native';

import Text from 'components/Text';
import TokenName from 'components/TokenName';
import { getDeltaSign } from 'lib/contracts';

const styles = {
  contract: {
    padding: 20,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contractContent: {
    flex: 1,
  },
  operation: {
    textTransform: 'uppercase',
    fontFamily: 'noto-sans-bold',
    fontWeight: 'bold',
  },
  registerType: {
    textTransform: 'lowercase',
  },
};

function Delta({ negative, ...rest }) {
  return (
    <Text colorName={negative ? 'danger' : 'primary'} size={14} {...rest} />
  );
}

function Hash({ children, ...rest }) {
  if (!children || typeof children !== 'string' || children.length <= 11) {
    return <Text {...rest}>{children}</Text>;
  } else {
    return (
      <Text mono {...rest}>
        {children.slice(0, 6)}...{children.slice(-5)}
      </Text>
    );
  }
}

const Account = ({ name, address }) =>
  name ? <Text>{name}</Text> : <Hash>{address}</Hash>;

const creditFrom = (contract) => {
  switch (contract.for) {
    case 'DEBIT':
      return <Account name={contract.from_name} address={contract.from} />;

    case 'LEGACY':
      return <Text>Legacy transaction</Text>;

    case 'COINBASE':
      return <Text>Coinbase transaction</Text>;

    default:
      return '';
  }
};

const contractContent = (contract) => {
  switch (contract.OP) {
    case 'WRITE': {
      return (
        <Text>
          <Text style={styles.operation}>Write</Text>
          <Text sub> data to </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'APPEND': {
      return (
        <Text>
          <Text style={styles.operation}>Append</Text>
          <Text sub> data to </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'CREATE': {
      return (
        <Text>
          <Text style={styles.operation}>Create</Text>
          <Text sub> new </Text>
          <Text style={styles.registerType}>
            {contract.type === 'OBJECT' && contract.object_type + ' '}
            {contract.type}
          </Text>
          <Text sub> register</Text>
          {'\n'}
          <Text sub>at address </Text>
          <Hash>{contract.address}</Hash>
        </Text>
      );
    }

    case 'TRANSFER': {
      return (
        <Text>
          <Text style={styles.operation}>Transfer</Text>
          <Text sub> ownership of </Text>
          <Account address={contract.address} /> to{' '}
          <Account address={contract.destination} />
        </Text>
      );
    }

    case 'CLAIM': {
      return (
        <Text>
          <Text style={styles.operation}>Claim</Text>
          <Text sub> ownership of </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'COINBASE': {
      return (
        <Text>
          <Text style={styles.operation}>Coinbase</Text>
        </Text>
      );
    }

    case 'TRUST': {
      return (
        <Text>
          <Text style={styles.operation}>Trust</Text>
        </Text>
      );
    }

    case 'GENESIS': {
      return (
        <Text>
          <Text style={styles.operation}>Genesis</Text>{' '}
          <Hash>{contract.address}</Hash>
        </Text>
      );
    }

    case 'DEBIT': {
      return (
        <Text>
          <Text style={styles.operation}>Debit</Text>
          <Text sub> from </Text>
          <Account name={contract.from_name} address={contract.from} />
          {'\n'}
          <Text sub>to </Text>
          <Account name={contract.to_name} address={contract.to} />
        </Text>
      );
    }

    case 'CREDIT': {
      return (
        <Text>
          <Text style={styles.operation}>Credit</Text>
          <Text sub> to </Text>
          <Account name={contract.to_name} address={contract.to} />
          {'\n'}
          <Text sub>from </Text>
          {creditFrom(contract)}
        </Text>
      );
    }

    case 'MIGRATE': {
      return (
        <Text>
          <Text style={styles.operation}>Migrate</Text>
          <Text sub> trust key to </Text>
          <Account name={contract.account_name} address={contract.account} />
          {'\n'}
          <Text sub>from </Text>
          <Hash>{contract.trustkey}</Hash>
        </Text>
      );
    }

    case 'AUTHORIZE': {
      return (
        <Text>
          <Text style={styles.operation}>Authorize</Text>
          <Text sub> transaction </Text>
          <Hash>{contract.txid}</Hash>
          {'\n'}
          <Text sub>with a temporal proof </Text>
          <Hash>{contract.proof}</Hash>
        </Text>
      );
    }

    case 'FEE': {
      return (
        <Text>
          <Text style={styles.operation}>Fee</Text>
          <Text sub> from </Text>
          <Account name={contract.from_name} address={contract.from} />
        </Text>
      );
    }

    case 'LEGACY': {
      return (
        <Text>
          <Text style={styles.operation}>Legacy</Text>
          <Text sub> debit from </Text>
          <Account name={contract.from_name} address={contract.from} />
          {'\n'}
          <Text sub>to </Text>
          <Account address={contract.to} />
        </Text>
      );
    }

    default: {
      return <Text style={styles.operation}>{contract.OP}</Text>;
    }
  }
};

export default function Contract({ contract }) {
  const sign = getDeltaSign(contract);
  return (
    <View style={styles.contract}>
      <View style={styles.contractContent}>{contractContent(contract)}</View>

      {!!contract.amount && (
        <Delta negative={sign === '-'}>
          {sign}
          {contract.amount}{' '}
          {contract.token ? TokenName.from({ contract }) : 'NXS'}
        </Delta>
      )}
    </View>
  );
}
