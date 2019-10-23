import * as React from "react";
import * as fs from "fs";
import { Menu as MenuType, remote } from "electron";
import { connect } from "react-redux";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";
import { KeypairType } from "@polkadot/util-crypto/types";
import * as clipboard from 'clipboardy';

import { MenuItemType, initModal, initAccountContextItemModal } from "../../components/modal";
import { AccountComponent, ContextItem } from "../../components/accounts";
import { AddAccount } from "../../components/accounts/modals/addAccount";
import { ImportAccount } from "../../components/accounts/modals/importAccount";
import { RenameAccount } from "../../components/accounts/modals/RenameAccount";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { addAccount, removeAccount, renameAccount } from "../../store/modules/substrate/actions";
import { togglePanel } from "../../store/modules/tabs/actions";

const { Menu, MenuItem, dialog } = remote;

export type Props = {
  id: number,
  tabs: TabsState,
  accounts: KeyringPair$Json[],
  togglePanel: typeof togglePanel,
  addAccount: typeof addAccount,
  removeAccount: typeof removeAccount,
  renameAccount: typeof renameAccount,
};

type State = {
  tabMenu: {
    menu: MenuType,
    menuItems: MenuItemType[],
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
      label: "Rename account",
      click: this.renameAccount.bind(this),
    }, {
      label: "Remove account",
      click: this.removeAccount.bind(this),
    }, {
      label: "Export account",
      click: this.exportAccount.bind(this),
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
    const accounts = this.props.accounts.map((pair: KeyringPair$Json, index: number) => {
      return (
        <AccountComponent
          key={index}
          pair={pair}
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

  private initMenuItems(): MenuItemType[] {
    const menuItems = [];
    menuItems.push(this.addAccount());
    menuItems.push(this.importAccount());
    return menuItems;
  }

  private addAccount(): MenuItemType {
    const label = 'Add account';
    const confirm = (name: string, keypairType: KeypairType, seed: string, pass: string) => {
      const keyring = new Keyring({ type: keypairType });
      const pair = keyring.addFromUri(seed, { name }, keypairType);
      const json = pair.toJson(pass);
      this.props.addAccount(json);
      this.forceUpdate();
    };
    return initModal(label, true, AddAccount, confirm, this.getModalClick(label));
  }

  private importAccount(): MenuItemType {
    const label = 'Import acccount';
    const confirm = (path: string) => {
      const rawdata = fs.readFileSync(path);
      const pair: KeyringPair$Json = JSON.parse(rawdata.toString());
      const exKey = this.props.accounts.find((val) => val.meta.name === name);
      if (exKey) {
        atom.notifications.addError("Account with same name already exists");
        return;
      }
      this.props.addAccount(pair);
      this.forceUpdate();
    };
    return initModal(label, true, ImportAccount, confirm, this.getModalClick(label));
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

  private handleAccountMenuClick(label: string, pair: KeyringPair$Json) {
    this.state.accountContextItems.forEach(val => {
      if (val.label === label) {
        val.click(pair);
        return;
      }
    })
  }

  private copyAddress(pair: KeyringPair$Json) {
    clipboard.writeSync(pair.address);
  }

  private removeAccount(pair: KeyringPair$Json) {
    this.props.removeAccount(pair.meta.name);
    this.forceUpdate();
  }

  private async exportAccount(pair: KeyringPair$Json) {
    const savePath: any = await dialog.showSaveDialog({});
    if (!savePath) {
      return;
    }
    fs.writeFileSync(savePath, JSON.stringify(pair), "utf8");
  }

  private async renameAccount(pair: KeyringPair$Json) {
    const mod = initAccountContextItemModal(RenameAccount, { pair }, (name: string) => {
      this.props.renameAccount(pair.meta.name, name);
    }, () => mod.hide());
    mod.show();
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  accounts: state.substrate.accounts,
});

export default connect(
  mapStateToProps,
  { togglePanel, addAccount, removeAccount, renameAccount }
)(AccountsBodyPanel);
