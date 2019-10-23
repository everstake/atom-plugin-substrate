import * as React from "react";
import * as fs from "fs";
import * as Path from "path";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect } from "react-redux";

import { MenuItemType, initModal, initAccountContextItemModal } from "../../components/modal";
import { NodeComponent, ContextItem } from "../../components/nodes/node";
import { AddNode } from "../../components/nodes/modals/addNode";
import { EditNode } from "../../components/nodes/modals/editNode";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { INode, SubstrateState } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
import { addNode, removeNode, editNode } from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export type Props = {
  id: number,
  tabs: TabsState,
  substrate: SubstrateState,
  togglePanel: typeof togglePanel,
  addNode: typeof addNode,
  removeNode: typeof removeNode,
  editNode: typeof editNode,
};

type State = {
  tabMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
  },

  contextItems: ContextItem[],
};

class NodesBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: {
      menu: new Menu(),
      menuItems: [],
    },

    contextItems: [{
      label: "Remove node",
      click: this.removeNode.bind(this),
    }, {
      label: "Edit node",
      click: this.editNode.bind(this),
    }],
  };

  componentDidMount() {
    const { tabMenu } = this.state;
    tabMenu.menuItems = this.initMenuItems();
    tabMenu.menuItems.forEach((val) => {
      tabMenu.menu.append(new MenuItem(val.item));
    });
    this.setState({ tabMenu });
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    const nds = this.props.substrate.nodes;
    const nodes = nds.map((node: INode, index: number) => {
      return (
        <NodeComponent
          key={index}
          node={node}
          accountContextItems={this.state.contextItems}
          onClick={this.handleMenuClick.bind(this)}
        />
      );
    });
    return (
      <TabComponent
        className="nodes"
        panel={val}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.tabMenu.menu.popup({})}
      >
        {nodes}
      </TabComponent>
    );
  }

  private initMenuItems(): MenuItemType[] {
    const menuItems = [];
    menuItems.push(this.addNode());
    menuItems.push({ item: { type: "separator" } as MenuItemConstructorOptions });
    menuItems.push(this.editTypes());
    menuItems.push(this.disconnectFromNode());
    // menuItems.push({ item: { type: "separator" } as MenuItemConstructorOptions });
    // menuItems.push(this.startLocalNode());
    // menuItems.push(this.stopLocalNode());
    // menuItems.push(this.clearChainData());
    return menuItems;
  }

  private handleMenuClick(label: string, node: INode) {
    this.state.contextItems.forEach(val => {
      if (val.label === label) {
        val.click(node);
        return;
      }
    })
  }

  private addNode(): MenuItemType {
    const label = 'Add node';
    const confirm = (name: string, endpoint: string) => {
      this.props.addNode(name, endpoint);
      this.forceUpdate();
    };
    return initModal(label, true, AddNode, confirm, this.getModalClick(label));
  }

  private editTypes(): MenuItemType {
    const label = 'Edit types';
    const confirm = async () => {
      const types = await this.getTypes();
      await this.openTypesEditor(types);
    };
    return { item: { label, click: confirm, enabled: true } };
  }

  private disconnectFromNode(): MenuItemType {
    const label = 'Disconnect from node';
    const confirm = () => {
      // Todo:
      this.forceUpdate();
    };
    return { item: { label, click: confirm, enabled: true } };
  }

  // private startLocalNode(): MenuItemType {
  //   const label = 'Start local node';
  //   const confirm = () => {
  //     const packages = atom.packages.getActivePackages();
  //     const pkg = packages.find(val => val.name === "atom-ide-terminal");
  //     if (!pkg) {
  //       atom.notifications.addError("Atom IDE Terminal not installed");
  //       return;
  //     }
  //     console.log(pkg);
  //   };
  //   return { item: { label, click: confirm, enabled: true } };
  // }
  //
  // private stopLocalNode(): MenuItemType {
  //   const label = 'Stop local node';
  //   const confirm = () => {
  //     // Todo:
  //     this.forceUpdate();
  //   };
  //   return { item: { label, click: confirm, enabled: true } };
  // }
  //
  // private clearChainData(): MenuItemType {
  //   const label = 'Clear chain data';
  //   const confirm = () => {
  //     // Todo:
  //     this.forceUpdate();
  //   };
  //   return { item: { label, click: confirm, enabled: true } };
  // }

  private getModalClick(label: string) {
    return () => {
      const menuItems = this.state.tabMenu.menuItems;
      const item = menuItems.find(val => val.item.label === label);
      if (!item) {
        return console.error("Invalid item");
      }
      const modal = item.modal;
      if (!modal) {
        return;
      }
      modal.visible ? modal.hide() : modal.show();
    };
  }

  private removeNode(node: INode) {
    this.props.removeNode(node.name);
    this.forceUpdate();
  }

  private async editNode(oldNode: INode) {
    const mod = initAccountContextItemModal(
      EditNode, { node: oldNode },
      (node: INode) => {
        this.props.editNode(oldNode.name, node);
      },
      () => mod.hide(),
    );
    mod.show();
  }

  // Todo: Move to helper
  private getTypesPath(): string {
    const pkgPath = atom.packages.getPackageDirPaths()[0];
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "types.json");
    return path;
  }

  // private getLocalNodeScript(): string {
  //   const pkgPath = atom.packages.getPackageDirPaths()[0];
  //   const path = Path.join(pkgPath, "substrate-plugin", "assets", "local_node.js");
  //   return path;
  // }

  private async openTypesEditor(data: string) {
    const path = this.getTypesPath();
    try {
      await fs.promises.writeFile(path, data, "utf8");
    } catch (err) {}
    await atom.workspace.open(path, {});
  }

  private async getTypes(): Promise<string> {
    const path = this.getTypesPath();
    try {
      const buf = await fs.promises.readFile(path);
      return buf.toString();
    } catch (err) {
      return "{}\n";
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  substrate: state.substrate,
});

export default connect(
  mapStateToProps,
  { togglePanel, addNode, removeNode, editNode }
)(NodesBodyPanel);
