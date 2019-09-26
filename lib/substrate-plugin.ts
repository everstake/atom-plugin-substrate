'use babel';

import SubstratePluginView from './substrate-plugin-view';
import { CompositeDisposable, Panel } from 'atom';

export default {
  substratePluginView: null as SubstratePluginView | null,
  modalPanel: null as Panel<HTMLElement> | null,
  subscriptions: null as CompositeDisposable | null,

  activate(state: any) {
    this.substratePluginView = new SubstratePluginView(state.substratePluginViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.substratePluginView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'substrate-plugin:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel!.destroy();
    this.subscriptions!.dispose();
    this.substratePluginView!.destroy();
  },

  serialize() {
    return {
      substratePluginViewState: this.substratePluginView!.serialize()
    };
  },

  toggle() {
    console.log('SubstratePlugin was toggled!');
    return (
      this.modalPanel!.isVisible() ?
      this.modalPanel!.hide() :
      this.modalPanel!.show()
    );
  }
};
