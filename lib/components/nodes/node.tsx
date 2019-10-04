import * as React from "react";
import * as Path from "path";
import { CompositeDisposable } from "atom";

export type Props = {
  name: string,
  url: string,
};

type State = {};

export class NodeComponent extends React.Component<Props, State> {
  public state: State = {};
  private subscriptions = new CompositeDisposable();

  public render(): JSX.Element {
    const pkgPath = atom.packages.getPackageDirPaths()[0];
    const path = Path.join(pkgPath, "substrate-plugin", "assets", "dark", "node.svg");
    // atom.tooltips.add(div, { title: "Todo: Add context menu" });
    return (
      <li className="node">
        <img className="icon" src={path} />
        <span className="name">{this.props.name}</span>
        <span className="url">{this.props.url}</span>
      </li>
    );
  }
}
