import { combineReducers } from 'redux';

import contactSearch from './contactSearch';
import notifications from './notifications';
import dialogs from './dialogs';
import unlockingWallet from './unlockingWallet';

export default combineReducers({
  contactSearch,
  notifications,
  dialogs,
  unlockingWallet,
});
