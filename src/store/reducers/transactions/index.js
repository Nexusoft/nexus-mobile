import { combineReducers } from 'redux';

import txMap from './txMap';
import loadedAll from './loadedAll';
import filter from './filter';

export default combineReducers({ txMap, loadedAll, filter });
