import * as React from "react";
import { KeyringPair$Json } from "@polkadot/keyring/types";

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";

export type Props = {
  pair: KeyringPair$Json;
  closeModal: () => void;
  confirmClick: (
    name: string,
  ) => void;
};

type State = {
  name: string,
};

const DefaultState: State = {
  name: "",
};

export class RenameAccount extends React.Component<Props, State> {
  public state: State = DefaultState;

  componentDidMount() {
    this.setState({
      name: this.props.pair.meta.name,
    });
  }

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <TextInputComponent
          className="name"
          type="text"
          title="Account name"
          placeholder="Alice"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Rename account"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm(_: React.MouseEvent) {
    this.props.confirmClick(this.state.name);
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
