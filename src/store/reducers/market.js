import * as TYPE from 'consts/actionTypes';

const initialState = {
  price: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.UPDATE_MARKET_PRICE:
      return {
        ...state,
        price: action.payload,
      };

    default:
      return state;
  }
};
