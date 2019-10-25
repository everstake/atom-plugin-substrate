import * as React from "react";

export interface Props {
  className: string;
  title: string;
  placeholder: string;
  value: string;
  onClick: () => void;
};

interface State {};

export class FileInputComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className={`si-file ${this.props.className}`}>
        <span>{this.props.title}</span>
        <input
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={() => {}}
          onClick={() => this.props.onClick()}
        />
      </div>
    );
  }
}
