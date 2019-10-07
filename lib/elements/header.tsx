import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {
  changePanel: (newPanel: string) => void,
};

type State = {
  active: string,
};

export class HeaderPanel extends React.Component<Props, State> {
  public state: State = {
    active: "Nodes",
  };
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
    const onButtonClick = (_event: React.MouseEvent) => {
      this.props.changePanel(value);
      this.setState({ active: value });
    };
    const isActive = this.state.active === value ? "active" : "";
    const className = `button ${isActive}`
    return (
      <div key={index} className={className} onClick={onButtonClick}>
        <span>{value}</span>
      </div>
    );
  }
}
