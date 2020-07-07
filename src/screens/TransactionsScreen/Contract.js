import React from 'react';
import styled from '@emotion/native';

import Text from 'components/Text';
import { getDeltaSign } from 'lib/contracts';

const ContractWrapper = styled.View({
  padding: 20,
  paddingLeft: 0,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const ContractContent = styled.View({
  flex: 1,
});

const Operation = styled.Text({
  textTransform: 'uppercase',
  fontFamily: 'noto-sans-bold',
  fontWeight: 'bold',
});

const AccountName = styled.Text({});

const RegisterType = styled.Text({
  textTransform: 'lowercase',
});

const Delta = styled(Text)(({ theme, negative }) => ({
  color: negative ? theme.danger : theme.primary,
  // opacity: sign === '-' ? 0.6 : 1,
  fontSize: 14,
}));

const Hash = ({ children, ...rest }) => {
  if (!children || typeof children !== 'string' || children.length <= 11) {
    return <Text {...rest}>{children}</Text>;
  } else {
    return (
      <Text mono {...rest}>
        {children.slice(0, 6)}...{children.slice(-5)}
      </Text>
    );
  }
};

const Account = ({ name, address }) =>
  name ? <AccountName>{name}</AccountName> : <Hash>{address}</Hash>;

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
          <Operation>Write</Operation>
          <Text sub> data to </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'APPEND': {
      return (
        <Text>
          <Operation>Append</Operation>
          <Text sub> data to </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'CREATE': {
      return (
        <Text>
          <Operation>Create</Operation>
          <Text sub> new </Text>
          <RegisterType>
            {contract.type === 'OBJECT' && contract.object_type + ' '}
            {contract.type}
          </RegisterType>
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
          <Operation>Transfer</Operation>
          <Text sub> ownership of </Text>
          <Account address={contract.address} /> to{' '}
          <Account address={contract.destination} />
        </Text>
      );
    }

    case 'CLAIM': {
      return (
        <Text>
          <Operation>Claim</Operation>
          <Text sub> ownership of </Text>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'COINBASE': {
      return (
        <Text>
          <Operation>Coinbase</Operation>
        </Text>
      );
    }

    case 'TRUST': {
      return (
        <Text>
          <Operation>Trust</Operation>
        </Text>
      );
    }

    case 'GENESIS': {
      return (
        <Text>
          <Operation>Genesis</Operation> <Hash>{contract.address}</Hash>
        </Text>
      );
    }

    case 'DEBIT': {
      return (
        <Text>
          <Operation>Debit</Operation>
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
          <Operation>Credit</Operation>
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
          <Operation>Migrate</Operation>
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
          <Operation>Authorize</Operation>
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
          <Operation>Fee</Operation>
          <Text sub> from </Text>
          <Account name={contract.from_name} address={contract.from} />
        </Text>
      );
    }

    case 'LEGACY': {
      return (
        <Text>
          <Operation>Legacy</Operation>
          <Text sub> debit from </Text>
          <Account name={contract.from_name} address={contract.from} />
          {'\n'}
          <Text sub>to </Text>
          <Account address={contract.to} />
        </Text>
      );
    }

    default: {
      return <Operation>{contract.OP}</Operation>;
    }
  }
};

export default function Contract({ contract }) {
  const sign = getDeltaSign(contract);
  return (
    <ContractWrapper>
      <ContractContent>{contractContent(contract)}</ContractContent>

      {!!contract.amount && (
        <Delta negative={sign === '-'}>
          {sign}
          {contract.amount} {contract.token_name || 'NXS'}
        </Delta>
      )}
    </ContractWrapper>
  );
}
