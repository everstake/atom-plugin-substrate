import * as React from "react";
import * as Path from "path";
import { Menu as MenuType, MenuItem as MenuItemType, remote } from "electron";

const { Menu, MenuItem } = remote;

export interface ContextItem {
  label: string;
  click: (name: string, address: string) => void;
}

export type Props = {
  name: string,
  hash: string,
  accountContextItems: ContextItem[],
  onClick: (
    label: string,
    name: string,
    hash: string,
  ) => void,
};

type State = {
  itemMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
  },
};

export class AccountComponent extends React.Component<Props, State> {
  public state: State = {
    itemMenu: {
      menu: new Menu(),
      menuItems: [],
    },
  };

  componentDidMount() {
    const { itemMenu } = this.state;
    itemMenu.menuItems = this.initAccountsMenuItems();
    itemMenu.menuItems.forEach((val) => {
      itemMenu.menu.append(val);
    });
    this.setState({ itemMenu });
  }

  public render(): JSX.Element {
    const pkgPath = atom.packages.getPackageDirPaths()[0];
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "account.svg");
    return (
      <li className="account" onClick={() => this.state.itemMenu.menu.popup({})}>
        <img className="icon" src={path} />
        <span className="name">{this.props.name}</span>
        <span className="hash">{this.props.hash}</span>
      </li>
    );
  }

  private initContext(label: string, enabled: boolean): MenuItemType {
    return new MenuItem({
      label,
      click: () => this.props.onClick(
        label,
        this.props.name,
        this.props.hash,
      ),
      enabled,
    });
  }

  private initAccountsMenuItems(): MenuItemType[] {
    return this.props.accountContextItems.map(val =>
      this.initContext(val.label, true),
    );
  }
}
