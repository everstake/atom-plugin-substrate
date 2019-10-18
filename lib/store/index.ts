import { createStore, combineReducers } from "redux";

import { tabs, substrate } from "./modules";

const systemReducers = {
  substrate: substrate.reducers.reducer,
  tabs: tabs.reducers.reducer,
};

const rootReducer = combineReducers(systemReducers);

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  return createStore(rootReducer);
}
