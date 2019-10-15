import * as React from "react";
import { CompositeDisposable } from "atom";
import { connect } from "react-redux";

import AccountsBodyPanel from "./body/accounts";
import ExtrinsicsBodyPanel from "./body/extrinsics";
import NodesBodyPanel from "./body/nodes";
import { AppState } from "../store";
import { TabsState } from "../store/modules/tabs/types";
import { setPanels } from "../store/modules/tabs/actions";

export type Props = {
  tabs: TabsState,
  setPanels: typeof setPanels,
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
    const panels = this.props.tabs.panels;
    const tabs = panels.map((val) => {
      return val.component({ key: val.id, id: val.id });
    });
    return (
      <div className="accordion">
        {tabs}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  tabs: state.tabs,
});

export default connect(
  mapStateToProps,
  { setPanels }
)(AccordionPanel);
