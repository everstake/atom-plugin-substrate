import * as React from "react";
import { ModalComponent } from "../../components/modal";
import { TextInputComponent } from "../../components/inputs/text";

export type Props = {
  click: () => void;
};

type State = {};

export class AddAccount extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <TextInputComponent className="name" placeholder="Account name" />
        <TextInputComponent className="hash" placeholder="Account address" />
        <button onClick={() => this.props.click()}>Add account</button>
      </ModalComponent>
    );
  }
}
