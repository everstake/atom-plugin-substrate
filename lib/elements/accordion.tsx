import * as React from "react";
import { CompositeDisposable } from "atom";

import { AccountsBodyPanel } from "./body/accounts";
import { ExtrinsicsBodyPanel } from "./body/extrinsics";
import { NodesBodyPanel } from "./body/nodes";

export type Props = {
  changePanel: (newPanel: string) => void,
};

type State = {
  active: string,
};

export class AccordionPanel extends React.Component<Props, State> {
  public state: State = {
    active: "nodes",
  };
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const buttonValues = ["nodes", "accounts", "extrinsics"];
    const buttons = buttonValues.map((val, index) => this.getTab(index, val));
    return (
      <div className="accordion">
        {buttons}
      </div>
    );
  }

  private getTab(index: number, value: string) {
    const onButtonClick = (_event: React.MouseEvent) => {
      this.props.changePanel(value);
      this.setState({ active: value });
    };
    const isActive = this.state.active === value ? "active" : "";
    const className = `tab-label ${isActive}`;
    const panelName = this.getBodyPanelName(value);
    const panel = this.getBodyPanel(value);
    return (
      <div key={index} className="tab">
        <div className={className} onClick={onButtonClick}>{panelName}</div>
        <div className="tab-content">{panel}</div>
      </div>
    );
  }

  private getBodyPanelName(value: string): string {
    switch (value) {
      case "nodes":
        return "My node connections";
      case "accounts":
        return "My accounts";
      case "extrinsics":
        return "Available extrinsics";
    }
    return "Invalid panel name";
  }

  private getBodyPanel(value: string) {
    switch (value) {
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
