import * as React from "react";
import { Menu as MenuType, remote } from "electron";
import { connect } from "react-redux";

import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
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
    return (
      <TabComponent
        className="accoextrinsicsunts"
        panel={val}
        menu={this.state.menu}
        onTabClick={onTabClick}
        onActionsClick={onActionsClick}
      >
      </TabComponent>
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
