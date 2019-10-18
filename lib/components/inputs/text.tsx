import * as React from "react";

export interface Props {
  className: string;
  type: string,
  title: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
};

interface State {};

export class TextInputComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className={`si-text ${this.props.className}`}>
        <span>{this.props.title}</span>
        <input
          className="native-key-bindings"
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={(e: any) => this.props.onChange(e.target.value)}
        />
      </div>
    );
  }
}
