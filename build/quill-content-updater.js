"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("js-crdt/build/text");
class QuillContentUpdater {
    constructor(quill) {
        this.quill = quill;
    }
    register(t) {
        this.recordLocalChange(t);
        this.renderRemoteChange(t);
    }
    recordLocalChange(t) {
        this.quill.on('text-operations', (ops) => {
            t.localChange(ops);
        });
    }
    renderRemoteChange(t) {
        t.onRemoteChange((oo, text) => {
            this.quill.setText(text_1.renderString(text));
        });
    }
}
exports.QuillContentUpdater = QuillContentUpdater;
