import { combineReducers } from 'redux';

import status from './status';
import balances from './balances';
import accounts from './accounts';
import tokens from './tokens';
import registrationTxids from './registrationTxids';
import transactions from './transactions';

export default combineReducers({
  status,
  balances,
  accounts,
  tokens,
  registrationTxids,
  transactions,
});
