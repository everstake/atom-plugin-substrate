import { Abi } from "@polkadot/api-contract";
import { KeyringPair$Json } from "@polkadot/keyring/types";

export interface IAccount extends KeyringPair$Json {}
export interface INode {
  name: string;
  endpoint: string;
}
export interface IContract {
  name: string;
  address: string;
  abi: Abi;
}
export interface ICode {
  name: string;
  address: string;
}

export interface SubstrateState {
  isConnected: boolean;
  connectedNode?: string;

  accounts: IAccount[];
  nodes: INode[];
  codes: ICode[];
  contracts: IContract[];
}

// Describing the different ACTION NAMES available
export enum SubstrateActionTypes {
  /* Accounts */
  ADD_ACCOUNT = "ADD_ACCOUNT",
  REMOVE_ACCOUNT = "REMOVE_ACCOUNT",
  RENAME_ACCOUNT = "RENAME_ACCOUNT",
  /* Nodes */
  ADD_NODE = "ADD_NODE",
  REMOVE_NODE = "REMOVE_NODE",
  EDIT_NODE = "EDIT_NODE",
  UPDATE_CONNECTED_NODE = "UPDATE_CONNECTED_NODE",
  /* Connection */
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  /* Contracts */
  ADD_CODE = "ADD_CODE",
  REMOVE_CODE = "REMOVE_CODE",
  ADD_CONTRACT = "ADD_CONTRACT",
  REMOVE_CONTRACT = "REMOVE_CONTRACT",
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

export interface IRemoveNodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.REMOVE_NODE;
  payload: string;
}

export interface IEditNodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.EDIT_NODE;
  payload: { oldName: string, node: INode };
}

export interface IUpdateConnectedNodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.UPDATE_CONNECTED_NODE;
  payload: string | undefined;
}

/* Connection */

export interface IConnectSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.CONNECT;
}

export interface IDisonnectSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.DISCONNECT;
}

/* Contracts */

export interface IAddCodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.ADD_CODE;
  payload: ICode;
}

export interface IRemoveCodeSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.REMOVE_CODE;
  payload: string;
}

export interface IAddContractSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.ADD_CONTRACT;
  payload: IContract;
}

export interface IRemoveContractSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.REMOVE_CONTRACT;
  payload: string;
}
