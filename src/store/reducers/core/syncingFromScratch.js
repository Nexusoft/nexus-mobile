import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_CORE_INFO: {
      const syncing = action.payload?.syncing;
      if (!syncing) {
        return false;
      }
      if (syncing?.completed < 50) {
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
