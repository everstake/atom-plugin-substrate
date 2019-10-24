import {
  SubstrateActionTypes,
  SubstrateState,
  IAddAccountSubstrateAction,
  IRemoveAccountSubstrateAction,
  IRenameAccountSubstrateAction,
  IAddNodeSubstrateAction,
  IRemoveNodeSubstrateAction,
  IEditNodeSubstrateAction,
  IUpdateConnectedNodeSubstrateAction,
  IConnectSubstrateAction,
  IDisonnectSubstrateAction,
} from "./types";

export type ActionTypes =
  | IAddAccountSubstrateAction
  | IRemoveAccountSubstrateAction
  | IRenameAccountSubstrateAction
  | IAddNodeSubstrateAction
  | IRemoveNodeSubstrateAction
  | IEditNodeSubstrateAction
  | IUpdateConnectedNodeSubstrateAction
  | IConnectSubstrateAction
  | IDisonnectSubstrateAction;

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
  let connectionsResult = connectionReducer(state, action);
  if (connectionsResult) {
    return connectionsResult;
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
        atom.notifications.addError("Account not found");
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
    case SubstrateActionTypes.REMOVE_NODE: {
      const nodes = state.nodes || [];
      const index = nodes.findIndex((val) => val.name === action.payload);
      if (index === -1) {
        atom.notifications.addError("Node not found");
        return state;
      }
      nodes.splice(index, 1);
      return { ...state, nodes };
    }
    case SubstrateActionTypes.EDIT_NODE: {
      const nodes = state.nodes || [];
      const index = nodes.findIndex((val) => val.name === action.payload.oldName);
      if (index === -1) {
        atom.notifications.addError("Node not found");
        return state;
      }
      nodes[index] = action.payload.node;
      return { ...state, nodes };
    }
    case SubstrateActionTypes.UPDATE_CONNECTED_NODE: {
      return { ...state, connectedNode: action.payload };
    }
    default:
      return null;
  }
}

function connectionReducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState | null {
  switch (action.type) {
    case SubstrateActionTypes.CONNECT: {
      return { ...state, isConnected: true };
    }
    case SubstrateActionTypes.DISCONNECT: {
      return { ...state, isConnected: false };
    }
    default:
      return null;
  }
}
