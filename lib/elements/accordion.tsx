import * as React from "react";
import { CompositeDisposable } from "atom";

import { AccountsBodyPanel } from "./body/accounts";
import { ExtrinsicsBodyPanel } from "./body/extrinsics";
import { NodesBodyPanel } from "./body/nodes";

export type Props = {
  changePanel: (newPanel: string) => void,
  panel: string,
};

type State = {
  active: string,
};

export class AccordionPanel extends React.Component<Props, State> {
  public state: State = {
    active: "Nodes",
  };
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const buttonValues = ["Nodes", "Accounts", "Extrinsics"];
    const buttons = buttonValues.map((val, index) => this.getButton(index, val));
    const panel = this.getBodyPanel();
    return (
      <div className="accordion">
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
    const panel = this.getBodyPanel();
    return (
      <div key={index} className={className} onClick={onButtonClick}>
        <div className="tab-label">{value}</div>
        <div className="tab-content">{panel}</div>
      </div>
    );
  }
  private getBodyPanel() {
    switch (this.props.panel) {
      case "nodes":
        return <NodesBodyPanel />;
      case "accounts":
        return <AccountsBodyPanel />;
      case "extrinsics":
        return <ExtrinsicsBodyPanel />;
    }
    return <span>Invalid panel!</span>;
  }
}
