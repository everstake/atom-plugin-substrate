import { KeyringPair$Json } from "@polkadot/keyring/types";

export interface SubstrateState {
  isConnected: boolean;
  accounts: KeyringPair$Json[],
}

// Describing the different ACTION NAMES available
export enum SubstrateActionTypes {
  ADD_ACCOUNT = "ADD_ACCOUNT",
}

export interface IBaseAction {
  type: SubstrateActionTypes,
}

export interface IAddAccountSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.ADD_ACCOUNT;
  payload: KeyringPair$Json;
}
