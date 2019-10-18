import * as React from "react";

export interface Item {
  label: string;
};

export interface Props {
  className: string;
  title: string;
  items: Item[];
  selectedItem: number;
  onChange: (item: Item, idx: number) => void;
};

interface State {
  isOpen: boolean;
};

export class SelectInputComponent extends React.Component<Props, State> {
  public state: State = {
    isOpen: false,
  };

  public render(): JSX.Element {
    let items
    if (this.props.items) {
      items = this.renderItems(this.props.items)
    } else {
      items = this.props.children
    }
    const si = this.props.selectedItem;
    const itemsClass = this.state.isOpen ? "ui-select__items--open" : "";
    return (
      <div className={`si-select ${this.props.className}`}>
        <span>{this.props.title}</span>
        <div className="ui-select">
          <div className="ui-select__value-display" onClick={this.handleClick.bind(this)}>
            {si !== -1 ? this.props.items[si].label : "Select item"}
          </div>
          <ul ref="items" className={`ui-select__items ${itemsClass}`}>
            {items}
          </ul>
        </div>
      </div>
    );
  }

  private handleClick() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  private handleItemClick(item: Item, idx: number) {
    this.props.onChange(item, idx);
    this.setState({ isOpen: false });
  }

  private renderItems(items: Item[]) {
    return items.map((item: Item, idx: number) => {
      const itemClass = this.props.selectedItem === idx ? "ui-select__item--selected" : "";
      return (
        <li
          key={idx}
          className={`ui-select__item ${itemClass}`}
          onClick={() => this.handleItemClick(item, idx)}
        >
          {item.label}
        </li>
      )
    })
  }
}
