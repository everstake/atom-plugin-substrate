import * as React from "react";
import { Menu as MenuType, remote } from "electron";
import { connect } from "react-redux";

import { MenuItemType, initModal, initAccountContextItemModal } from "../../components/modal";
import { NodeComponent, ContextItem } from "../../components/nodes";
import { AddNode } from "../../components/nodes/modals/addNode";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { INode, SubstrateState } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
import { addNode } from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export type Props = {
  id: number,
  tabs: TabsState,
  substrate: SubstrateState,
  togglePanel: typeof togglePanel,
  addNode: typeof addNode,
};

type State = {
  tabMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
  },

  nodeContextItems: ContextItem[],
};

class NodesBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: {
      menu: new Menu(),
      menuItems: [],
    },

    nodeContextItems: [],
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
          accountContextItems={this.state.nodeContextItems}
          onClick={this.handleAccountMenuClick.bind(this)}
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
    return menuItems;
  }

  //     label: 'Disconnect from node',
  //     label: 'Edit types',
  //   menu.append(new MenuItem({ type: "separator" }));
  //     label: 'Start local node',
  //     label: 'Stop local node',
  //     label: 'Clear chain data',

  private handleAccountMenuClick(label: string, node: INode) {
    this.state.nodeContextItems.forEach(val => {
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

  // private async removeNode(node: INode) {
  //   const mod = initAccountContextItemModal(RemoveNode, { pair }, (name: string) => {
  //     this.props.renameAccount(pair.meta.name, name);
  //   }, () => mod.hide());
  //   mod.show();
  // }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  substrate: state.substrate,
});

export default connect(
  mapStateToProps,
  { togglePanel, addNode }
)(NodesBodyPanel);
