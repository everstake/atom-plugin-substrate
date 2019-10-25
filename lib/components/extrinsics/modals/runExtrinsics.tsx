import * as React from "react";
import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";

import { IAccount } from "../../../store/modules/substrate/types";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { SelectInputComponent, Item } from "../../inputs/select";

export interface Props {
  api: ApiPromise;
  accounts: IAccount[];
  closeModal: () => void;
  confirmClick: () => void;
};

interface State {
  account: number;
  extrinsic: {
    selectedModule: number;
    selectedItem: number;
  };
  pass: string;
  args: string[];
};

const DefaultState: State = {
  account: -1,
  extrinsic: {
    selectedModule: 0,
    selectedItem: 0,
  },
  pass: "",
  args: [],
};

export class RunExtrinsics extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    const accountItems: Item[] = this.props.accounts.map(val => ({
      label: val.meta.name,
      value: val,
    }));

    return (
      <ModalComponent className="run-extrinsics">
        <SelectInputComponent
          className="module"
          title="Substrate module"
          items={this.getModuleItems()}
          selectedItem={this.state.extrinsic.selectedModule}
          onChange={(_: Item, idx: number) => this.setState({
            extrinsic: { selectedModule: idx, selectedItem: 0 },
            args: [],
          })}
        />
        <SelectInputComponent
          className="extrinsic"
          title="Substrate module extrinsic"
          items={this.getExtrinsicItems()}
          selectedItem={this.state.extrinsic.selectedItem}
          onChange={(_: Item, idx: number) => this.setState({
            extrinsic: { selectedItem: idx, selectedModule: this.state.extrinsic.selectedModule },
            args: [],
          })}
        />
        {this.renderArguments()}
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
            title="Confirm"
            onClick={() => this.handleConfirm()}
          />
        </div>
      </ModalComponent>
    );
  }

  private renderArguments(): JSX.Element {
    const tx = this.getExtrinsic();
    if (!tx) {
      return <div></div>;
    }
    const ext = tx.value.toJSON();
    const args = ext.args.map((val: { name: string, type: string }, idx: number) => (
      <TextInputComponent
        key={idx}
        className="argument"
        type="text"
        title={`${val.name}: ${val.type}`}
        placeholder=""
        value={this.state.args[idx] || ""}
        onChange={(val: string) => {
          const args = this.state.args;
          args[idx] = val;
          this.setState({ args });
        }}
      />
    ));
    return (<div className="arguments">{args}</div>);
  }

  private getExtrinsic(): any {
    const { selectedItem } = this.state.extrinsic;
    const items = this.getExtrinsicItems();
    return items[selectedItem];
  }

  private getModuleItems(): Item[] {
    const mods = this.getExtrinsicModules();
    return mods.map(val => ({
      label: val,
    }));
  }

  private getExtrinsicItems(): Item[] {
    const { selectedModule } = this.state.extrinsic;
    const mod = this.getModuleItems()[selectedModule];
    if (!mod) {
      return [];
    }
    const [keys] = this.getExtrinsics(mod.label);
    return keys.map(val => ({
      label: val,
      value: this.props.api.tx[mod.label][val],
    }));
  }

  private getExtrinsicModules(): string[] {
    const keys = Object.keys(this.props.api.tx).filter((value) => {
      const res = Object.keys(this.props.api.tx[value]);
      if (res.length > 0) {
        return true;
      }
      return false;
    });
    return keys;
  }

  private getExtrinsics(key: string): [string[], string[]] {
    const keys = Object.keys(this.props.api.tx[key]);
    const docs = keys.map((val) => {
      const ext = this.props.api.tx[key][val].toJSON();
      return ext.documentation.join('\n');
    });
    return [keys, docs];
  }

  private handleConfirm() {
    if (!this.props.accounts[this.state.account]) {
      atom.notifications.addError("Account must be selected");
      return;
    }
    this.exec();
    this.props.confirmClick();
    this.props.closeModal();
  }

  private async exec() {
    try {
      const con = this.props.api;
      const keyring = new Keyring({ type: "sr25519" });
      const account = keyring.addFromJson(this.props.accounts[this.state.account]);
      const nonce = await con.query.system.accountNonce(account.address);
      const extrinsic = this.getExtrinsic().value;
      const unsignedTransaction = extrinsic(...this.state.args);
      account.decodePkcs8(this.state.pass);

      await unsignedTransaction.sign(account, { nonce: nonce as any }).send(({ events = [], status }: any) => {
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
          } else {
            atom.notifications.addSuccess(`Completed at block hash: ${finalized}`);
          }
        }
      });
    } catch (err) {
      atom.notifications.addError(`Error on extrinsic: ${err.message}`);
    }
  }
}
