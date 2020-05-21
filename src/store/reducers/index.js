import { combineReducers } from 'redux';

import settings from './settings';
import notifications from './notifications';

export default function createRootReducer() {
  return combineReducers({
    settings,
    notifications,
  });
}
