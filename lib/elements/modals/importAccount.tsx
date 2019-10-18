import * as React from "react";
import { ModalComponent } from "../../components/modal";
import { TextInputComponent } from "../../components/inputs/text";
import { DefaultButtonComponent } from "../../components/buttons/default";

export interface Props {
  cancelClick: (e: React.MouseEvent) => void;
  confirmClick: (e: React.MouseEvent) => void;
};

interface State {
  path: string;
};

export class ImportAccount extends React.Component<Props, State> {
  public state: State = {
    path: "",
  };

  public render(): JSX.Element {
    return (
      <ModalComponent className="import-account">
        <TextInputComponent
          className="path"
          title="Account file path"
          placeholder=""
          value={this.state.path}
          onChange={(e: any) => this.setState({ path: e.target.value })}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.cancelClick}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Import account"
            onClick={this.props.confirmClick}
          />
        </div>
      </ModalComponent>
    );
  }
}
