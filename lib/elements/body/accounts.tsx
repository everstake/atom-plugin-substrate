import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu as MenuType, remote } from "electron";

import { NavbarComponent, AccountComponent } from "../../components";

const { Menu, MenuItem } = remote;

export type Props = {};

type State = {
  menu: MenuType,
};

export class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
  };
  private subscriptions = new CompositeDisposable();

  componentDidMount() {
    this.initMenu();
  }

  public render(): JSX.Element {
    return (
      <div className="accounts">
        <NavbarComponent title="My accounts" menu={this.state.menu} />
        <ul>
          <AccountComponent name={"Alice"} hash={"5HCEaRu31DDRfdGjTZ8E5tyRJSHki5d3AnxKeUmuyAfAesx1"} />
          <AccountComponent name={"Bob"} hash={"5HCEaRu31DDRfdGjTZ8E5tyRJSHki5d3AnxKeUmuyAfAesx1"} />
        </ul>
      </div>
    );
  }

  private initMenu() {
    const menu = this.state.menu;
    menu.append(new MenuItem({
      label: 'Add account',
      click: () => console.log(1),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Import acccount',
      click: () => console.log(2),
      enabled: true,
    }));
    this.setState({ menu });
  }
}
