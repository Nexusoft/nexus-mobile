import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_CORE_INFO: {
      const coreInfo = action.payload;
      // Sometimes first system/get/info call doesn't return syncing
      // TODO: handle testnet differently
      if (coreInfo?.blocks < 3000000) {
        return true;
      }
      if (!coreInfo?.syncing) {
        return false;
      }
      if (coreInfo?.syncing?.completed < 50) {
        return true;
      }
      return state;
    }

    case TYPE.DISCONNECT_CORE:
      return initialState;

    default:
      return state;
  }
};
