import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu, remote } from "electron";

export type Props = {
  title: string,
  menu: Menu,
};

type State = {};

export class TabComponent extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    return (
      <div className="navbar">
        <span className="title">{this.props.title}</span>
        <div className="buttons">
          <div className="button" onClick={this.showActionsMenu.bind(this)}>...</div>
        </div>
      </div>
    );
  }

  private showActionsMenu(event: any) {
    event.preventDefault();
    this.props.menu.popup({
      window: remote.getCurrentWindow(),
    });
  }
}
