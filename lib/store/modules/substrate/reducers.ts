import {
  SubstrateActionTypes,
  SubstrateState,
  IAddAccountSubstrateAction,
  IRemoveAccountSubstrateAction,
} from "./types";

export type ActionTypes =
  | IAddAccountSubstrateAction
  | IRemoveAccountSubstrateAction;

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
    case SubstrateActionTypes.REMOVE_ACCOUNT: {
      const accounts = state.accounts;
      const index = accounts.findIndex((val) => val.meta['name'] === action.payload);
      if (index === -1) {
        return state;
      }
      accounts.splice(index, 1);
      return { ...state, accounts };
    }
    default:
      return state;
  }
}
