import { KeyringPair$Json } from "@polkadot/keyring/types";
import {
  SubstrateActionTypes,
  IAddAccountSubstrateAction,
} from "./types";

export function addAccount(account: KeyringPair$Json): IAddAccountSubstrateAction {
  return {
    type: SubstrateActionTypes.ADD_ACCOUNT,
    payload: account,
  };
}
