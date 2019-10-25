import * as React from "react";
import { ApiPromise } from "@polkadot/api";

import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
import { TextInputComponent } from "../../inputs/text";
import { SelectInputComponent, Item } from "../../inputs/select";

export interface Props {
  api: ApiPromise;
  closeModal: () => void;
  confirmClick: () => void;
};

interface State {
  chainState: {
    selectedModule: number;
    selectedItem: number;
  };
  arg?: string;
  result?: string;
};

const DefaultState: State = {
  chainState: {
    selectedModule: 0,
    selectedItem: 0,
  },
};

export class SubChainState extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    return (
      <ModalComponent className="run-extrinsics">
        <SelectInputComponent
          className="module"
          title="Substrate module"
          items={this.getModuleItems()}
          selectedItem={this.state.chainState.selectedModule}
          onChange={(_: Item, idx: number) => this.setState({
            chainState: { selectedModule: idx, selectedItem: 0 },
            arg: undefined,
          })}
        />
        <SelectInputComponent
          className="extrinsic"
          title="Substrate module extrinsic"
          items={this.getExtrinsicItems()}
          selectedItem={this.state.chainState.selectedItem}
          onChange={(_: Item, idx: number) => this.setState({
            chainState: { selectedItem: idx, selectedModule: this.state.chainState.selectedModule },
            arg: undefined,
          })}
        />
        {this.renderArguments()}
        {this.renderResult()}
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

  private renderArguments(): JSX.Element | undefined {
    const query = this.getExtrinsic();
    if (!query) {
      return;
    }
    const meta = query.value.meta;
    const name = meta.toJSON();
    if (!(name instanceof Object)) {
      return;
    }
    const map = name.type.Map;
    if (!map) {
      return;
    }
    return (
      <div className="arguments">
        <TextInputComponent
          className="argument"
          type="text"
          title={`Type: ${map.key}`}
          placeholder=""
          value={this.state.arg || ""}
          onChange={(val: string) => this.setState({ arg: val })}
        />
      </div>
    );
  }

  private renderResult(): JSX.Element | undefined {
    const result = this.state.result;
    if (!result) {
      return;
    }
    return <textarea className="result" readOnly value={`Result: ${result}`}></textarea>;
  }

  private getExtrinsic(): any {
    const { selectedItem } = this.state.chainState;
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
    const { selectedModule } = this.state.chainState;
    const mod = this.getModuleItems()[selectedModule];
    if (!mod) {
      return [];
    }
    const keys = this.getExtrinsics(mod.label);
    return keys.map(val => ({
      label: val,
      value: this.props.api.query[mod.label][val],
    }));
  }

  private getExtrinsicModules(): string[] {
    const keys = Object.keys(this.props.api.query).filter((value) => {
      const res = Object.keys(this.props.api.query[value]);
      if (res.length > 0) {
        return true;
      }
      return false;
    });
    return keys;
  }

  private getExtrinsics(key: string): string[] {
    const keys = Object.keys(this.props.api.query[key]);
    return keys;
  }

  private handleConfirm() {
    this.exec();
    this.props.confirmClick();
  }

  private async exec() {
    try {
      const chainState = this.getExtrinsic().value;
      await chainState(this.state.arg, (data: any) => {
        this.setState({ result: data.toString() });
      });
    } catch (err) {
      atom.notifications.addError(`Error on extrinsic: ${err.message}`);
    }
  }
}
