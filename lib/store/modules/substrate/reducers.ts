import {
  SubstrateActionTypes,
  SubstrateState, IAddAccountSubstrateAction,
} from "./types";

export type ActionTypes = IAddAccountSubstrateAction;

const initialState: SubstrateState = {
  isConnected: false,
  accounts: [],
};

export function reducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState {
  switch (action.type) {
    case SubstrateActionTypes.ADD_ACCOUNT: {
      return {
        ...state,
        accounts: [
          ...state.accounts,
          action.payload,
        ],
      };
    }
    default:
      return state;
  }
}
