import * as React from "react";
import { ApiPromise } from "@polkadot/api";

import { IAccount } from "../../../store/modules/substrate/types";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
// import { TextInputComponent } from "../../inputs/text";
import { SelectInputComponent, Item } from "../../inputs/select";

export interface Props {
  api: ApiPromise;
  accounts: IAccount[];
  closeModal: () => void;
  confirmClick: () => void;
};

interface State {
  account: {
    selected: number;
    items: Item[];
  };
  extrinsic: {
    selectedModule: number;
    selectedItem: number;
  };
};

const DefaultState: State = {
  account: {
    selected: -1,
    items: [],
  },
  extrinsic: {
    selectedModule: 0,
    selectedItem: 0,
  },
};

export class RunExtrinsics extends React.Component<Props, State> {
  public state: State = DefaultState;

  // constructor(props: Props) {
  //   super(props);
  //   const selectedModule = this.getDefaultItem(props.api.tx);
  //   this.state.extrinsic.selectedModule = selectedModule;
  //   this.state.extrinsic.selectedItem = this.getDefaultItem(props.api.tx[selectedModule]);
  // }
  //
  // private getDefaultItem(val: any): string {
  //   return Object.keys(val)[0];
  // }

  public render(): JSX.Element {
    const accountItems: Item[] = this.props.accounts.map(val => ({
      label: val.meta.name,
    }));

    return (
      <ModalComponent className="run-extrinsics">
        <SelectInputComponent
          className="module"
          title="Substrate module"
          items={this.getModuleItems()}
          selectedItem={this.state.extrinsic.selectedModule}
          onChange={(_: Item, idx: number) => this.setState({
            extrinsic: { selectedModule: idx, selectedItem: this.state.extrinsic.selectedItem },
          })}
        />
        <SelectInputComponent
          className="extrinsic"
          title="Substrate module extrinsic"
          items={this.getExtrinsicItems()}
          selectedItem={this.state.extrinsic.selectedItem}
          onChange={(_: Item, idx: number) => this.setState({
            extrinsic: { selectedItem: idx, selectedModule: this.state.extrinsic.selectedModule },
          })}
        />
        <SelectInputComponent
          className="account"
          title="Account key type"
          items={accountItems}
          selectedItem={this.state.account.selected}
          onChange={(_: Item, idx: number) => this.setState({
            account: { selected: idx, items: this.state.account.items },
          })}
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

  private getModuleItems(): Item[] {
    const mods = this.getExtrinsicModules();
    return mods.map(val => ({
      label: val,
    }));
  }

  private getExtrinsicItems(): Item[] {
    const mod = this.getModuleItems()[this.state.extrinsic.selectedModule];
    const [keys] = this.getExtrinsics(mod.label);
    return keys.map(val => ({
      label: val,
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
    this.props.confirmClick();
    this.props.closeModal();
    this.setState(DefaultState);
  }
}
// <TextInputComponent
//   className="name"
//   type="text"
//   title="Account name"
//   placeholder="Alice"
//   value={this.state.name}
//   onChange={(val: string) => this.setState({ name: val })}
// />
// <SelectInputComponent
//   className="key-type"
//   title="Account key type"
//   items={this.state.keyType.items}
//   selectedItem={this.state.keyType.selected}
//   onChange={(_: Item, idx: number) => this.selectKeyType(idx)}
// />
