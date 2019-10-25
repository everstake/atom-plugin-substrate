import * as React from "react";
import * as Path from "path";
import { Menu as MenuType, MenuItem as MenuItemType, remote } from "electron";

import { INode } from "../../store/modules/substrate/types";

const { Menu, MenuItem } = remote;

export interface ContextItem {
  label: string;
  click: (node: INode) => void;
}

export interface Props {
  isConnected: boolean;
  isSelected: boolean;

  node: INode;
  accountContextItems: ContextItem[];
  onClick: (label: string, node: INode) => void;
};

interface State {
  itemMenu: {
    menu: MenuType;
    menuItems: MenuItemType[];
  };
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
    let path = Path.join(pkgPath, "substrate-plugin", "assets", "dark");
    if (this.props.isSelected) {
      if (this.props.isConnected) {
        path = Path.join(path, "connected.svg");
      } else {
        path = Path.join(path, "disconnected.svg");
      }
    } else {
      path = Path.join(path, "node.svg");
    }
    return (
      <li className="node" onClick={() => this.state.itemMenu.menu.popup({})}>
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
