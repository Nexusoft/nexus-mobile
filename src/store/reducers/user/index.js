import { combineReducers } from 'redux';

import status from './status';
import balances from './balances';
import accounts from './accounts';

export default combineReducers({ status, balances, accounts });
