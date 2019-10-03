import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {
  changePanel: (newPanel: string) => void,
};

type State = {};

export class HeaderPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const buttonValues = ["Nodes", "Accounts", "Extrinsics"];
    const buttons = buttonValues.map(val => this.getButton(val));
    return (
      <div className="header">
        {buttons}
      </div>
    );
  }

  private getButton(value: string) {
    const onButtonClick = (event: React.MouseEvent) => {
      this.props.changePanel(value);
    };
    return (
      <div className="button" onClick={onButtonClick}>
        <span>{value}</span>
      </div>
    );
  }
}
