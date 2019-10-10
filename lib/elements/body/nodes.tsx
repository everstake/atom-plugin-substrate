import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu as MenuType, remote } from "electron";

import { NavbarComponent, NodeComponent } from "../../components";

const { Menu, MenuItem } = remote;

export type Props = {};

type State = {
  menu: MenuType,
};

export class NodesBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
  };
  private subscriptions = new CompositeDisposable();

  componentDidMount() {
    this.initMenu();
  }

  public render(): JSX.Element {
    return (
      <ul className="nodes">
        <NodeComponent name={"Default"} url={"ws://127.0.0.1:9944"} />
        <NodeComponent name={"Example"} url={"wss://poc3.example.com"} />
      </ul>
    );
  }

  private initMenu() {
    const menu = this.state.menu;
    menu.append(new MenuItem({
      label: 'Add node',
      click: () => console.log(1),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Start local node',
      click: () => console.log(2),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Stop local node',
      click: () => console.log(3),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Clear chain data',
      click: () => console.log(4),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Disconnect from node',
      click: () => console.log(5),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Edit types',
      click: () => console.log(6),
      enabled: true,
    }));
    this.setState({ menu });
  }
}
