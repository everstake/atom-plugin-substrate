import {
  SubstrateActionTypes,
  SubstrateState,
  IAddAccountSubstrateAction,
  IRemoveAccountSubstrateAction,
  IRenameAccountSubstrateAction,
  IAddNodeSubstrateAction,
} from "./types";

export type ActionTypes =
  | IAddAccountSubstrateAction
  | IRemoveAccountSubstrateAction
  | IRenameAccountSubstrateAction
  | IAddNodeSubstrateAction;

const initialState: SubstrateState = {
  isConnected: false,
  accounts: [],
  nodes: [],
};

export function reducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState {
  let accountsResult = accountsReducer(state, action);
  if (accountsResult) {
    return accountsResult;
  }
  let nodesResult = nodesReducer(state, action);
  if (nodesResult) {
    return nodesResult;
  }
  return state;
}

function accountsReducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState | null {
  switch (action.type) {
    case SubstrateActionTypes.ADD_ACCOUNT: {
      const accounts = state.accounts || [];
      const index = accounts.findIndex(
        (val) => val.meta['name'] === action.payload.meta.name,
      );
      if (index !== -1) {
        atom.notifications.addError("Account with same name already exists");
        return state;
      }
      accounts.push(action.payload);
      return { ...state, accounts };
    }
    case SubstrateActionTypes.REMOVE_ACCOUNT: {
      const accounts = state.accounts || [];
      const index = accounts.findIndex((val) => val.meta['name'] === action.payload);
      if (index === -1) {
        return state;
      }
      accounts.splice(index, 1);
      return { ...state, accounts };
    }
    case SubstrateActionTypes.RENAME_ACCOUNT: {
      const accounts = state.accounts || [];
      return {
        ...state,
        accounts: accounts.map(val => {
          if (val.meta.name === action.payload.oldName) {
            val.meta.name = action.payload.newName
          }
          return val;
        }),
      };
    }
    default:
      return null;
  }
}

function nodesReducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState | null {
  switch (action.type) {
    case SubstrateActionTypes.ADD_NODE: {
      const nodes = state.nodes || [];
      const index = nodes.findIndex((val) => val.name === action.payload.name);
      if (index !== -1) {
        atom.notifications.addError("Node with same name already exists");
        return state;
      }
      nodes.push(action.payload);
      return { ...state, nodes };
    }
    default:
      return null;
  }
}
