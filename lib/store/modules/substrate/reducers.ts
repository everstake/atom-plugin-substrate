import { Keyring } from '@polkadot/keyring';

import {
  SubstrateActionTypes,
  SubstrateState, IInitSubstrateAction,
} from "./types";

export type ActionTypes = IInitSubstrateAction;

const initialState: SubstrateState = {
  isConnected: false,
  keyring: new Keyring({ type: 'sr25519' }),

  accounts: [],
};

export function reducer(
  state = initialState,
  action: ActionTypes,
): SubstrateState {
  switch (action.type) {
    case SubstrateActionTypes.INIT: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
