import { getStore } from 'store';
import * as TYPE from 'consts/actionTypes';

let timerId = null;
export async function refreshNXSPrice() {
  try {
    clearTimeout(timerId);

    const response = await fetch(
      'https://nexus-wallet-external-services.herokuapp.com/displaydata'
    );
    const content = await response.json();

    if (content?.RAW?.NXS) {
      const prices = Object.entries(content.RAW.NXS).reduce(
        (prices, [symbol, data]) => {
          prices[symbol] = data.PRICE;
          return prices;
        },
        {}
      );
      const store = getStore();
      store.dispatch({
        type: TYPE.UPDATE_PRICES,
        payload: prices,
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    timerId = setTimeout(refreshNXSPrice, 900000); // 15 minutes
  }
}
