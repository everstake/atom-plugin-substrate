import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {};

type State = {};

export class ExtrinsicsBodyPanel extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="extrinsics">
        <span>Extrinsics panel</span>
      </div>
    );
  }
}
