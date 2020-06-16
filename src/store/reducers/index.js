import { combineReducers } from 'redux';

import ui from './ui';
import settings from './settings';
import notifications from './notifications';

export default function createRootReducer() {
  return combineReducers({
    ui,
    settings,
    notifications,
  });
}
