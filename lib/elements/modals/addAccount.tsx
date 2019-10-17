import * as React from "react";
import { ModalComponent } from "../../components/modal";

export type Props = {};

type State = {};

export class AddAccount extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        Add account
      </ModalComponent>
    );
  }
}
