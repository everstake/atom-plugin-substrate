import * as React from "react";

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { INode } from "../../../store/modules/substrate/types";

export type Props = {
  node: INode;
  closeModal: () => void;
  confirmClick: (node: INode) => void;
};

type State = {
  name: string,
  endpoint: string,
};

const DefaultState: State = {
  name: "",
  endpoint: "",
};

export class EditNode extends React.Component<Props, State> {
  public state: State = DefaultState;

  componentDidMount() {
    this.setState({
      name: this.props.node.name,
      endpoint: this.props.node.endpoint,
    });
  }

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <TextInputComponent
          className="name"
          type="text"
          title="Node name"
          placeholder="Alice"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <TextInputComponent
          className="endpoint"
          type="text"
          title="Node endpoint"
          placeholder="ws://127.0.0.1:9944"
          value={this.state.endpoint}
          onChange={(val: string) => this.setState({ endpoint: val })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Edit node"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  private handleConfirm(_: React.MouseEvent) {
    const { name, endpoint } = this.state;
    this.props.confirmClick({ name, endpoint });
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
