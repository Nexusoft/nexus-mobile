export const getDeltaSign = (contract) => {
  switch (contract.OP) {
    case 'CREDIT':
    case 'COINBASE':
    case 'TRUST':
    case 'GENESIS':
    case 'MIGRATE':
      return '+';

    case 'DEBIT':
    case 'FEE':
    case 'LEGACY':
      return '-';

    default:
      return '';
  }
};

//amount colours of money in / out
export const deltaColor = (sign) =>
  sign === '-' ? '#d9534f' : sign === '+' ? '#1b9e5a' : undefined;
