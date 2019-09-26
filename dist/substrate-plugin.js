"use strict";
'use babel';
Object.defineProperty(exports, "__esModule", { value: true });
const substrate_plugin_view_1 = require("./substrate-plugin-view");
const atom_1 = require("atom");
exports.default = {
    substratePluginView: null,
    modalPanel: null,
    subscriptions: null,
    activate(state) {
        this.substratePluginView = new substrate_plugin_view_1.default(state.substratePluginViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.substratePluginView.getElement(),
            visible: false
        });
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new atom_1.CompositeDisposable();
        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'substrate-plugin:toggle': () => this.toggle()
        }));
    },
    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.substratePluginView.destroy();
    },
    serialize() {
        return {
            substratePluginViewState: this.substratePluginView.serialize()
        };
    },
    toggle() {
        console.log('SubstratePlugin was toggled!');
        return (this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show());
    }
};
//# sourceMappingURL=substrate-plugin.js.map