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
    const buttons = buttonValues.map((val, index) => this.getButton(index, val));
    return (
      <div className="header">
        {buttons}
      </div>
    );
  }

  private getButton(index: number, value: string) {
    const onButtonClick = (event: React.MouseEvent) => {
      this.props.changePanel(value);
    };
    return (
      <div key={index} className="button" onClick={onButtonClick}>
        <span>{value}</span>
      </div>
    );
  }
}
