import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {};

type State = {};

export class SidebarPanel extends React.Component<Props, State> {
  private subscriptions = new CompositeDisposable();

  constructor(props: Props) {
    super(props);
    this.state = {} as State;
  }

  public render(): JSX.Element {
    return (
      <div className="substrate-plugin-sidebar">
        <p>Sidebar works!</p>
      </div>
    );
  }
}
