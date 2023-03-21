import * as TYPE from 'consts/actionTypes';

// null indicates that the wallet hasn't checked for user session yet
const initialState = 
{
  open: false,
  saved: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.OPEN_UNLOCK_SCREEN:
      return {...state, open: true};

    case TYPE.CLOSE_UNLOCK_SCREEN:
      return {open: false, saved: action.payload};

    default:
      return state;
  }
};
