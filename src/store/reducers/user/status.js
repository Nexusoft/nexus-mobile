import * as TYPE from 'consts/actionTypes';

const initialState = {username : null};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.SET_USERNAME:
      return {...state, ...{username: action.payload.username}};
    case TYPE.SET_USER_STATUS:
      return { ...action.payload, ...{username: state.username}};

    case TYPE.DISCONNECT_CORE:
    case TYPE.LOGOUT:
      return initialState;

    default:
      return state;
  }
};
