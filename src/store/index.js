import configureStore from "./configureStore";
import getInitialState from "./getInitialState";

export async function createStore() {
  const initialState = await getInitialState();
  return configureStore(initialState);
}
