import * as React from "react";
import * as ReactDOM from "react-dom";
import { CompositeDisposable } from "atom";
import * as Path from "path";

import { SidebarPanel, Props } from "./elements/sidebar";

type State = {};

module.exports = new class SubstratePlugin {
  public readonly getTitle = () => "Substrate";
  public readonly getIconName = () => "substrate-logo";
  public readonly getAllowedLocations = () => ["right", "left"];
  public readonly getURI = () => "atom://substrate-plugin";

  private subscriptions = new CompositeDisposable();
  public element: HTMLElement;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("substrate-plugin");
    this.render({
      editor: undefined,
    });
  }

  public activate(_state: State) {
    if (atom.inDevMode()) {
      try {
        this.activatePlugin();
      } catch (err) {
        console.log(err);
      }
    } else {
      this.activatePlugin();
    }
  }

  public deactivate() {
    this.subscriptions.dispose();
  }

  public serialize(): State {
    return {};
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

  private async activatePlugin() {
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "substrate-plugin:toggle": this.toggle,
        "substrate-plugin:toggle-sidebar": this.toggleSidebar,
      })
    );
  }

  private async toggle() {}

  private async toggleSidebar() {
    await atom.workspace.toggle(this);
    this.render({});
  }

  private render(props: Props) {
    ReactDOM.render(React.createElement(SidebarPanel, props), this.element);
  }
}
