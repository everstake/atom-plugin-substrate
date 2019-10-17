import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel } from "atom";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect } from "react-redux";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";

import { AccountComponent } from "../../components/accounts";
import { AddAccount } from "../modals/addAccount";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { togglePanel } from "../../store/modules/tabs/actions";

const { Menu, MenuItem } = remote;

interface Account {
  name: string;
  key: string;
};

interface MenuItem {
  item: MenuItemConstructorOptions,
  modal: Panel;
};

export type Props = {
  id: number,
  tabs: TabsState,
  togglePanel: typeof togglePanel,
};

type State = {
  menu: MenuType,
  menuItems: MenuItem[],
  keyring: Keyring,

  // Todo: Move to redux storage
  accountInput: Account,
  accounts: KeyringPair$Json[],
};

class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
    menuItems: [],
    keyring: new Keyring({ type: "sr25519" }),

    accountInput: { name: "", key: "" },
    accounts: [],
  };

  componentDidMount() {
    const menuItems = this.initMenuItems();
    const menu = this.state.menu;
    menuItems.forEach((val) => {
      menu.append(new MenuItem(val.item));
    });
    this.setState({ menu, menuItems });
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    const accounts = this.state.accounts.map(({ address, meta }: KeyringPair$Json, index: number) => {
      return <AccountComponent key={index} name={meta.name} hash={address} />;
    });
    return (
      <TabComponent
        className="accounts"
        panel={val}
        menu={this.state.menu}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.menu.popup({})}
      >
        {accounts}
      </TabComponent>
    );
  }

  private initMenuItems(): MenuItem[] {
    const menuItems = [];
    menuItems.push(this.initModal('Add account', true, AddAccount));
    // menuItems.push(this.initModal('Import acccount', true, ImportAccount));
    return menuItems;
  }

  private initModal(label: string, enabled: boolean, component: any /* Replace with type*/): MenuItem {
    const click = () => {
      const menuItems = this.state.menuItems;
      const item = menuItems.find(val => val.item.label === label);
      if (!item) {
        return console.error("Invalid item");
      }
      const modal = item.modal;
      modal.visible ? modal.hide() : modal.show();
    };
    const modal = document.createElement("div");
    // modal.onclick = click;
    ReactDOM.render(React.createElement(component, { click }), modal);
    return {
      item: { label, click, enabled },
      modal: atom.workspace.addModalPanel({
        item: modal,
        visible: false,
      }),
    };
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
});

export default connect(
  mapStateToProps,
  { togglePanel }
)(AccountsBodyPanel);
