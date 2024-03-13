import { combineReducers } from 'redux';

import contactSearch from './contactSearch';
import notifications from './notifications';
import dialogs from './dialogs';
import ignoreSavedSession from './ignoreSavedSession';
import transactionsFilter from './transactionsFilter';

export default combineReducers({
  contactSearch,
  notifications,
  dialogs,
  ignoreSavedSession,
  transactionsFilter,
});
