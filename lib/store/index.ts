import { createStore, combineReducers } from "redux";

import { tabs } from "./modules";

const systemReducers = {
  tabs: tabs.reducers.reducer,
};

const rootReducer = combineReducers(systemReducers);

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  return createStore(rootReducer);
}
