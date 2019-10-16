import * as React from "react";
import { Menu } from "electron";

import { PanelType } from "../store/modules/tabs/types";

export type Props = {
  className: string,
  panel: PanelType,
  menu: Menu,
  onTabClick: (event: React.MouseEvent) => void,
  onActionsClick: (event: React.MouseEvent) => void,
};

type State = {};

export class TabComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    const val = this.props.panel;
    const isClosed = val.closed ? "closed" : "";
    const className = `tab ${isClosed}`;
    return (
      <div className={className}>
        <div className="tab-label">
          <span onClick={this.props.onTabClick}>{val.title}</span>
          <div className="actions" onClick={this.props.onActionsClick}>• • •</div>
        </div>
        <div className="tab-content">
          <ul className={this.props.className}>
            {this.props.children}
          </ul>
        </div>
      </div>
    );
  }
}
