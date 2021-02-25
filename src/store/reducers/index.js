import { combineReducers } from 'redux';

import ui from './ui';
import settings from './settings';
import contacts from './contacts';
import core from './core';
import user from './user';
import market from './market';
import transactions from './transactions';

export default function createRootReducer() {
  return combineReducers({
    ui,
    settings,
    contacts,
    core,
    user,
    market,
    transactions,
  });
}
