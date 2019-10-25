import * as React from "react";
import * as Path from "path";
import { Menu as MenuType, MenuItem as MenuItemType, remote } from "electron";

import { ICode } from "../../store/modules/substrate/types";

const { Menu, MenuItem } = remote;

export interface CodeContextItem {
  label: string;
  click: (code: ICode) => void;
}

export type Props = {
  code: ICode,
  accountContextItems: CodeContextItem[],
  onClick: (label: string, code: ICode) => void,
};

type State = {
  itemMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
  },
};

export class CodeComponent extends React.Component<Props, State> {
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
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "code.svg");
    return (
      <li className="code" onClick={() => this.state.itemMenu.menu.popup({})}>
        <img className="icon" src={path} />
        <span className="name">{this.props.code.name}</span>
        <span className="hash">{this.props.code.address}</span>
      </li>
    );
  }

  private initContext(label: string, enabled: boolean): MenuItemType {
    return new MenuItem({
      label,
      click: () => this.props.onClick(label, this.props.code),
      enabled,
    });
  }

  private initAccountsMenuItems(): MenuItemType[] {
    return this.props.accountContextItems.map(val =>
      this.initContext(val.label, true),
    );
  }
}
