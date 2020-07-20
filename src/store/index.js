import configureStore from './configureStore';
import createObserver from './createObserver';

let store = null;

export async function createStore(initialState) {
  store = configureStore(initialState);
  store.observe = createObserver(store);
  return store;
}

export function getStore() {
  return store;
}

export function observeStore(select, onChange) {
  if (!store) throw new Error('Store has not been initialized');
  let currentState = undefined;

  function handleChange() {
    const nextState = select(store.getState());
    if (currentState !== nextState) {
      const oldState = currentState;
      currentState = nextState;
      onChange(currentState, oldState);
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}
