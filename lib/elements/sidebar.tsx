import * as React from "react";
import { CompositeDisposable } from "atom";
import { HeaderPanel } from "./header";
import { BodyPanel } from "./body";

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
        <HeaderPanel />
        <BodyPanel />
      </div>
    );
  }
}
