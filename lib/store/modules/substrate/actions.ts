import { KeyringPair$Json } from "@polkadot/keyring/types";
import {
  SubstrateActionTypes,
  IAddAccountSubstrateAction,
  IRemoveAccountSubstrateAction,
} from "./types";

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
