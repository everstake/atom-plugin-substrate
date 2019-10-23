import * as React from "react";
import { remote } from "electron";

import { ModalComponent } from "../../modal";
import { FileInputComponent } from "../../inputs/file";
import { DefaultButtonComponent } from "../../buttons/default";

export interface Props {
  closeModal: () => void;
  confirmClick: (path: string) => void;
};

interface State {
  path: string;
};

const DefaultState: State = {
  path: "",
};

export class ImportAccount extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="import-account">
        <FileInputComponent
          className="path"
          title="Account file path"
          placeholder=""
          value={this.state.path}
          onClick={() => this.handleFileClick()}
        />
        <div className="buttons">
          <DefaultButtonComponent
            className="cancel"
            title="Cancel"
            onClick={this.props.closeModal}
          />
          <DefaultButtonComponent
            className="confirm"
            title="Import account"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  private async handleFileClick() {
    const files: any = await remote.dialog.showOpenDialog(
      remote.getCurrentWindow(), {
      properties: ['openFile'],
    });
    if (!files || !files.length) {
      return;
    }
    this.setState({ path: files[0] });
  }

  private handleConfirm(e: React.MouseEvent) {
    this.props.confirmClick(this.state.path);
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
