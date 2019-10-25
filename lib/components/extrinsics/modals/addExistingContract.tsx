import * as React from "react";
import { Abi } from '@polkadot/api-contract';

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { ICode, IContract } from "../../../store/modules/substrate/types";

export interface Props {
  codes: ICode[];
  closeModal: () => void;
  confirmClick: (contract: IContract) => void;
};

interface State {
  name: string;
  hash: string;
  abi?: Abi;
};

const DefaultState: State = {
  name: "",
  hash: "",
};

export class AddExistingContract extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <TextInputComponent
          className="name"
          type="text"
          title="Contract name"
          placeholder="ex. Flipper contract"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <TextInputComponent
          className="hash"
          type="text"
          title="Contract hash"
          placeholder="ex. 0xa54a4b44bb0a02b53a59bd47b478dcf1cc451eaee651bebc1bef5fa423b7014b"
          value={this.state.hash}
          onChange={(val: string) => this.setState({ hash: val })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Add existing code"
            onClick={() => this.handleConfirm()}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm() {
    const { name, hash, abi } = this.state;
    if (!name.trim().length) {
      atom.notifications.addError("Invalid name");
      return;
    }
    if (!hash.trim().length) {
      atom.notifications.addError("Invalid hash");
      return;
    }
    if (!abi) {
      atom.notifications.addError("Invalid abi");
      return;
    }
    this.props.confirmClick({ name, address: hash, abi: abi.toString() });
    this.props.closeModal();
  }
}
