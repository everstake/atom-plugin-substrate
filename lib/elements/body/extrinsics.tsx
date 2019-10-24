import * as React from "react";
import { Menu as MenuType, MenuItemConstructorOptions, remote } from "electron";
import { connect } from "react-redux";

import { initMenuItem } from "../../components/modal";
import { RunExtrinsics } from "../../components/extrinsics/modals/runExtrinsics";
import { TabComponent } from "../../components/tab";
import { AppState } from "../../store";
import { TabsState } from "../../store/modules/tabs/types";
import { IAccount } from "../../store/modules/substrate/types";
import { togglePanel } from "../../store/modules/tabs/actions";
// import {  } from "../../store/modules/substrate/actions";

const { Menu, MenuItem } = remote;

export type Props = {
  id: number,
  tabs: TabsState,
  accounts: IAccount[],
  togglePanel: typeof togglePanel,
};

type State = {
  tabMenu: MenuType,
};

class ExtrinsicsBodyPanel extends React.Component<Props, State> {
  public state: State = {
    tabMenu: new Menu(),
  };

  componentDidMount() {
    const { tabMenu } = this.state;
    tabMenu.append(new MenuItem(this.runExtrinsics()));
    tabMenu.append(new MenuItem(this.subChainState()));
    this.setState({ tabMenu });
  }

  public render(): JSX.Element {
    const val = this.props.tabs.panels.find(
      (value) => value.id === this.props.id,
    );
    if (!val) {
      return <span>Invalid tabs</span>;
    }
    // const nds = this.props.substrate.nodes;
    // const nodes = nds.map((node: INode, index: number) => {
    //   return (
    //     <NodeComponent
    //       key={index}
    //       node={node}
    //       accountContextItems={this.state.contextItems}
    //       onClick={this.handleMenuClick.bind(this)}
    //     />
    //   );
    // });
    return (
      <TabComponent
        className="extrinsics"
        panel={val}
        onTabClick={() => this.props.togglePanel(val.id)}
        onActionsClick={() => this.state.tabMenu.popup({})}
      >
      </TabComponent>
    );
  }

  private runExtrinsics(): MenuItemConstructorOptions {
    const label = 'Run extrinsics';
    const confirm = () => {
      this.forceUpdate();
    };
    const accounts = this.props.accounts;
    return initMenuItem(label, true, RunExtrinsics, confirm, { accounts });
  }

  private subChainState(): MenuItemConstructorOptions {
    const label = 'Subscribe for chain state';
    const confirm = () => {
      this.forceUpdate();
    };
    const accounts = this.props.accounts;
    return initMenuItem(label, true, RunExtrinsics, confirm, { accounts });
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
  accounts: state.substrate.accounts,
});

export default connect(
  mapStateToProps,
  { togglePanel }
)(ExtrinsicsBodyPanel);
