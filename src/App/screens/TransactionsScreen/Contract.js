import React from 'react';
import { View } from 'react-native';

import Text from 'components/Text';
import TokenName from 'components/TokenName';
import SvgIcon from 'components/SvgIcon';
import { getDeltaSign } from 'lib/contracts';
import { getStore } from 'store';
import walletIcon from 'icons/wallet.svg';
import tokenIcon from 'icons/token.svg';

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

const accountLabel = ({ name, address, local, namespace, mine }) => {
  if (name) {
    if (namespace) {
      return namespace + '::' + name;
    }

    if (local) {
      const prefix = mine ? '' : <Text sub>(?):</Text>;
      return (
        <Text>
          {prefix}
          {name}
        </Text>
      );
    }

    return name;
  }

  const store = getStore();
  const contacts = store?.getState().contacts;
  const match =
    contacts &&
    Object.entries(contacts).find(
      ([name, contactAddress]) => address === contactAddress
    );
  if (match) {
    return match[0];
  }

  return null;
};

const Register = ({ name, address, local, namespace, mine, type }) => {
  const label = accountLabel({ name, address, local, namespace, mine });
  const typeIcon =
    type === 'ACCOUNT' || type === 'TRUST'
      ? walletIcon
      : type === 'TOKEN'
      ? tokenIcon
      : null;
  const display = label ? <Text>{label}</Text> : <Hash>{address}</Hash>;
  return (
    <Text>
      {!!typeIcon && (
        <>
          <Text>&nbsp;</Text>
          <SvgIcon icon={typeIcon} size={12} />
          <Text>&nbsp;</Text>
        </>
      )}
      <Text bold>{display}</Text>
    </Text>
  );
};

const creditFrom = (contract) => {
  switch (contract.for) {
    case 'DEBIT':
      return contract.from ? (
        <Register {...contract.from} />
      ) : (
        <Register {...contract.to} />
      ); //If no from then these are return credits

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
          <Register address={contract.address} />
        </Text>
      );
    }

    case 'APPEND': {
      return (
        <Text>
          <Text style={styles.operation}>Append</Text>
          <Text sub> data to </Text>
          <Register address={contract.address} />
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
          <Register address={contract.address} /> to{' '}
          <Register address={contract.destination} />
        </Text>
      );
    }

    case 'CLAIM': {
      return (
        <Text>
          <Text style={styles.operation}>Claim</Text>
          <Text sub> ownership of </Text>
          <Register address={contract.address} />
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
          <Register {...contract.from} />
          {'\n'}
          <Text sub>to </Text>
          <Register {...contract.to} />
        </Text>
      );
    }

    case 'CREDIT': {
      return (
        <Text>
          <Text style={styles.operation}>Credit</Text>
          <Text sub> to </Text>
          <Register {...contract.to} />
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
          <Register name={contract.account_name} address={contract.account} />
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
          <Register {...contract.from} />
        </Text>
      );
    }

    case 'LEGACY': {
      return (
        <Text>
          <Text style={styles.operation}>Legacy</Text>
          <Text sub> debit from </Text>
          <Register {...contract.from} />
          {'\n'}
          <Text sub>to </Text>
          <Register address={contract.to.address} />
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
