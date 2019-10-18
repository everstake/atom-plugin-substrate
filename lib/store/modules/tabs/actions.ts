import { TabsActionTypes, PanelType } from "./types";

export function setPanels(panels: PanelType[]) {
  return {
    type: TabsActionTypes.SET_TABS,
    payload: panels,
  };
}

export function togglePanel(id: number) {
  return {
    type: TabsActionTypes.TOGGLE_PANEL,
    payload: id,
  };
}
