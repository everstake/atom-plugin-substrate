import * as React from "react";
import { connect } from "react-redux";

import AccountsBodyPanel from "./body/accounts";
import ExtrinsicsBodyPanel from "./body/extrinsics";
import NodesBodyPanel from "./body/nodes";
import { AppState } from "../store";
import { TabsState } from "../store/modules/tabs/types";

export type Props = {
  tabs: TabsState,
};

type State = {};

class AccordionPanel extends React.Component<Props, State> {
  public render(): JSX.Element {
    const panels = this.props.tabs.panels;
    const tabs = panels.map((val) => {
      const props = { key: val.id, id: val.id };
      switch (val.id) {
        case 0:
          return <NodesBodyPanel {...props} />
        case 1:
          return <AccountsBodyPanel {...props} />
        default:
          return <ExtrinsicsBodyPanel {...props} />
      }
    });
    return (
      <div className="accordion">
        {tabs}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  substrate: state.substrate,
  tabs: state.tabs,
});

export default connect(
  mapStateToProps,
  {},
)(AccordionPanel);
