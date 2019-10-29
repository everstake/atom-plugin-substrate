import * as React from "react";
import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { Abi } from '@polkadot/api-contract';

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { IAccount, IContract } from "../../../store/modules/substrate/types";
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
  method: number;
  endowment: string;
  max_gas: string;
  args: string[];
};

const DefaultState: State = {
  account: -1,
  pass: "",
  method: -1,
  endowment: "0",
  max_gas: "500000",
  args: [],
};

export class CallContract extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    const { abi } = new Abi(JSON.parse(this.props.contract.abi));
    const contractMessages = abi.contract.messages;
    const methods: Item[] = contractMessages.map(val => {
      const args = val.args.map((arg: any) => `${arg.name}: ${arg.type.displayName}`);
      const returns = val.returnType ? `: ${val.returnType.displayName}` : "";
      return {
        label: `🧭 ${val.name}(${args.join(', ')})${returns}`,
        description: val.mutates ? 'Will mutate storage' : 'Won\'t mutate storage',
        value: val,
      };
    });
    const accountItems: Item[] = this.props.accounts.map(val => ({
      label: val.meta.name,
      value: val,
    }));

    return (
      <ModalComponent className="run-extrinsics">
        <SelectInputComponent
          className="method"
          title="Select contract method"
          items={methods}
          selectedItem={this.state.method}
          onChange={(_: Item, idx: number) => {
            this.setState({ method: idx });
          }}
        />
        {this.renderArguments()}
        <TextInputComponent
          className="endowment"
          type="number"
          title="Allotted endowment"
          placeholder="0"
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
            title="Call contract"
            onClick={() => this.handleConfirm()}
          />
        </div>
      </ModalComponent>
    );
  }

  private renderArguments(): JSX.Element {

    const { method } = this.state;
    const { abi } = new Abi(JSON.parse(this.props.contract.abi));
    const md = abi.contract.messages[method];
    if (!md) {
      return <div></div>;
    }
    const args = md.args.map((val: any, idx: number) => (
      <TextInputComponent
        key={idx}
        className="argument"
        type="text"
        title={`${val.name}: ${val.type.displayName}`}
        placeholder=""
        value={this.state.args[idx] || ""}
        onChange={(val: string) => {
          const args = this.state.args;
          args[idx] = val;
          this.setState({ args });
        }}
      />
    ));
    if (!args.length) {
      return <div></div>;
    }
    return (<div className="arguments">{args}</div>);
  }

  private handleConfirm() {
    const { account, method, endowment, max_gas } = this.state;
    if (account === -1) {
      atom.notifications.addError("Invalid account");
      return;
    }
    if (method === -1) {
      atom.notifications.addError("Invalid contract method");
      return;
    }
    if (!endowment.trim().length) {
      atom.notifications.addError("Invalid endowment");
      return;
    }
    if (!max_gas.trim().length) {
      atom.notifications.addError("Invalid maximum gas");
      return;
    }
    this.exec().catch(err => {
      atom.notifications.addError(`Upload wasm failed with error: ${err.message}`);
    }).finally(() => {
      this.setState(DefaultState);
    });
    this.props.closeModal();
  }

  private async exec() {
    const { account, method, pass, max_gas, endowment, args } = this.state;

    let pair;
    try {
      const acc = this.props.accounts[account];
      const keyring = new Keyring({ type: "sr25519" });
      pair = keyring.addFromJson(acc);
      pair.decodePkcs8(pass);
    } catch (err) {
      atom.notifications.addError(`Failed to decrypt account: ${err.message}`);
      return;
    }

    try {
      const contractAbi = new Abi(JSON.parse(this.props.contract.abi));
      const con = this.props.api;
      const nonce = await con.query.system.accountNonce(pair.address);
      const contractApi = con.tx["contracts"] ? con.tx["contracts"] : con.tx["contract"];

      const methodName = contractAbi.abi.contract.messages[method].name;
      const md = contractAbi.messages[methodName];

      const unsignedTx = contractApi.call(
        this.props.contract.address,
        endowment,
        max_gas,
        md(...args),
      );

      const signedTx = unsignedTx.sign(pair, { nonce: nonce as any });
      await signedTx.send(({ events = [], status }: any) => {
        if (status.isFinalized) {
          const finalized = status.asFinalized.toHex();
          console.log(`Completed at block hash: ${finalized}`);

          console.log('Events:');
          let error: string = '';
          events.forEach(({ phase, event: { data, method, section } }: any) => {
            const res = `\t ${phase.toString()} : ${section}.${method} ${data.toString()}`;
            if (res.indexOf('Failed') !== -1) {
              error += res;
            }
            console.log(res);
          });
          if (error !== '') {
            // Todo: Get error
            atom.notifications.addError(`Failed on block "${finalized}" with error: ${error}`);
            return;
          }
          atom.notifications.addSuccess(`Completed on block ${finalized}`);
        }
      });
    } catch (err) {
      atom.notifications.addError(`Error on put code: ${err.message}`);
    }
  }
}
