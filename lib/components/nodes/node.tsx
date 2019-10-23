import * as React from "react";
import * as Path from "path";
import { Menu as MenuType, MenuItem as MenuItemType, remote } from "electron";

import { INode } from "../../store/modules/substrate/types";

const { Menu, MenuItem } = remote;

export interface ContextItem {
  label: string;
  click: (node: INode) => void;
}

export type Props = {
  node: INode,
  accountContextItems: ContextItem[],
  onClick: (label: string, node: INode) => void,
};

type State = {
  itemMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
  },
};

export class NodeComponent extends React.Component<Props, State> {
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
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "node.svg");
    return (
      <li className="node">
        <img className="icon" src={path} />
        <span className="name">{this.props.node.name}</span>
        <span className="url">{this.props.node.endpoint}</span>
      </li>
    );
  }

  private initContext(label: string, enabled: boolean): MenuItemType {
    return new MenuItem({
      label,
      click: () => this.props.onClick(label, this.props.node),
      enabled,
    });
  }

  private initAccountsMenuItems(): MenuItemType[] {
    return this.props.accountContextItems.map(val =>
      this.initContext(val.label, true),
    );
  }
}
