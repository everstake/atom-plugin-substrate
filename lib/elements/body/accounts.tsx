import * as React from "react";
import { CompositeDisposable } from "atom";

import { AccountComponent } from "../../components";

export type Props = {};

type State = {};

export class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="accounts">
        <div className="navbar">
          <span>My accounts</span>
        </div>
        <ul>
          <AccountComponent name={"Alice"} hash={"5HCEaRu31DDRfdGjTZ8E5tyRJSHki5d3AnxKeUmuyAfAesx1"} />
          <AccountComponent name={"Bob"} hash={"5HCEaRu31DDRfdGjTZ8E5tyRJSHki5d3AnxKeUmuyAfAesx1"} />
        </ul>
      </div>
    );
  }
}
