import * as React from "react";
import * as ReactDOM from "react-dom";
import * as fs from "fs";
import { Panel } from "atom";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect } from "react-redux";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";
import { KeypairType } from "@polkadot/util-crypto/types";
import * as clipboard from 'clipboardy';

import { AccountComponent, ContextItem } from "../../components/accounts";
import { AddAccount } from "../modals/addAccount";
import { ImportAccount } from "../modals/importAccount";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { addAccount, removeAccount } from "../../store/modules/substrate/actions";
import { togglePanel } from "../../store/modules/tabs/actions";

const { Menu, MenuItem } = remote;

interface MenuItem {
  item: MenuItemConstructorOptions,
  modal?: Panel;
  contextClick?: (args: any) => void;
};

export type Props = {
  id: number,
  tabs: TabsState,
  accounts: KeyringPair$Json[],
  togglePanel: typeof togglePanel,
  addAccount: typeof addAccount,
  removeAccount: typeof removeAccount,
};

type State = {
  tabMenu: {
    menu: MenuType,
    menuItems: MenuItem[],
  },

  accountContextItems: ContextItem[],
  accountInput: {
    name: string;
    key: string;
  },
};

class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: {
      menu: new Menu(),
      menuItems: [],
    },

    accountContextItems: [{
      label: "Copy address",
      click: this.copyAddress.bind(this),
    }, {
      label: "Remove account",
      click: this.removeAccount.bind(this),
    }],
    accountInput: { name: "", key: "" },
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
    const accounts = this.props.accounts.map(({ address, meta }: KeyringPair$Json, index: number) => {
      return (
        <AccountComponent
          key={index}
          name={meta.name}
          hash={address}
          accountContextItems={this.state.accountContextItems}
          onClick={this.handleAccountMenuClick.bind(this)}
        />
      );
    });
    return (
      <TabComponent
        className="accounts"
        panel={val}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.tabMenu.menu.popup({})}
      >
        {accounts}
      </TabComponent>
    );
  }

  private initMenuItems(): MenuItem[] {
    const menuItems = [];
    menuItems.push(this.initModal('Add account', true, AddAccount, (
      name: string,
      keypairType: KeypairType,
      seed: string,
      pass: string,
    ) => {
      const keyring = new Keyring({ type: keypairType });
      const pair = keyring.addFromUri(seed, { name }, keypairType);
      const json = pair.toJson(pass);
      this.props.addAccount(json);
    }));
    menuItems.push(this.initModal('Import acccount', true, ImportAccount, (path: string) => {
      const rawdata = fs.readFileSync(path);
      const pair: KeyringPair$Json = JSON.parse(rawdata.toString());
      const exKey = this.props.accounts.find((val) => val.meta.name === name);
      if (exKey) {
        atom.notifications.addError("Account with same name already exists");
        return;
      }
      this.props.addAccount(pair);
    }));
    return menuItems;
  }

  // Todo: Move to helper folder
  private initModal(label: string, enabled: boolean, component: any, confirmClick: any): MenuItem {
    const click = () => {
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
    const modal = document.createElement("div");
    ReactDOM.render(React.createElement(component, {
      closeModal: click,
      confirmClick,
    }), modal);
    return {
      item: { label, click, enabled },
      modal: atom.workspace.addModalPanel({
        item: modal,
        visible: false,
      }),
    };
  }

  private handleAccountMenuClick(label: string, name: string, address: string) {
    this.state.accountContextItems.forEach(val => {
      if (val.label === label) {
        val.click(name, address);
        return;
      }
    })
  }

  private copyAddress(_: string, address: string) {
    clipboard.writeSync(address);
  }

  private removeAccount(name: string, _: string) {
    this.props.removeAccount(name);
    this.forceUpdate();
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  accounts: state.substrate.accounts,
});

export default connect(
  mapStateToProps,
  { togglePanel, addAccount, removeAccount }
)(AccountsBodyPanel);
