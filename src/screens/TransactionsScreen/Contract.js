import React from 'react';
import styled from '@emotion/native';

import { Text, SubText } from 'components/Adaptive';
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
          <SubText> data to </SubText>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'APPEND': {
      return (
        <Text>
          <Operation>Append</Operation>
          <SubText> data to </SubText>
          <Account address={contract.address} />
        </Text>
      );
    }

    case 'CREATE': {
      return (
        <Text>
          <Operation>Create</Operation>
          <SubText> new </SubText>
          <RegisterType>
            {contract.type === 'OBJECT' && contract.object_type + ' '}
            {contract.type}
          </RegisterType>
          <SubText> register</SubText>
          {'\n'}
          <SubText>at address </SubText>
          <Hash>{contract.address}</Hash>
        </Text>
      );
    }

    case 'TRANSFER': {
      return (
        <Text>
          <Operation>Transfer</Operation>
          <SubText> ownership of </SubText>
          <Account address={contract.address} /> to{' '}
          <Account address={contract.destination} />
        </Text>
      );
    }

    case 'CLAIM': {
      return (
        <Text>
          <Operation>Claim</Operation>
          <SubText> ownership of </SubText>
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
          <SubText> from </SubText>
          <Account name={contract.from_name} address={contract.from} />
          {'\n'}
          <SubText>to </SubText>
          <Account name={contract.to_name} address={contract.to} />
        </Text>
      );
    }

    case 'CREDIT': {
      return (
        <Text>
          <Operation>Credit</Operation>
          <SubText> to </SubText>
          <Account name={contract.to_name} address={contract.to} />
          {'\n'}
          <SubText>from </SubText>
          {creditFrom(contract)}
        </Text>
      );
    }

    case 'MIGRATE': {
      return (
        <Text>
          <Operation>Migrate</Operation>
          <SubText> trust key to </SubText>
          <Account name={contract.account_name} address={contract.account} />
          {'\n'}
          <SubText>from </SubText>
          <Hash>{contract.trustkey}</Hash>
        </Text>
      );
    }

    case 'AUTHORIZE': {
      return (
        <Text>
          <Operation>Authorize</Operation>
          <SubText> transaction </SubText>
          <Hash>{contract.txid}</Hash>
          {'\n'}
          <SubText>with a temporal proof </SubText>
          <Hash>{contract.proof}</Hash>
        </Text>
      );
    }

    case 'FEE': {
      return (
        <Text>
          <Operation>Fee</Operation>
          <SubText> from </SubText>
          <Account name={contract.from_name} address={contract.from} />
        </Text>
      );
    }

    case 'LEGACY': {
      return (
        <Text>
          <Operation>Legacy</Operation>
          <SubText> debit from </SubText>
          <Account name={contract.from_name} address={contract.from} />
          {'\n'}
          <SubText>to </SubText>
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
