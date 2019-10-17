import * as React from "react";

export type Props = {
  className: string,
};

type State = {};

export class ModalComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className={`substrate-modal ${this.props.className}`}>
        {this.props.children}
      </div>
    );
  }
}
