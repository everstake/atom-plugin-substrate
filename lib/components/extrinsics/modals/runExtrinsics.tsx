import * as React from "react";

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";

export type Props = {
  closeModal: () => void;
  confirmClick: () => void;
};

type State = {};

const DefaultState: State = {};

export class RunExtrinsics extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Confirm"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm(_: React.MouseEvent) {
    this.props.confirmClick();
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
