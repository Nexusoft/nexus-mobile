import * as TYPE from 'consts/actionTypes';

const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.ADD_TRANSACTIONS:
      const { endReached } = action.payload;
      return typeof endReached === 'boolean' ? endReached : state;

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
