import { combineReducers } from 'redux';

import ui from './ui';
import notifications from './notifications';
import settings from './settings';
import contacts from './contacts';

export default function createRootReducer() {
  return combineReducers({
    ui,
    notifications,
    settings,
    contacts,
  });
}
