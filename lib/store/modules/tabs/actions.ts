import { ActionTypes, PanelType } from "./types";

export function setPanels(panels: PanelType[]) {
  return {
    type: ActionTypes.SET_TABS,
    payload: panels,
  };
}

export function togglePanel(id: number) {
  return {
    type: ActionTypes.TOGGLE_PANEL,
    payload: id,
  };
}
