import * as React from "react";
import { CompositeDisposable } from "atom";
import { connect } from "react-redux";

import { AccountsBodyPanel } from "./body/accounts";
import { ExtrinsicsBodyPanel } from "./body/extrinsics";
import { NodesBodyPanel } from "./body/nodes";

import { AppState } from "../store";
import { TabsState, PanelType } from "../store/modules/tabs/types";
import { setPanels, togglePanel } from "../store/modules/tabs/actions";

export type Props = {
  tabs: TabsState,
  setPanels: typeof setPanels,
  togglePanel: typeof togglePanel,
};

type State = {};

class AccordionPanel extends React.Component<Props, State> {
  private subscriptions = new CompositeDisposable();

  componentDidMount() {
    this.props.setPanels([{
      id: 0,
      title: "My node connections",
      closed: false,
      component: (props: any) => <NodesBodyPanel {...props} />,
    }, {
      id: 1,
      title: "My accounts",
      closed: false,
      component: (props: any) => <AccountsBodyPanel {...props} />,
    }, {
      id: 2,
      title: "Available extrinsics",
      closed: false,
      component: (props: any) => <ExtrinsicsBodyPanel {...props} />,
    }]);
  }

  public render(): JSX.Element {
    const buttons = this.props.tabs.panels.map((val) => this.getTab(val.id, val));
    return (
      <div className="accordion">
        {buttons}
      </div>
    );
  }

  private getTab(index: number, val: PanelType) {
    const onButtonClick = (_event: React.MouseEvent) => {
      this.props.togglePanel(index);
    };
    const isClosed = val.closed ? "closed" : "";
    const className = `tab ${isClosed}`;
    return (
      <div key={index} className={className}>
        <div className="tab-label" onClick={onButtonClick}>
          <span>{val.title}</span>
          <div className="actions" onClick={console.log}>• • •</div>
        </div>
        <div className="tab-content">{val.component({})}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
});

export default connect(
  mapStateToProps,
  { setPanels, togglePanel }
)(AccordionPanel);
