// Describing the shape of the system's slice of state
export interface PanelType {
  id: number;
  title: string;
  closed: boolean;
};

export interface SystemState {
  panels: PanelType[];
}

// Describing the different ACTION NAMES available
export const TOGGLE_PANEL = "TOGGLE_PANEL";

interface TogglePanelAction {
  type: typeof TOGGLE_PANEL;
  payload: SystemState;
}

export type SystemActionTypes = TogglePanelAction;
