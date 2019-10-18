import { SubstrateActionTypes, IInitSubstrateAction } from "./types";

export function init(): IInitSubstrateAction {
  return {
    type: SubstrateActionTypes.INIT,
  };
}
