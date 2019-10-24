import * as React from "react";
import { ApiPromise } from "@polkadot/api";

import { IAccount } from "../../../store/modules/substrate/types";
import { ModalComponent } from "../../modal";
import { DefaultButtonComponent } from "../../buttons/default";
// import { TextInputComponent } from "../../inputs/text";
import { SelectInputComponent, Item } from "../../inputs/select";

export type Props = {
  api: ApiPromise;
  accounts: IAccount[];
  closeModal: () => void;
  confirmClick: () => void;
};

type State = {
  account: {
    selected: number,
    items: Item[],
  },
};

const DefaultState: State = {
  account: {
    selected: -1,
    items: [],
  },
};

export class RunExtrinsics extends React.Component<Props, State> {
  public state: State = DefaultState;

  public render(): JSX.Element {
    const accountItems: Item[] = this.props.accounts.map(val => ({
      label: val.meta.name,
    }));

    return (
      <ModalComponent className="run-extrinsics">
        <SelectInputComponent
          className="key-type"
          title="Account key type"
          items={accountItems}
          selectedItem={this.state.account.selected}
          onChange={(_: Item, idx: number) => this.selectAccount(idx)}
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

  private handleConfirm() {
    this.props.confirmClick();
    this.props.closeModal();
    this.setState(DefaultState);
  }

  private selectAccount(idx: number) {
    const items = this.state.account.items;
    this.setState({
      account: {
        selected: idx,
        items: items,
      },
    });
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
