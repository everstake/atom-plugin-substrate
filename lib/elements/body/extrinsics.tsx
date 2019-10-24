import * as React from "react";
import * as fs from "fs";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect as reduxConnect } from "react-redux";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { RegistryTypes } from '@polkadot/types/types';

import { getTypesPath } from "../helpers";
import { initMenuItem } from "../../components/modal";
import { RunExtrinsics } from "../../components/extrinsics/modals/runExtrinsics";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { IAccount, INode } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
import { updateConnectedNode, connect, disconnect } from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export interface Props {
  id: number;

  tabs: TabsState;
  accounts: IAccount[];
  nodes: INode[];
  isConnected: boolean;
  connectedNode?: string;
  togglePanel: typeof togglePanel;
  updateConnectedNode: typeof updateConnectedNode,
  connect: typeof connect,
  disconnect: typeof disconnect,
};

interface State {
  tabMenu: MenuType;

  api?: ApiPromise;
};

class ExtrinsicsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: new Menu(),
  };

  componentDidMount() {
    const { tabMenu } = this.state;
    tabMenu.append(new MenuItem(this.runExtrinsics()));
    tabMenu.append(new MenuItem(this.subChainState()));
    this.setState({ tabMenu });

    this.setupConnection();
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.connectedNode) {
      this.disconnect();
      return;
    }
    const isChanged = prevProps.connectedNode !== this.props.connectedNode;
    if (isChanged) {
      this.setupConnection();
    }
  }

  async setupConnection() {
    const node = this.props.connectedNode;
    const conNode = this.props.nodes.find(val => val.name === node);
    if (conNode) {
      await this.connectTo(conNode.name, conNode.endpoint);
    }
  }

  async disconnect() {
    console.log("Disconnecting");
    if (this.state.api) {
      this.state.api.disconnect();
      this.setState({ api: undefined });
    }
    this.props.disconnect();
    this.props.updateConnectedNode(undefined);
  }

  async getTypes(): Promise<RegistryTypes | undefined> {
    try {
      const filePath = getTypesPath();
      const buf = fs.readFileSync(filePath);
      return JSON.parse(buf.toString());
    } catch (err) {
      atom.notifications.addError(`File with types not found: ${err.message}`);
      return;
    }
  }

  async connectTo(name: string, endpoint: string) {
    console.log("Connecting");
    try {
      const types = await this.getTypes();
      const provider = new WsProvider(endpoint);
      const api = new ApiPromise({ provider, types });
      api.on("error", ConnectionHandler.create(5, () => {
        atom.notifications.addError("Failed to connect");
        api.disconnect();
        this.props.disconnect();
      }));
      await api.isReady;
      this.setState({ api });
      this.props.connect();
      console.log("Connected");
    } catch (err) {
      atom.notifications.addError(`Error on connect: ${err.message}`);
    }
    this.props.updateConnectedNode(name);
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    // const nds = this.props.substrate.nodes;
    // const nodes = nds.map((node: INode, index: number) => {
    //   return (
    //     <NodeComponent
    //       key={index}
    //       node={node}
    //       accountContextItems={this.state.contextItems}
    //       onClick={this.handleMenuClick.bind(this)}
    //     />
    //   );
    // });
    return (
      <TabComponent
        className="extrinsics"
        panel={val}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.tabMenu.popup({})}
      >
      </TabComponent>
    );
  }

  private runExtrinsics(): MenuItemConstructorOptions {
    const beforeClick = (): boolean => {
      if (!this.state.api || !this.props.isConnected) {
        atom.notifications.addError("Not connected to node");
        return true;
      }
      return false;
    };
    const label = 'Run extrinsics';
    const confirm = () => {
      this.forceUpdate();
    };
    return initMenuItem(label, true, RunExtrinsics, confirm, {}, beforeClick, () => ({
      api: this.state.api,
      accounts: this.props.accounts,
    }));
  }

  private subChainState(): MenuItemConstructorOptions {
    const beforeClick = (): boolean => {
      if (!this.state.api || !this.props.isConnected) {
        atom.notifications.addError("Not connected to node");
        return true;
      }
      return false;
    };
    const label = 'Subscribe for chain state';
    const confirm = () => {
      this.forceUpdate();
    };
    return initMenuItem(label, true, RunExtrinsics, confirm, {}, beforeClick, () => ({
      api: this.state.api,
      accounts: this.props.accounts,
    }));
  }
}

export class ConnectionHandler {
    public totalRetries = 0;
    public maxRetries = 0;
    public callback = () => {};

    constructor(maxRetries: number, callback: () => void) {
        this.maxRetries = maxRetries;
        this.callback = callback;
    }

    static create(maxRetries: number, callback: () => void): (...args: any[]) => any {
        const conhan = new ConnectionHandler(maxRetries, callback);
        return conhan.handle.bind(conhan);
    }

    handle(...args: any[]): any {
        for (const arg of args) {
            const msg = (arg as Error).message;
            if (msg && msg.indexOf("Unable to find plain type for") !== -1) {
                atom.notifications.addError("You have to specify types at extrinsic panel to connect");
                this.callback();
                return;
            }
        }
        if (this.totalRetries >= this.maxRetries) {
            this.callback();
            return;
        }
        this.totalRetries++;
    }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  accounts: state.substrate.accounts,
  nodes: state.substrate.nodes,
  isConnected: state.substrate.isConnected,
  connectedNode: state.substrate.connectedNode,
});

export default reduxConnect(
  mapStateToProps,
  { togglePanel, updateConnectedNode, connect, disconnect }
)(ExtrinsicsBodyPanel);
