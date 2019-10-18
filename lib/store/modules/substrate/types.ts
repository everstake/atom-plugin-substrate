import { Keyring } from '@polkadot/keyring';

export interface SubstrateState {
  isConnected: boolean;
  keyring: Keyring;

  // Todo: Replace with real account type
  accounts: string[];
}

// Describing the different ACTION NAMES available
export enum SubstrateActionTypes {
  INIT = "INIT",
}

export interface IBaseAction {
  type: SubstrateActionTypes,
}

export interface IInitSubstrateAction extends IBaseAction {
  type: SubstrateActionTypes.INIT;
}
