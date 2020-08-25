import { combineReducers } from 'redux';

import contactSearch from './contactSearch';
import notifications from './notifications';
import dialogs from './dialogs';

export default combineReducers({ contactSearch, notifications, dialogs });
