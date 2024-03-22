import { combineReducers } from 'redux';

import info from './info';
import syncingFromScratch from './syncingFromScratch';

export default combineReducers({ info, syncingFromScratch });
