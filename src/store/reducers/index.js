import { combineReducers } from 'redux';

import settings from './settings';

export default function createRootReducer() {
  return combineReducers({
    settings,
  });
}
