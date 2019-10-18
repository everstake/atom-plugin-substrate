import * as React from "react";
import { Store } from "redux";
import { Provider } from "react-redux";

import configureStore from "../store";
import AccordionPanel from "./accordion";

export type Props = {};

type State = {
  store: Store<any, any>,
};

export class SidebarPanel extends React.Component<Props, State> {
  public state: State = {
    store: configureStore(),
  };

  public render(): JSX.Element {
    return (
      <div className="substrate-plugin-sidebar">
        <Provider store={this.state.store}>
          <AccordionPanel />
        </Provider>
      </div>
    );
  }
}
