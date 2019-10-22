import * as React from "react";

import { ModalComponent } from "../../components/modal";
import { TextInputComponent } from "../../components/inputs/text";
import { DefaultButtonComponent } from "../../components/buttons/default";

export interface Props {
  closeModal: () => void;
  confirmClick: () => void;
};

interface State {
  path: string;
};

const DefaultState: State = {
  path: "",
};

export class ImportAccount extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="import-account">
        <TextInputComponent
          className="path"
          type="text"
          title="Account file path"
          placeholder=""
          value={this.state.path}
          onChange={(val: string) => this.setState({ path: val })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Import account"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm(e: React.MouseEvent) {
    console.log(this.state);
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
