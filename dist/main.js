"use strict";
"use babel";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const view_1 = require("./view");
exports.default = {
    substratePluginView: null,
    modalPanel: null,
    subscriptions: null,
    statusBarTile: null,
    activate(state) {
        console.log("Activating substrate plugin");
        this.substratePluginView = new view_1.default(state.substratePluginViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.substratePluginView.getElement(),
            visible: false,
        });
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new atom_1.CompositeDisposable();
        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add("atom-workspace", {
            "substrate-plugin:toggle": () => this.toggle()
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
    consumeStatusBar(statusBar) {
        const div = document.createElement("div");
        div.classList.add("inline-block");
        const icon = document.createElement("span");
        icon.textContent = "Substrate";
        const link = document.createElement("a");
        link.appendChild(icon);
        link.onclick = (_e) => {
            this.toggle();
        };
        const disposable = atom.tooltips.add(div, { title: "Toggle Substrate plugin sidebar" });
        div.appendChild(link);
        this.statusBarTile = statusBar.addRightTile({
            item: div,
            priority: 0,
        });
        return new atom_1.Disposable(() => disposable.dispose());
    },
    toggle() {
        console.log("SubstratePlugin was toggled!");
        return (this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show());
    },
};
//# sourceMappingURL=main.js.map