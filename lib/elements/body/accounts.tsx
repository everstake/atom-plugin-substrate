import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu as MenuType, remote } from "electron";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";

import { NavbarComponent, AccountComponent } from "../../components";

const { Menu, MenuItem } = remote;

type Account = { name: string, key: string };

export type Props = {};

type State = {
  menu: MenuType,
  keyring: Keyring,

  // Todo: Move to redux storage
  accountInput: Account,
  accounts: KeyringPair$Json[],
};

export class AccountsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
    keyring: new Keyring({ type: "sr25519" }),

    accountInput: { name: "", key: "" },
    accounts: [],
  };
  private subscriptions = new CompositeDisposable();

  componentDidMount() {
    this.initMenu();
  }

  public render(): JSX.Element {
    const accounts = this.state.accounts.map(({ address, meta }: KeyringPair$Json, index: number) => {
      return <AccountComponent key={index} name={meta.name} hash={address} />;
    })
    return (
      <div className="accounts">
        <NavbarComponent title="My accounts" menu={this.state.menu} />
        <ul className="ul-accounts">{accounts}</ul>
        <NavbarComponent title="Create account" menu={this.state.menu} />
        <div className="command">
          <div className="input">
            <span>Name</span>
            <input
              type="text"
              placeholder="Account name"
              value={this.state.accountInput.name}
              onChange={this.handleNameChange.bind(this)}
            />
          </div>
          <div className="input">
            <span>Key</span>
            <input
              type="text"
              placeholder="Account key"
              value={this.state.accountInput.key}
              onChange={this.handleKeyChange.bind(this)}
            />
          </div>
          <button onClick={this.addAccount.bind(this)}>Add account</button>
        </div>
      </div>
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

  private handleNameChange(event: any) {
    this.setState({
      accountInput: {
        ...this.state.accountInput,
        name: event.target.value,
      },
    });
  }

  private handleKeyChange(event: any) {
    this.setState({
      accountInput: {
        ...this.state.accountInput,
        key: event.target.value,
      },
    });
  }

  private addAccount() {
    const { name, key } = this.state.accountInput;
    const pair = this.state.keyring.addFromUri(key, { name }, "sr25519");
    const pairJson = pair.toJson();
    this.setState({
      accounts: [...this.state.accounts, pairJson],
      accountInput: { name: "", key: "" },
    });
  }
}
