import { getStore } from 'store';
import * as TYPE from 'consts/actionTypes';

import { selectSetting } from './settings';

let timerId = null;
export async function refreshMarketPrice() {
  const store = getStore();
  try {
    clearTimeout(timerId);
    const baseCurrency = selectSetting('baseCurrency')(store.getState());

    const response = await fetch(
      `https://nexus-wallet-server.onrender.com/market-data?base_currency=${baseCurrency}`
    );
    const data = await response.json();

    if (data?.price) {
      store.dispatch({
        type: TYPE.UPDATE_MARKET_PRICE,
        payload: data.price,
      });
    }
  } catch (err) {
    console.error(err);
    store.dispatch({
      type: TYPE.UPDATE_MARKET_PRICE,
      payload: null,
    });
  } finally {
    timerId = setTimeout(refreshMarketPrice, 900000); // 15 minutes
  }
}

export async function pollMarketPrice() {
  refreshMarketPrice();
  getStore().observe(
    ({ settings: { baseCurrency } }) => baseCurrency,
    refreshMarketPrice
  );
}
