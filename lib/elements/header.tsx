import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {};

type State = {};

export class HeaderPanel extends React.Component<Props, State> {
  private subscriptions = new CompositeDisposable();

  constructor(props: Props) {
    super(props);
    this.state = {} as State;
  }

  public render(): JSX.Element {
    return (
      <div className="header">
        <div className="button">
          <span>Accounts</span>
        </div>
        <div className="button">
          <span>Nodes</span>
        </div>
        <div className="button">
          <span>Extrinsics</span>
        </div>
      </div>
    );
  }
}
