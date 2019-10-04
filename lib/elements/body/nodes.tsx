import * as React from "react";
import { CompositeDisposable } from "atom";

import { NodeComponent } from "../../components";

export type Props = {};

type State = {};

export class NodesBodyPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="nodes">
        <div className="navbar">
          <span>My node connections</span>
        </div>
        <ul>
          <NodeComponent name={"Default"} url={"ws://127.0.0.1:9944"} />
          <NodeComponent name={"Example"} url={"wss://poc3.example.com"} />
        </ul>
      </div>
    );
  }
}
