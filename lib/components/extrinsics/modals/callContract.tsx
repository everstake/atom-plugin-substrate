import * as React from "react";
import * as fs from "fs";
import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { remote } from "electron";
import { Abi } from '@polkadot/api-contract';

import { FileInputComponent } from "../../inputs/file";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { IAccount, ICode, IContract } from "../../../store/modules/substrate/types";
import { SelectInputComponent, Item } from "../../inputs/select";

export interface Props {
  api: ApiPromise;
  accounts: IAccount[];
  contract: IContract;
  closeModal: () => void;
  confirmClick: () => void;
};

interface State {
  account: number;
  pass: string;
  code: number,
  abi: {
    path: string;
    abiJson?: string;
  };
  contract_name: string;
  endowment: string;
  max_gas: string;
};

const DefaultState: State = {
  account: -1,
  pass: "",
  code: -1,
  abi: {
    path: "",
  },
  contract_name: "",
  endowment: "",
  max_gas: "",
};

export class CallContract extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <TextInputComponent
          className="name"
          type="text"
          title="Contract name"
          placeholder="Flipper contract"
          value={this.state.contract_name}
          onChange={(val: string) => this.setState({ contract_name: val })}
        />
        <FileInputComponent
          className="path"
          title="Contract ABI"
          placeholder=".json file"
          value={this.state.abi.path}
          onClick={() => this.handleFileClick()}
        />
        {this.renderArguments()}
        <TextInputComponent
          className="endowment"
          type="number"
          title="Allotted endowment"
          placeholder="1000000000000000"
          value={this.state.endowment}
          onChange={(val: string) => this.setState({ endowment: val })}
        />
        <TextInputComponent
          className="gas"
          type="number"
          title="Maximum gas"
          placeholder="500000"
          value={this.state.max_gas}
          onChange={(val: string) => this.setState({ max_gas: val })}
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

  private renderArguments(): JSX.Element {
    // const tx = this.getExtrinsic();
    // if (!tx) {
      return <div></div>;
    // }
    // const ext = tx.value.toJSON();
    // const args = ext.args.map((val: { name: string, type: string }, idx: number) => (
    //   <TextInputComponent
    //     key={idx}
    //     className="argument"
    //     type="text"
    //     title={`${val.name}: ${val.type}`}
    //     placeholder=""
    //     value={this.state.args[idx] || ""}
    //     onChange={(val: string) => {
    //       const args = this.state.args;
    //       args[idx] = val;
    //       this.setState({ args });
    //     }}
    //   />
    // ));
    // return (<div className="arguments">{args}</div>);
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
    const { account, code, abi, max_gas, contract_name, endowment } = this.state;
    if (account === -1) {
      atom.notifications.addError("Invalid account");
      return;
    }
    if (code === -1) {
      atom.notifications.addError("Invalid contract code");
      return;
    }
    if (!abi.abiJson) {
      atom.notifications.addError("Invalid ABI");
      return;
    }
    if (!contract_name.trim().length) {
      atom.notifications.addError("Invalid contract name");
      return;
    }
    if (!max_gas.trim().length) {
      atom.notifications.addError("Invalid maximum gas");
      return;
    }
    if (!endowment.trim().length) {
      atom.notifications.addError("Invalid endowment");
      return;
    }
    this.exec((address: string) => {
      this.props.confirmClick({ name: contract_name, address, abi: abi.abiJson! });
    }).catch(err => {
      atom.notifications.addError(`Upload wasm failed with error: ${err.message}`);
    });
    this.props.closeModal();
  }

  private async exec(callback: (address: string) => void) {
    const { account, pass, code, abi, max_gas, endowment, args } = this.state;
    const acc = this.props.accounts[account];
    const keyring = new Keyring({ type: "sr25519" });
    const pair = keyring.addFromJson(acc);
    pair.decodePkcs8(pass);

    try {
      const contractAbi = new Abi(JSON.parse(abi.abiJson!));
      const con = this.props.api;
      const nonce = await con.query.system.accountNonce(pair.address);
      const contractApi = con.tx["contracts"] ? con.tx["contracts"] : con.tx["contract"];
      const unsignedTx = contractApi.instantiate(
          endowment,
          max_gas,
          this.props.codes[code].address,
          contractAbi.constructors[0](...args),
      );

      const signedTx = unsignedTx.sign(pair, { nonce: nonce as any });
      await signedTx.send(({ events = [], status }: any) => {
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
            if (res.indexOf('contracts.Instantiated') !== -1) {
              resultHash = res.substring(
                res.lastIndexOf(',"') + 2,
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
