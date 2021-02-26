import { combineReducers } from 'redux';

import status from './status';
import balances from './balances';
import accounts from './accounts';
import tokens from './tokens';
import registrationTxids from './registrationTxids';

export default combineReducers({
  status,
  balances,
  accounts,
  tokens,
  registrationTxids,
});
