// Describing the shape of the system's slice of state
export interface PanelType {
  id: number;
  title: string;
  closed: boolean;
  component: (props: any) => JSX.Element;
};

export interface TabsState {
  panels: PanelType[];
}

// Describing the different ACTION NAMES available
export enum TabsActionTypes {
  TOGGLE_PANEL = "TOGGLE_PANEL",
  SET_TABS = "SET_TABS",
}

export interface IBaseAction {
  type: TabsActionTypes,
}

export interface ISetTabsAction extends IBaseAction {
  type: TabsActionTypes.SET_TABS;
  payload: PanelType[];
}

export interface ITogglePanelAction extends IBaseAction {
  type: TabsActionTypes.TOGGLE_PANEL;
  payload: number;
}
