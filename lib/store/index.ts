import { createStore, combineReducers } from "redux";

import * as systems from "./systems";

const systemReducers = Object.keys(systems).map((key, _) => {
  const system = (systems as any)[key];
  console.log(systems);
  return system.reducer;
});

const rootReducer = combineReducers(systemReducers as any);

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  return createStore(rootReducer);
}
