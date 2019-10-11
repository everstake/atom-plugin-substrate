import { TOGGLE_PANEL, SystemState, SystemActionTypes } from "./types";

const initialState: SystemState = {
  panels: [],
};

export function systemReducer(
  state = initialState,
  action: SystemActionTypes,
): SystemState {
  switch (action.type) {
    case TOGGLE_PANEL: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
