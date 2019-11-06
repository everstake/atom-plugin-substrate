import * as React from "react";
import * as ReactDOM from "react-dom";
import { CompositeDisposable } from "atom";
import * as Path from "path";
import * as apd from "atom-package-dependencies";

import { SidebarPanel, Props } from "./elements/sidebar";
import configureStore from "./store";
import { setPanels } from "./store/modules/tabs/actions";
import { initialState as tabsIS } from "./store/modules/tabs/reducers";
import { initialState as substrateIS } from "./store/modules/substrate/reducers";
import { addNode } from "./store/modules/substrate/actions";

interface State {
  reduxState: string;
};

module.exports = new class SubstratePlugin {
  public readonly getTitle = () => "Substrate";
  public readonly getIconName = () => "substrate-logo";
  public readonly getAllowedLocations = () => ["right", "left"];
  public readonly getURI = () => "atom://substrate-plugin";

  private subscriptions = new CompositeDisposable();
  private props: Props;
  public element: HTMLElement;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("substrate-plugin");
    this.props = {
      store: configureStore(),
    };
    this.render();
  }

  public activate(state?: State) {
    this.installDeps();
    if (atom.inDevMode()) {
      try {
        this.activatePlugin(state);
      } catch (err) {
        console.log("System error", err);
      }
    } else {
      this.activatePlugin(state);
    }
  }

  public deactivate() {
    this.subscriptions.dispose();
  }

  public serialize(): State {
    const store = this.props.store;
    if (!store) {
      return { reduxState: "" };
    }
    const reduxState = store.getState();
    return { reduxState: JSON.stringify(reduxState) };
  }

  public consumeConsolePanel(consolePanel: any) {
    this.props.logger = consolePanel;
  }

  public consumeStatusBar(statusBar: any) {
      const div = document.createElement("div");
      div.classList.add("inline-block");
      div.classList.add("substrate-plugin-status-bar");

      const pkgPath = atom.packages.getPackageDirPaths()[0];
      const icon = document.createElement("img");
      icon.src = Path.join(pkgPath, "substrate-plugin", "assets", "icon.svg");

      const link = document.createElement("a");
      link.appendChild(icon);

      div.appendChild(link);
      div.onclick = (_e) => {
        this.toggleSidebar();
      };
      atom.tooltips.add(div, { title: "Toggle Substrate plugin sidebar" });
      statusBar.addRightTile({ item: div, priority: 0 });
  }

  private async activatePlugin(state?: State) {
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "substrate-plugin:toggle": this.toggle,
        "substrate-plugin:toggle-sidebar": this.toggleSidebar,
      })
    );
    if (state) {
      this.setState(state);
    }
    const reduxState = this.props.store.getState();
    if (!reduxState.tabs.panels.length) {
      const setPanelsAction = setPanels([{
        id: 0,
        title: "My node connections",
        closed: false,
      }, {
        id: 1,
        title: "My accounts",
        closed: false,
      }, {
        id: 2,
        title: "Extrinsics | Chain state | Contracts",
        closed: false,
      }]);
      this.props.store.dispatch(setPanelsAction);
    }
    if (!reduxState.substrate.nodes.length) {
      const addNodeAction = addNode("Default", "ws://127.0.0.1:9944");
      this.props.store.dispatch(addNodeAction);
    }
  }

  private setState(state: State): any {
    const rdst = state.reduxState;
    if (rdst && rdst.trim().length) {
      const reduxState = JSON.parse(state.reduxState);
      this.props.store = configureStore(reduxState);
      return;
    }
    this.props.store = configureStore({
      tabs: tabsIS,
      substrate: substrateIS,
    });
  }

  private async installDeps() {
    apd.install(() => {
      console.log('All dependencies installed, starting substrate-plugin.');
    });
  }

  private async toggle() {}

  private async toggleSidebar() {
    await atom.workspace.toggle(this);
    this.render();
  }

  private render() {
    ReactDOM.render(React.createElement(SidebarPanel, this.props), this.element);
  }
}
