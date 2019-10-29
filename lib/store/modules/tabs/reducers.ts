import {
  TabsActionTypes,
  TabsState, ISetTabsAction, ITogglePanelAction,
} from "./types";

export type ActionTypes = ITogglePanelAction | ISetTabsAction;

export const initialState: TabsState = {
  panels: [],
};

export function reducer(
  state = initialState,
  action: ActionTypes,
): TabsState {
  switch (action.type) {
    case TabsActionTypes.SET_TABS: {
      return {
        ...state,
        panels: action.payload,
      };
    }
    case TabsActionTypes.TOGGLE_PANEL: {
      return {
        ...state,
        panels: state.panels.map((val) => {
          if (val.id === action.payload) {
            val.closed = !val.closed;
          }
          return val;
        }),
      };
    }
    default:
      return state;
  }
}
