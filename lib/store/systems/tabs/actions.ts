import { SystemState, TOGGLE_PANEL } from "./types";

export function togglePanel(newState: SystemState) {
  return {
    type: TOGGLE_PANEL,
    payload: newState
  };
}
