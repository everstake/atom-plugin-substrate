import * as React from "react";
import * as ReactDOM from "react-dom";
import { Panel } from "atom";
import { MenuItemConstructorOptions } from "electron";

export interface Props {
  className: string;
};

interface State {};

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

export function initMenuItem(
  label: string,
  enabled: boolean,
  component: any,
  confirmClick: any,
  props: any = {},
  preClick = (): boolean => false,
  additionalProps = (): any | undefined => {},
): MenuItemConstructorOptions {
  const click = () => {
    if (preClick()) {
      return;
    }
    const modal = document.createElement("div");
    const mod = atom.workspace.addModalPanel({ item: modal, visible: true });
    const reactElement = React.createElement(component, {
      closeModal: () => mod.destroy(),
      confirmClick,
      ...props,
      ...additionalProps(),
    });
    ReactDOM.render(reactElement, modal);
  };
  return { label, click, enabled };
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
