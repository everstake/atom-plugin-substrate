import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu as MenuType, remote } from "electron";
import { Keyring } from "@polkadot/keyring";
import { KeyringPair$Json } from "@polkadot/keyring/types";

import { AccountComponent } from "../../components/accounts";

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
      <ul className="accounts">{accounts}</ul>
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
