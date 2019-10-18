import * as React from "react";

export interface Props {
  className: string;
  title: string;
  onClick: (event: React.MouseEvent) => void;
};

interface State {};

export class DefaultButtonComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <button
        className={`sb-default ${this.props.className}`}
        onClick={this.props.onClick}
      >
        {this.props.title}
      </button>
    );
  }
}
