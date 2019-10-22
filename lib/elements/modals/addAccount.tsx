import * as React from "react";
import { mnemonicGenerate, randomAsU8a } from "@polkadot/util-crypto";
import { KeypairType } from "@polkadot/util-crypto/types";
import { u8aToHex } from "@polkadot/util";

import { ModalComponent } from "../../components/modal";
import { DefaultButtonComponent } from "../../components/buttons/default";
import { TextInputComponent } from "../../components/inputs/text";
import { SelectInputComponent, Item } from "../../components/inputs/select";

export type Props = {
  closeModal: () => void;
  confirmClick: (
    name: string,
    keypairType: KeypairType,
    seed: string,
    pass: string,
  ) => void;
};

type State = {
  name: string,
  keypairType: {
    selected: number,
    items: Item[],
  },
  keyType: {
    selected: number,
    items: Item[],
  },
  seed: string,
  pass: string,
};

const DefaultState: State = {
  name: "",
  keypairType: {
    selected: 0,
    items: [{
      label: "sr25519" as KeypairType,
    }, {
      label: "ed25519" as KeypairType,
    }],
  },
  keyType: {
    selected: 0,
    items: [{ label: "Raw seed" }, { label: "Mnemonic seed" }],
  },
  seed: u8aToHex(randomAsU8a()),
  pass: "",
};

export class AddAccount extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="add-account">
        <TextInputComponent
          className="name"
          type="text"
          title="Account name"
          placeholder="Alice"
          value={this.state.name}
          onChange={(val: string) => this.setState({ name: val })}
        />
        <SelectInputComponent
          className="key-type"
          title="Account key type"
          items={this.state.keyType.items}
          selectedItem={this.state.keyType.selected}
          onChange={(_: Item, idx: number) => this.selectKeyType(idx)}
        />
        <TextInputComponent
          className="seed"
          type="text"
          title="Account seed"
          placeholder="0xefbe98e1d2a3b034df8637445f0b1c2a9979cbd8c2dbfe2cfd7910a7fdc236c1"
          value={this.state.seed}
          onChange={(val: string) => this.setState({ seed: val })}
        />
        <TextInputComponent
          className="password"
          type="password"
          title="Acccount encryption passphrase"
          placeholder="$Str0ngPassw0rd"
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
            title="Add account"
            onClick={this.handleConfirm.bind(this)}
          />
        </div>
      </ModalComponent>
    );
  }

  // Todo: Move to substrate folder
  private generateSeed(keyType: string) {
    return keyType !== "Raw seed" ?
      mnemonicGenerate() : u8aToHex(randomAsU8a());
  }

  private selectKeyType(idx: number) {
    const items = this.state.keyType.items;
    const keyType = items[idx].label;
    const seed = this.generateSeed(keyType);
    this.setState({
      keyType: {
        selected: idx,
        items: items,
      },
      seed,
    });
  }

  private handleConfirm(_: React.MouseEvent) {
    const { name, keypairType, seed, pass } = this.state;
    const pairType = keypairType.items[keypairType.selected].label;
    this.props.confirmClick(name, pairType as KeypairType, seed, pass);
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
