import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';
import newUID from 'utils/newUID';

export const showNotification = (content, options) => {
  const store = getStore();
  const id = newUID();
  store.dispatch({
    type: TYPE.SHOW_NOTIFICATION,
    payload: {
      id,
      content,
      options,
    },
  });
};

export const dismissNotification = (id) => {
  const store = getStore();
  store.dispatch({
    type: TYPE.DISMISS_NOTIFICATION,
    payload: id,
  });
};
