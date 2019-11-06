import * as React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";

import AccordionPanel from "./accordion";

export type Props = {
  store: Store<any, any>,
  logger?: any,
};

type State = {};

export class SidebarPanel extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className="substrate-plugin-sidebar">
        <Provider store={this.props.store}>
          <AccordionPanel logger={this.props.logger} />
        </Provider>
      </div>
    );
  }
}
