import * as React from "react";

export interface Props {
  className: string;
  title: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent) => void;
};

interface State {
};

export class TextInputComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <div className="si-text">
        <span>{this.props.title}</span>
        <input
          className={`native-key-bindings ${this.props.className}`}
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
