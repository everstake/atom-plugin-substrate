import * as React from "react";
import * as Path from "path";
import { CompositeDisposable } from "atom";

export type Props = {
  name: string,
  hash: string,
};

type State = {};

export class AccountComponent extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const pkgPath = atom.packages.getPackageDirPaths()[0];
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "account.svg");
    // atom.tooltips.add(div, { title: "Todo: Add context menu" });
    return (
      <li className="account">
        <img className="icon" src={path} />
        <span className="name">{this.props.name}</span>
        <span className="hash">{this.props.hash}</span>
      </li>
    );
  }
}
