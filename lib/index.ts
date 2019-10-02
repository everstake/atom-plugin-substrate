import * as React from "react";
import * as ReactDOM from "react-dom";
import { CompositeDisposable, Disposable } from "atom";

import { SidebarPanel, Props } from "./sidebar";

type State = {};

module.exports = new class SubstratePlugin {
  public element: HTMLElement;
  public readonly getTitle = () => "Substrate";
  public readonly getAllowedLocations = () => ["right", "left"];
  public readonly getURI = () => "atom://substrate-plugin";

  private subscriptions = new CompositeDisposable();
  private editorSubcription: Disposable | undefined;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("substrate-plugin");
    this.render({
      editor: undefined,
    });
  }

  public activate(_state: State) {
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "substrate-plugin:toggle": () => this.toggle(),
      })
    );
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
      const icon = document.createElement("span");
      // Todo: Add icon
      icon.textContent = "X Substrate";
      const link = document.createElement("a");
      link.appendChild(icon);
      link.onclick = (_e) => {
        this.toggle();
      };
      atom.tooltips.add(div, { title: "Toggle Substrate plugin sidebar" });
      div.appendChild(link);
      statusBar.addRightTile({ item: div, priority: 0 });
  }

  private toggle() {
    atom.workspace.toggle(this);

    this.editorSubcription && this.editorSubcription.dispose();
    this.editorSubcription = atom.workspace.observeActiveTextEditor(editor => {
      this.render({ editor });
    });
  }

  private render(props: Props) {
    ReactDOM.render(React.createElement(SidebarPanel, props), this.element);
  }
}
