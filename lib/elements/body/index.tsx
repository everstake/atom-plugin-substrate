import * as React from "react";
import { CompositeDisposable } from "atom";

import { AccountsBodyPanel } from "./accounts";
import { ExtrinsicsBodyPanel } from "./extrinsics";
import { NodesBodyPanel } from "./nodes";

export type Props = {
  panel: string,
};

type State = {};

export class BodyPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const panel = this.getBodyPanel();
    return (
      <div className="body">
        {panel}
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
