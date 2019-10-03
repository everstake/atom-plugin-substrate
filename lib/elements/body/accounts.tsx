import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {};

type State = {};

export class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="accounts">
        <span>Accounts panel</span>
      </div>
    );
  }
}
