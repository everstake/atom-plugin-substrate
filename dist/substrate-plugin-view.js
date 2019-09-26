"use strict";
'use babel';
Object.defineProperty(exports, "__esModule", { value: true });
class SubstratePluginView {
    constructor(_serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('substrate-plugin');
        // Create message element
        const message = document.createElement('div');
        message.textContent = 'The SubstratePlugin package is Alive! It\'s ALIVE!';
        message.classList.add('message');
        this.element.appendChild(message);
    }
    // Returns an object that can be retrieved when package is activated
    serialize() { }
    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }
    getElement() {
        return this.element;
    }
}
exports.default = SubstratePluginView;
//# sourceMappingURL=substrate-plugin-view.js.map