import * as React from "react";
import { CompositeDisposable } from "atom";
import { AccordionPanel } from "./accordion";

export type Props = {};

type State = {};

export class SidebarPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="substrate-plugin-sidebar">
        <AccordionPanel changePanel={this.onPanelChange.bind(this)} />
      </div>
    );
  }

  private onPanelChange(newPanel: string) {
    const panel = newPanel.toLowerCase();
    this.setState({ panel });
  }
}
