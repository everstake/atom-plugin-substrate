import * as React from "react";

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { ICode } from "../../../store/modules/substrate/types";

export interface Props {
  closeModal: () => void;
  confirmClick: (code: ICode) => void;
};

interface State {
  name: string;
  hash: string;
};

const DefaultState: State = {
  name: "",
  hash: "",
};

export class AddExistingCode extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <TextInputComponent
          className="name"
          type="text"
          title="Bundle name"
          placeholder="ex. Flipper contract code"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <TextInputComponent
          className="hash"
          type="text"
          title="Code hash"
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
    const { name, hash } = this.state;
    if (!name.trim().length) {
      atom.notifications.addError("Invalid name");
      return;
    }
    if (!hash.trim().length) {
      atom.notifications.addError("Invalid hash");
      return;
    }
    this.props.confirmClick({ name, address: hash });
    this.props.closeModal();
  }
}
