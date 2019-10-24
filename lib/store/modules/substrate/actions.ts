import { KeyringPair$Json } from "@polkadot/keyring/types";
import {
  INode,
  SubstrateActionTypes,
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

/* Accounts */

export function addAccount(account: KeyringPair$Json): IAddAccountSubstrateAction {
  return {
    type: SubstrateActionTypes.ADD_ACCOUNT,
    payload: account,
  };
}

export function removeAccount(name: string): IRemoveAccountSubstrateAction {
  return {
    type: SubstrateActionTypes.REMOVE_ACCOUNT,
    payload: name,
  };
}

export function renameAccount(oldName: string, newName: string): IRenameAccountSubstrateAction {
  return {
    type: SubstrateActionTypes.RENAME_ACCOUNT,
    payload: { oldName, newName },
  };
}

/* Nodes */

export function addNode(name: string, endpoint: string): IAddNodeSubstrateAction {
  return {
    type: SubstrateActionTypes.ADD_NODE,
    payload: { name, endpoint },
  };
}

export function removeNode(name: string): IRemoveNodeSubstrateAction {
  return {
    type: SubstrateActionTypes.REMOVE_NODE,
    payload: name,
  };
}

export function editNode(oldName: string, node: INode): IEditNodeSubstrateAction {
  return {
    type: SubstrateActionTypes.EDIT_NODE,
    payload: { oldName, node },
  };
}

export function updateConnectedNode(name?: string): IUpdateConnectedNodeSubstrateAction {
  return {
    type: SubstrateActionTypes.UPDATE_CONNECTED_NODE,
    payload: name,
  };
}

/* Connection */

export function connect(): IConnectSubstrateAction {
  return {
    type: SubstrateActionTypes.CONNECT,
  };
}

export function disconnect(): IDisonnectSubstrateAction {
  return {
    type: SubstrateActionTypes.DISCONNECT,
  };
}
