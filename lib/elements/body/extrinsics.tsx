import * as React from "react";
import { CompositeDisposable } from "atom";
import { Menu as MenuType, remote } from "electron";
import { connect } from "react-redux";

import { AppState } from "../../store";
import { TabsState, PanelType } from "../../store/modules/tabs/types";
import { togglePanel } from "../../store/modules/tabs/actions";

const { Menu, MenuItem } = remote;

export type Props = {
  id: number,
  tabs: TabsState,
  togglePanel: typeof togglePanel,
};

type State = {
  menu: MenuType,
};

class ExtrinsicsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    menu: new Menu(),
  };
  private subscriptions = new CompositeDisposable();

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
    const onButtonClick = (_event: React.MouseEvent) => {
      this.props.togglePanel(val.id);
    };
    const isClosed = val.closed ? "closed" : "";
    const className = `tab ${isClosed}`;
    return (
      <div className={className}>
        <div className="tab-label" onClick={onButtonClick}>
          <span>{val.title}</span>
          <div className="actions" onClick={console.log}>• • •</div>
        </div>
        <div className="tab-content">
          <ul className="extrinsics"></ul>
        </div>
      </div>
    );
  }

  private initMenu() {
    const menu = this.state.menu;
    menu.append(new MenuItem({
      label: 'Test',
      click: () => console.log(1),
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
)(ExtrinsicsBodyPanel);
