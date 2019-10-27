import * as React from "react";
import * as fs from "fs";
import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { remote } from "electron";
import { compactAddLength } from '@polkadot/util';

import { FileInputComponent } from "../../inputs/file";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { IAccount, ICode } from "../../../store/modules/substrate/types";
import { SelectInputComponent, Item } from "../../inputs/select";

export interface Props {
  api: ApiPromise;
  accounts: IAccount[];
  codes: ICode[];
  closeModal: () => void;
  confirmClick: (code: ICode) => void;
};

interface State {
  account: number;
  pass: string;
  compiled_contract: {
    path: string;
    bytes?: Uint8Array;
  };
  code_bundle_name: string;
  max_gas: number;
};

const DefaultState: State = {
  account: -1,
  pass: "",
  compiled_contract: {
    path: "",
  },
  code_bundle_name: "",
  max_gas: 0,
};

export class UploadWasm extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    const accountItems: Item[] = this.props.accounts.map(val => ({
      label: val.meta.name,
      value: val,
    }));

    return (
      <ModalComponent className="run-extrinsics">
        <FileInputComponent
          className="path"
          title="Contract code"
          placeholder=".wasm file"
          value={this.state.compiled_contract.path}
          onClick={() => this.handleFileClick()}
        />
        <TextInputComponent
          className="name"
          type="text"
          title="Code bundle name"
          placeholder="Flipper contract code"
          value={this.state.code_bundle_name}
          onChange={(val: string) => this.setState({ code_bundle_name: val })}
        />
        <TextInputComponent
          className="gas"
          type="number"
          title="Maximum gas"
          placeholder="100000"
          value={this.state.max_gas.toString()}
          onChange={(val: string) => this.setState({ max_gas: parseInt(val, 10) })}
        />
        <SelectInputComponent
          className="account"
          title="Select account"
          items={accountItems}
          selectedItem={this.state.account}
          onChange={(_: Item, idx: number) => this.setState({ account: idx })}
        />
        <TextInputComponent
          className="pass"
          type="password"
          title="Account password"
          placeholder=""
          value={this.state.pass}
          onChange={(val: string) => this.setState({ pass: val })}
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
      const wasm: Uint8Array = fs.readFileSync(codePath);
      const isWasmValid = wasm.subarray(0, 4).join(',') === '0,97,115,109'; // '\0asm'
      if (!isWasmValid) {
          throw Error('Invalid code');
      }
      const compiled_contract = {
        path: codePath,
        bytes: compactAddLength(wasm),
      };
      this.setState({ compiled_contract });
    } catch (err) {
      atom.notifications.addError(`Failed to deserialize ABI: ${err.message}`);
    }
  }

  private handleConfirm() {
    const { account, compiled_contract, code_bundle_name, max_gas } = this.state;
    if (account === -1) {
      atom.notifications.addError("Invalid account");
      return;
    }
    if (!compiled_contract.bytes) {
      atom.notifications.addError("Invalid compiled contract");
      return;
    }
    if (!code_bundle_name.trim().length) {
      atom.notifications.addError("Invalid code bundle name");
      return;
    }
    if (max_gas <= 0) {
      atom.notifications.addError("Maximum gas should not be below zero");
      return;
    }
    this.exec((address: string) => {
      this.props.confirmClick({ name: code_bundle_name, address });
    }).catch(err => {
      atom.notifications.addError(`Upload wasm failed with error: ${err.message}`);
    });
    this.props.closeModal();
  }

  private async exec(callback: (address: string) => void) {
    const { account, pass, compiled_contract, max_gas } = this.state;
    const acc = this.props.accounts[account];
    const keyring = new Keyring({ type: "sr25519" });
    const pair = keyring.addFromJson(acc);
    pair.decodePkcs8(pass);

    try {
      const con = this.props.api;
      const nonce = await con.query.system.accountNonce(pair.address);
      const contractApi = con.tx["contracts"] ? con.tx["contracts"] : con.tx["contract"];
      const unsignedTransaction = contractApi.putCode(max_gas, compiled_contract.bytes);

      const signedTransaction = unsignedTransaction.sign(pair, { nonce: nonce as any });
      await signedTransaction.send(({ events = [], status }: any) => {
        if (status.isFinalized) {
          const finalized = status.asFinalized.toHex();
          console.log(`Completed at block hash: ${finalized}`);

          console.log('Events:');
          let error: string = '';
          let resultHash: string = '';
          events.forEach(({ phase, event: { data, method, section } }: any) => {
            const res = `\t ${phase.toString()} : ${section}.${method} ${data.toString()}`;
            if (res.indexOf('Failed') !== -1) {
              error += res;
            }
            if (res.indexOf('contracts.CodeStored') !== -1) {
              resultHash = res.substring(
                res.lastIndexOf('["') + 2,
                res.lastIndexOf('"]'),
              );
            }
            console.log(res);
          });
          if (error !== '') {
            // Todo: Get error
            atom.notifications.addError(`Failed on block "${finalized}" with error: ${error}`);
            return;
          }
          if (resultHash === '') {
            atom.notifications.addInfo(`Completed on block "${finalized}" but failed to get event result`);
            return;
          }
          callback(resultHash);
          atom.notifications.addSuccess(`Completed on block ${finalized} with code hash ${resultHash}`);
        }
      });
    } catch (err) {
      atom.notifications.addError(`Error on put code: ${err.message}`);
    }
  }
}
