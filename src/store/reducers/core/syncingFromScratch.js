import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_CORE_INFO: {
      const coreInfo = action.payload;
      if (!coreInfo || coreInfo.testnet || coreInfo.private) {
        return false;
      }
      //first system/get/info can come without syncing, mainnet height is far above 3M
      if (coreInfo.blocks < 3000000 && !coreInfo.synchronized) {
        return true;
      }
      if (!coreInfo.syncing) {
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
