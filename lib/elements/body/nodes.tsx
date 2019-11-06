import * as React from "react";
import * as fs from "fs";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect } from "react-redux";
import { spawn, exec, ChildProcess } from "child_process";

import { getTypesPath } from "../helpers";
import { initMenuItem, initAccountContextItemModal } from "../../components/modal";
import { NodeComponent, ContextItem } from "../../components/nodes/node";
import { AddNode } from "../../components/nodes/modals/addNode";
import { EditNode } from "../../components/nodes/modals/editNode";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { INode } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
import { addNode, removeNode, editNode, updateConnectedNode, disconnect } from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export interface Props {
  id: number;
  logger?: any;

  tabs: TabsState;
  nodes: INode[];
  isConnected: boolean;
  connectedNode?: string;

  togglePanel: typeof togglePanel;
  addNode: typeof addNode;
  removeNode: typeof removeNode;
  editNode: typeof editNode;
  updateConnectedNode: typeof updateConnectedNode;
  disconnect: typeof disconnect;
};

interface State {
  tabMenu: MenuType;

  contextItems: ContextItem[];

  startedNode?: ChildProcess;
  purgeNode?: ChildProcess;
};

class NodesBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: new Menu(),

    contextItems: [{
      label: "Connect to node",
      click: this.connectToNode.bind(this),
    }, {
      label: "Edit node",
      click: this.editNode.bind(this),
    }, {
      separator: true,
    }, {
      label: "Remove node",
      click: this.removeNode.bind(this),
    }],
  };

  componentDidMount() {
    const { tabMenu } = this.state;
    tabMenu.append(new MenuItem(this.addNode()));
    tabMenu.append(new MenuItem({ type: "separator" }));
    tabMenu.append(new MenuItem(this.editTypes()));
    tabMenu.append(new MenuItem(this.disconnectFromNode()));
    tabMenu.append(new MenuItem({ type: "separator" }));
    tabMenu.append(new MenuItem(this.startLocalNode()));
    tabMenu.append(new MenuItem(this.stopLocalNode()));
    tabMenu.append(new MenuItem(this.clearChainData()));
    tabMenu.append(new MenuItem({ type: "separator" }));
    tabMenu.append(new MenuItem(this.installLocalNode()));
    this.setState({ tabMenu });
  }

  componentWillUnmount() {
    if (this.state.startedNode) {
      this.state.startedNode.kill();
    }
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    const nds = this.props.nodes;
    const nodes = nds.map((node: INode, index: number) => {
      return (
        <NodeComponent
          key={index}
          node={node}
          isSelected={this.props.connectedNode === node.name}
          isConnected={this.props.isConnected}
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
        onActionsClick={() => this.state.tabMenu.popup({})}
      >
        {nodes.length ? nodes : <div className="empty">No nodes found</div>}
      </TabComponent>
    );
  }

  private handleMenuClick(label: string, node: INode) {
    this.state.contextItems.forEach(val => {
      if (val.separator) {
        return;
      }
      if (val.label === label) {
        val.click!(node);
        return;
      }
    })
  }

  private addNode(): MenuItemConstructorOptions {
    const label = 'Add node';
    const confirm = (name: string, endpoint: string) => {
      this.props.addNode(name, endpoint);
      this.forceUpdate();
    };
    return initMenuItem(label, true, AddNode, confirm);
  }

  private editTypes(): MenuItemConstructorOptions {
    const label = 'Edit types';
    const confirm = async () => {
      const types = await this.getTypes();
      await this.openTypesEditor(types);
    };
    return { label, click: confirm, enabled: true };
  }

  private disconnectFromNode(): MenuItemConstructorOptions {
    const label = 'Disconnect from node';
    const confirm = () => {
      this.props.updateConnectedNode(undefined);
      this.forceUpdate();
    };
    return { label, click: confirm, enabled: true };
  }

  private installLocalNode(): MenuItemConstructorOptions {
    const label = 'Install substrate';
    const confirm = () => {
      const logger = this.props.logger;
      if (!logger) {
        const msg = `
          Console Panel package hasn't installed successfully.
          Reload or reinstall substrate-plugin
        `;
        atom.notifications.addError(msg.trim());
        return;
      }
      logger.toggle();
      const install = exec("curl https://getsubstrate.io -sSf | bash -s -- --fast");
      if (install.stdout) {
        install.stdout.on('data', (data: string) => {
          logger.log(`${data}`);
        });
      }
      if (install.stderr) {
        install.stderr.on('data', (data: string) => {
          logger.error(`${data}`);
        });
      }
      install.on('close', (code: number) => {
        if (code === 0) {
          atom.notifications.addSuccess('Substrate installed successfully');
        }
        logger.log(`Install local node process exited with code ${code}`);
      });
    };
    return { label, click: confirm, enabled: true };
  }

  private startLocalNode(): MenuItemConstructorOptions {
    const label = 'Start local node';
    const confirm = () => {
      const logger = this.props.logger;
      if (!logger) {
        const msg = `
          Console Panel package hasn't installed successfully.
          Reload or reinstall substrate-plugin
        `;
        atom.notifications.addError(msg.trim());
        return;
      }
      if (this.state.startedNode) {
        this.state.startedNode.kill();
        this.setState({ startedNode: undefined });
      }
      logger.destroy();
      logger.toggle();
      const paths = atom.project.getPaths();
      if (!paths.length) {
        atom.notifications.addError('Project folder not found');
        return;
      }
      const node = spawn('cargo', ['run', '--', '--dev'], { cwd: paths[0] });
      node.stdout.on('data', (data: any) => {
        logger.log(`${data}`);
      });
      node.stderr.on('data', (data: any) => {
        logger.error(`${data}`);
      });
      node.on('close', (code: any) => {
        logger.log(`Start node process exited with code ${code}`);
        logger.destroy();
      });
      node.on('error', (err: Error) => {
        atom.notifications.addError(`Failed to start node: ${err.message}`);
      });
      this.setState({ startedNode: node });
    };
    return { label, click: confirm, enabled: true };
  }

  private stopLocalNode(): MenuItemConstructorOptions {
    const label = 'Stop local node';
    const confirm = () => {
      const logger = this.props.logger;
      if (!logger) {
        const msg = `
          Console Panel package hasn't installed successfully.
          Reload or reinstall substrate-plugin
        `;
        atom.notifications.addError(msg.trim());
        return;
      }
      if (this.state.startedNode) {
        this.state.startedNode.kill();
      }
      if (this.state.purgeNode) {
        this.state.purgeNode.kill();
      }
      logger.destroy();
      this.setState({ startedNode: undefined, purgeNode: undefined });
      logger.log("Node stopped");
    };
    return { label, click: confirm, enabled: true };
  }

  private clearChainData(): MenuItemConstructorOptions {
    const label = 'Clear chain data';
    const confirm = () => {
      const logger = this.props.logger;
      if (!logger) {
        const msg = `
          Console Panel package hasn't installed successfully.
          Reload or reinstall substrate-plugin
        `;
        atom.notifications.addError(msg.trim());
        return;
      }
      logger.toggle();
      const paths = atom.project.getPaths();
      if (!paths.length) {
        atom.notifications.addError('Project folder not found');
        return;
      }
      const purge = exec(`cd ${paths[0]} && cargo run -- purge-chain --dev -y`);
      if (purge.stdout) {
        purge.stdout.on('data', (data: string) => {
          // atom.notifications.addError(`Failed to purge chain: ${data}`);
          logger.log(`${data}`);
        });
      }
      if (purge.stderr) {
        purge.stderr.on('data', (data: string) => {
          // atom.notifications.addError(`Failed to purge chain: ${data}`);
          logger.error(`${data}`);
        });
      }
      purge.on('close', (code: number) => {
        if (code === 0) {
          atom.notifications.addInfo('Chain purged');
        }
        logger.log(`Clear chain data process exited with code ${code}`);
      });
      this.setState({ purgeNode: purge });
    };
    return { label, click: confirm, enabled: true };
  }

  private removeNode(node: INode) {
    if (this.props.connectedNode === node.name) {
      this.props.disconnect();
      this.props.updateConnectedNode(undefined);
    }
    this.props.removeNode(node.name);
    this.forceUpdate();
  }

  private connectToNode(node: INode) {
    this.props.updateConnectedNode(node.name);
    this.forceUpdate();
  }

  private async editNode(oldNode: INode) {
    const mod = initAccountContextItemModal(
      EditNode, { node: oldNode },
      (node: INode) => {
        this.props.editNode(oldNode.name, node);
        if (this.props.connectedNode === oldNode.name) {
          this.props.updateConnectedNode(node.name);
        }
        this.forceUpdate();
      },
      () => mod.destroy(),
    );
    mod.show();
  }

  private async openTypesEditor(data: string) {
    const path = getTypesPath();
    try {
      await fs.promises.writeFile(path, data, "utf8");
    } catch (err) {}
    await atom.workspace.open(path, {});
  }

  private async getTypes(): Promise<string> {
    const path = getTypesPath();
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
  nodes: state.substrate.nodes,
  isConnected: state.substrate.isConnected,
  connectedNode: state.substrate.connectedNode,
});

export default connect(
  mapStateToProps,
  {
    togglePanel, addNode, removeNode, editNode,
    updateConnectedNode, disconnect,
  }
)(NodesBodyPanel);
