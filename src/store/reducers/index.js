import { combineReducers } from 'redux';

import ui from './ui';
import notifications from './notifications';
import dialogs from './dialogs';
import settings from './settings';
import contacts from './contacts';
import core from './core';
import user from './user';
import prices from './prices';

export default function createRootReducer() {
  return combineReducers({
    ui,
    notifications,
    dialogs,
    settings,
    contacts,
    core,
    user,
    prices,
  });
}
