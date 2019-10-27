import * as React from "react";
import * as fs from "fs";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect as reduxConnect } from "react-redux";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { RegistryTypes } from '@polkadot/types/types';
import * as clipboard from 'clipboardy';

import { getTypesPath } from "../helpers";
import { initMenuItem, initAccountContextItemModal } from "../../components/modal";
import { CodeComponent, CodeContextItem } from "../../components/extrinsics/code";
import { ContractComponent, ContractContextItem } from "../../components/extrinsics/contract";
import { RunExtrinsics } from "../../components/extrinsics/modals/runExtrinsics";
import { SubChainState } from "../../components/extrinsics/modals/subChainState";
import { AddExistingCode } from "../../components/extrinsics/modals/addExistingCode";
import { AddExistingContract } from "../../components/extrinsics/modals/addExistingContract";
import { UploadWasm } from "../../components/extrinsics/modals/uploadWasm";
import { DeployContract } from "../../components/extrinsics/modals/deployContract";
import { CallContract } from "../../components/extrinsics/modals/callContract";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { IAccount, INode, ICode, IContract } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
import {
  updateConnectedNode, connect, disconnect,
  addCode, removeCode,
  addContract, removeContract,
} from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export interface Props {
  id: number;

  tabs: TabsState;
  accounts: IAccount[];
  nodes: INode[];
  codes: ICode[];
  contracts: IContract[];
  isConnected: boolean;
  connectedNode?: string;

  togglePanel: typeof togglePanel;
  updateConnectedNode: typeof updateConnectedNode,
  connect: typeof connect,
  disconnect: typeof disconnect,
  addCode: typeof addCode,
  removeCode: typeof removeCode,
  addContract: typeof addContract,
  removeContract: typeof removeContract,
};

interface State {
  tabMenu: MenuType;
  codeContextItems: CodeContextItem[];
  contractContextItems: ContractContextItem[];

  api?: ApiPromise;
};

class ExtrinsicsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: new Menu(),

    codeContextItems: [{
      label: "Copy hash",
      click: this.copyHash.bind(this),
    }, {
      label: "Forget code hash",
      click: this.forgetCodeHash.bind(this),
    }],
    contractContextItems: [{
      label: "Call contract",
      click: this.callContract.bind(this),
    }, {
      label: "Copy hash",
      click: this.copyHash.bind(this),
    }, {
      label: "Forget contract address",
      click: this.forgetContractHash.bind(this),
    }],
  };

  componentDidMount() {
    const { tabMenu } = this.state;
    tabMenu.append(new MenuItem(this.runExtrinsics()));
    tabMenu.append(new MenuItem(this.subChainState()));
    tabMenu.append(new MenuItem({ type: "separator" }));
    tabMenu.append(new MenuItem(this.addExistingCode()));
    tabMenu.append(new MenuItem(this.uploadWasm()));
    tabMenu.append(new MenuItem({ type: "separator" }));
    tabMenu.append(new MenuItem(this.addExistingContract()));
    tabMenu.append(new MenuItem(this.deployContract()));
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

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    const codes = this.props.codes.map((code: ICode, idx: number) => {
      return (
        <CodeComponent
          key={idx}
          code={code}
          accountContextItems={this.state.codeContextItems}
          onClick={(label: string, code: ICode) => {
            this.state.codeContextItems.forEach(val => {
              if (val.label === label) {
                val.click(code);
                return;
              }
            })
          }}
        />
      );
    });
    const contracts = this.props.contracts.map((contract: IContract, idx: number) => {
      return (
        <ContractComponent
          key={idx}
          contract={contract}
          accountContextItems={this.state.contractContextItems}
          onClick={(label: string, contract: IContract) => {
            this.state.contractContextItems.forEach(val => {
              if (val.label === label) {
                val.click(contract);
                return;
              }
            })
          }}
        />
      );
    });
    const showSeparator = codes.length <= 0 || contracts.length <= 0;
    return (
      <TabComponent
        className="extrinsics"
        panel={val}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.tabMenu.popup({})}
      >
        {codes}
        {showSeparator ? undefined : <div className="separator"></div>}
        {contracts}
      </TabComponent>
    );
  }

  async setupConnection() {
    const node = this.props.connectedNode;
    const conNode = this.props.nodes.find(val => val.name === node);
    if (conNode) {
      await this.connectTo(conNode.name, conNode.endpoint);
    }
  }

  async disconnect() {
    if (this.state.api) {
      console.log("Disconnecting");
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
      const api = new ApiPromise({
        provider,
        types: {
          ...types,
        },
      });
      api.on("error", ConnectionHandler.create((totalRetries: number) => {
        if (totalRetries >= 5) {
          atom.notifications.addError("Failed to connect");
          api.disconnect();
        }
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
    return initMenuItem(label, true, SubChainState, confirm, {}, beforeClick, () => ({
      api: this.state.api,
      accounts: this.props.accounts,
    }));
  }

  private addExistingCode(): MenuItemConstructorOptions {
    const label = 'Add existing code';
    const confirm = (code: ICode) => {
      this.props.addCode(code);
      this.forceUpdate();
    };
    return initMenuItem(label, true, AddExistingCode, confirm, {});
  }

  private uploadWasm(): MenuItemConstructorOptions {
    const beforeClick = (): boolean => {
      if (!this.state.api || !this.props.isConnected) {
        atom.notifications.addError("Not connected to node");
        return true;
      }
      return false;
    };
    const label = 'Upload WASM';
    const confirm = (code: ICode) => {
      this.props.addCode(code);
      this.forceUpdate();
    };
    return initMenuItem(label, true, UploadWasm, confirm, {}, beforeClick, () => ({
      api: this.state.api,
      accounts: this.props.accounts,
      codes: this.props.codes,
    }));
  }

  private addExistingContract(): MenuItemConstructorOptions {
    const label = 'Add existing contract';
    const confirm = (contract: IContract) => {
      this.props.addContract(contract);
      this.forceUpdate();
    };
    return initMenuItem(label, true, AddExistingContract, confirm, {});
  }

  private callContract(contract: IContract) {
    const mod = initAccountContextItemModal(CallContract, {
      api: this.state.api,
      accounts: this.props.accounts,
      contract,
    }, () => {
      // this.props.renameAccount(pair.meta.name, name);
    }, () => mod.hide());
    mod.show();
  }

  private deployContract(): MenuItemConstructorOptions {
    const beforeClick = (): boolean => {
      // if (!this.state.api || !this.props.isConnected) {
      //   atom.notifications.addError("Not connected to node");
      //   return true;
      // }
      return false;
    };
    const label = 'Deploy contract';
    const confirm = (contract: IContract) => {
      this.props.addContract(contract);
      this.forceUpdate();
    };
    return initMenuItem(label, true, DeployContract, confirm, {}, beforeClick, () => ({
      api: this.state.api,
      accounts: this.props.accounts,
      codes: this.props.codes,
      contracts: this.props.contracts,
    }));
  }

  private copyHash({ address }: { address: string }) {
    clipboard.writeSync(address);
  }

  private forgetCodeHash(code: ICode) {
    this.props.removeCode(code.name);
    this.forceUpdate();
  }

  private forgetContractHash(contract: IContract) {
    this.props.removeContract(contract.name);
    this.forceUpdate();
  }
}

export class ConnectionHandler {
  public totalRetries = 0;
  public callback = (_: number) => {};

  constructor(callback: (totalRetries: number) => void) {
    this.callback = callback;
  }

  static create(callback: (totalRetries: number) => void): (...args: any[]) => any {
    const conhan = new ConnectionHandler(callback);
    return conhan.handle.bind(conhan);
  }

  handle(...args: any[]): any {
    for (const arg of args) {
      const msg = (arg as Error).message;
      if (msg && msg.indexOf("Unable to find plain type for") !== -1) {
        atom.notifications.addError("You have to specify types at extrinsic panel to connect");
        this.callback(this.totalRetries);
        return;
      }
    }
    this.callback(this.totalRetries);
    this.totalRetries++;
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  accounts: state.substrate.accounts,
  nodes: state.substrate.nodes,
  codes: state.substrate.codes,
  contracts: state.substrate.contracts,
  isConnected: state.substrate.isConnected,
  connectedNode: state.substrate.connectedNode,
});

export default reduxConnect(
  mapStateToProps,
  {
    togglePanel, updateConnectedNode, connect, disconnect,
    addCode, removeCode,
    addContract, removeContract,
  }
)(ExtrinsicsBodyPanel);
