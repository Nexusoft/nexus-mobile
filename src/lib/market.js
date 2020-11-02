import { getStore } from 'store';
import * as TYPE from 'consts/actionTypes';

let timerId = null;
export async function refreshMarketPrice() {
  try {
    clearTimeout(timerId);
    const store = getStore();
    const {
      settings: { baseCurrency },
    } = store.getState();

    const response = await fetch(
      `https://nexus-wallet-external-services.herokuapp.com/market-price?base_currency=${baseCurrency}`
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
