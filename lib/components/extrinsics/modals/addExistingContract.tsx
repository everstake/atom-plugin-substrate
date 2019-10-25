import * as React from "react";
import * as fs from "fs";
import { Abi } from '@polkadot/api-contract';
import { remote } from "electron";

import { FileInputComponent } from "../../inputs/file";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { IContract } from "../../../store/modules/substrate/types";

export interface Props {
  closeModal: () => void;
  confirmClick: (contract: IContract) => void;
};

interface State {
  name: string;
  hash: string;
  abi: {
    path: string;
    abiJson?: string;
  };
};

const DefaultState: State = {
  name: "",
  hash: "",
  abi: {
    path: "",
  },
};

export class AddExistingContract extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <TextInputComponent
          className="name"
          type="text"
          title="Contract name"
          placeholder="ex. Flipper contract"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <TextInputComponent
          className="hash"
          type="text"
          title="Contract hash"
          placeholder="ex. 0xa54a4b44bb0a02b53a59bd47b478dcf1cc451eaee651bebc1bef5fa423b7014b"
          value={this.state.hash}
          onChange={(val: string) => this.setState({ hash: val })}
        />
        <FileInputComponent
          className="path"
          title="Contract ABI file"
          placeholder=""
          value={this.state.abi.path}
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
            title="Add existing code"
            onClick={() => this.handleConfirm()}
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
    const codePath = files[0];
    try {
      const abiBytes: Uint8Array = fs.readFileSync(codePath);
      const abiJson = JSON.parse(abiBytes.toString());
      new Abi(abiJson);
      const abi = {
        path: files[0],
        abiJson: JSON.stringify(abiJson),
      };
      this.setState({ abi });
    } catch (err) {
      atom.notifications.addError(`Failed to deserialize ABI: ${err.message}`);
    }
  }

  private handleConfirm() {
    const { name, hash, abi } = this.state;
    if (!name.trim().length) {
      atom.notifications.addError("Invalid name");
      return;
    }
    if (!hash.trim().length) {
      atom.notifications.addError("Invalid hash");
      return;
    }
    if (!abi.abiJson) {
      atom.notifications.addError("Invalid abi");
      return;
    }
    this.props.confirmClick({ name, address: hash, abi: abi.abiJson });
    this.props.closeModal();
  }
}
