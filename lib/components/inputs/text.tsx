import * as React from "react";

export type Props = {
  className: string,
  placeholder: string,
};

type State = {};

export class TextInputComponent extends React.Component<Props, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <input
        className={`si-text ${this.props.className}`}
        type="text"
        placeholder={this.props.placeholder}
      />
    );
  }
}
