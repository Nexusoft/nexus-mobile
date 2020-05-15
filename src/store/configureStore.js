import { createStore } from 'redux';

import createRootReducer from './reducers';

const rootReducer = createRootReducer();

export default function configureStore(initialState) {
  console.log('init', initialState);
  return createStore(rootReducer, initialState);
}
