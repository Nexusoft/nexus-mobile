import { combineReducers } from 'redux';

import status from './status';
import balances from './balances';

export default combineReducers({ status, balances });
