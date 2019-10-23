import { KeyringPair$Json } from "@polkadot/keyring/types";

export interface IAccount extends KeyringPair$Json {}
export interface INode {
  name: string;
  endpoint: string;
}

export interface SubstrateState {
  isConnected: boolean;
  accounts: IAccount[],
  nodes: INode[],
}

// Describing the different ACTION NAMES available
export enum SubstrateActionTypes {
  /* Accounts */
  ADD_ACCOUNT = "ADD_ACCOUNT",
  REMOVE_ACCOUNT = "REMOVE_ACCOUNT",
  RENAME_ACCOUNT = "RENAME_ACCOUNT",
  /* Nodes */
  ADD_NODE = "ADD_NODE",
}

export interface IBaseAction {
  type: SubstrateActionTypes,
}

/* Accounts */

export interface IAddAccountSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.ADD_ACCOUNT;
  payload: IAccount;
}

export interface IRemoveAccountSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.REMOVE_ACCOUNT;
  payload: string;
}

export interface IRenameAccountSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.RENAME_ACCOUNT;
  payload: { oldName: string, newName: string };
}

/* Nodes */

export interface IAddNodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.ADD_NODE;
  payload: INode;
}
