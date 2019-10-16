import * as React from "react";
import { Menu as MenuType, remote } from "electron";
import { connect } from "react-redux";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";

import { AccountComponent } from "../../components/accounts";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { togglePanel } from "../../store/modules/tabs/actions";

const { Menu, MenuItem } = remote;

type Account = { name: string, key: string };

export type Props = {
  id: number,
  tabs: TabsState,
  togglePanel: typeof togglePanel,
};

type State = {
  menu: MenuType,
  keyring: Keyring,

  // Todo: Move to redux storage
  accountInput: Account,
  accounts: KeyringPair$Json[],
};

class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
    keyring: new Keyring({ type: "sr25519" }),

    accountInput: { name: "", key: "" },
    accounts: [],
  };

  componentDidMount() {
    this.initMenu();
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    const onTabClick = (_: React.MouseEvent) => {
      this.props.togglePanel(val.id);
    };
    const onActionsClick = (_: React.MouseEvent) => {
      this.props.togglePanel(val.id);
    };
    const accounts = this.state.accounts.map(({ address, meta }: KeyringPair$Json, index: number) => {
      return <AccountComponent key={index} name={meta.name} hash={address} />;
    });
    return (
      <TabComponent
        className="accounts"
        panel={val}
        menu={this.state.menu}
        onTabClick={onTabClick}
        onActionsClick={onActionsClick}
      >
        {accounts}
      </TabComponent>
    );
  }

  private initMenu() {
    const menu = this.state.menu;
    menu.append(new MenuItem({
      label: 'Add account',
      click: () => console.log(1),
      enabled: true,
    }));
    menu.append(new MenuItem({
      label: 'Import acccount',
      click: () => console.log(2),
      enabled: true,
    }));
    this.setState({ menu });
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
});

export default connect(
  mapStateToProps,
  { togglePanel }
)(AccountsBodyPanel);
