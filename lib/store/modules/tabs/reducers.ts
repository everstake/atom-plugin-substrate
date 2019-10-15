import {
  ActionTypes,
  TabsState, ISetTabsAction, ITogglePanelAction,
} from "./types";

export type TabsActionTypes = ITogglePanelAction | ISetTabsAction;

const initialState: TabsState = {
  panels: [],
};

export function reducer(
  state = initialState,
  action: TabsActionTypes,
): TabsState {
  switch (action.type) {
    case ActionTypes.SET_TABS: {
      return {
        ...state,
        panels: action.payload,
      };
    }
    case ActionTypes.TOGGLE_PANEL: {
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
