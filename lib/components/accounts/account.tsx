import * as React from "react";
import * as Path from "path";
import { Menu as MenuType, MenuItem as MenuItemType, remote } from "electron";
import { KeyringPair$Json } from "@polkadot/keyring/types";

const { Menu, MenuItem } = remote;

export interface ContextItem {
  label: string;
  click: (pair: KeyringPair$Json) => void;
}

export type Props = {
  pair: KeyringPair$Json,
  accountContextItems: ContextItem[],
  onClick: (label: string, pair: KeyringPair$Json) => void,
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
        <span className="name">{this.props.pair.meta.name}</span>
        <span className="hash">{this.props.pair.address}</span>
      </li>
    );
  }

  private initContext(label: string, enabled: boolean): MenuItemType {
    return new MenuItem({
      label,
      click: () => this.props.onClick(label, this.props.pair),
      enabled,
    });
  }

  private initAccountsMenuItems(): MenuItemType[] {
    return this.props.accountContextItems.map(val =>
      this.initContext(val.label, true),
    );
  }
}
