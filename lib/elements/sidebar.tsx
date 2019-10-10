import * as React from "react";
import { CompositeDisposable } from "atom";
import { HeaderPanel } from "./header";
import { BodyPanel } from "./body";
import { AccordionPanel } from "./accordion";

export type Props = {};

type State = {
  panel: string,
};

export class SidebarPanel extends React.Component<Props, State> {
  public state: State = {
    panel: "nodes",
  };
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="substrate-plugin-sidebar">
        <AccordionPanel changePanel={this.onPanelChange.bind(this)} panel={this.state.panel} />
      </div>
    );
  }

  private onPanelChange(newPanel: string) {
    const panel = newPanel.toLowerCase();
    this.setState({ panel });
  }
}
