import { KeyringPair$Json } from "@polkadot/keyring/types";
import {
  SubstrateActionTypes,
  IAddAccountSubstrateAction,
  IRemoveAccountSubstrateAction,
  IRenameAccountSubstrateAction,
  IAddNodeSubstrateAction,
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
