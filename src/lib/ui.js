import { LayoutAnimation, Keyboard } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';
import newUID from 'utils/newUID';

export function toggleTransactionsFilter() {
  LayoutAnimation.easeInEaseOut();
  Keyboard.dismiss();
  getStore().dispatch({
    type: TYPE.TOGGLE_TRANSACTIONS_FILTER,
  });
}

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
