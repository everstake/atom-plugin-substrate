import * as React from "react";
import { CompositeDisposable } from "atom";

export type Props = {};

type State = {};

export class BodyPanel extends React.Component<Props, State> {
  private subscriptions = new CompositeDisposable();

  constructor(props: Props) {
    super(props);
    this.state = {} as State;
  }

  public render(): JSX.Element {
    return (
      <div className="body">
        <span>Sidebar works!</span>
      </div>
    );
  }
}
