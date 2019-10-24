import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel } from "atom";
import { MenuItemConstructorOptions } from "electron";

export interface MenuItemType {
  item: MenuItemConstructorOptions;
  modal?: Panel;
  reactElement: React.ReactElement;
};

export type Props = {
  className: string,
};

type State = {};

export class ModalComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className={`substrate-modal ${this.props.className}`}>
        {this.props.children}
      </div>
    );
  }
}

export function initModal(
  label: string,
  enabled: boolean,
  component: any,
  confirmClick: any,
  click: any,
  props: any = {},
): MenuItemType {
  const modal = document.createElement("div");
  const reactElement = React.createElement(component, {
    closeModal: click,
    confirmClick,
    ...props,
  });
  ReactDOM.render(reactElement, modal);
  return {
    item: { label, click, enabled },
    modal: atom.workspace.addModalPanel({
      item: modal,
      visible: false,
    }),
    reactElement,
  };
}

export function initAccountContextItemModal(
  component: any,
  props: any,
  confirmClick: any,
  click: () => void,
): Panel {
  const modal = document.createElement("div");
  ReactDOM.render(React.createElement(component, {
    closeModal: click,
    confirmClick,
    ...props,
  }), modal);
  return atom.workspace.addModalPanel({
    item: modal,
    visible: false,
  });
}
