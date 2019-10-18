import * as React from "react";
import { ModalComponent } from "../../components/modal";
import { DefaultButtonComponent } from "../../components/buttons/default";
import { TextInputComponent } from "../../components/inputs/text";

export type Props = {
  cancelClick: (e: React.MouseEvent) => void;
  confirmClick: (e: React.MouseEvent) => void;
};

type State = {
  name: string,
  hash: string,
};

export class AddAccount extends React.Component<Props, State> {
  public state: State = {
    name: "",
    hash: "",
  };

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <TextInputComponent
          className="name"
          title="Account name"
          placeholder="Alice"
          value={this.state.name}
          onChange={(e: any) => this.setState({ name: e.target.value })}
        />
        <TextInputComponent
          className="hash"
          title="Account address"
          placeholder="0xefbe98e1d2a3b034df8637445f0b1c2a9979cbd8c2dbfe2cfd7910a7fdc236c1"
          value={this.state.hash}
          onChange={(e: any) => this.setState({ hash: e.target.value })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.cancelClick}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Add account"
            onClick={this.props.confirmClick}
          />
        </div>
      </ModalComponent>
    );
  }
}
