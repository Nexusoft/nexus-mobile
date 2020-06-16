import { LayoutAnimation, Keyboard } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';

export function toggleTransactionsFilter() {
  LayoutAnimation.easeInEaseOut();
  Keyboard.dismiss();
  getStore().dispatch({
    type: TYPE.TOGGLE_TRANSACTIONS_FILTER,
  });
}
