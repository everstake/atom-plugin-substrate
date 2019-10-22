import * as React from "react";
import * as Path from "path";
// import * as clipboard from 'clipboardy';

export type Props = {
  name: string,
  hash: string,
};

type State = {};

export class AccountComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    const pkgPath = atom.packages.getPackageDirPaths()[0];
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "account.svg");
    return (
      <li className="account">
        <img className="icon" src={path} />
        <span className="name">{this.props.name}</span>
        <span className="hash">{this.props.hash}</span>
      </li>
    );
  }
}
