"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("js-crdt/build/text");
const QuillDelta = require("quill-delta");
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
            const dd = new QuillDelta()
                .retain(0)
                .insert(text_1.renderString(text));
            this.quill.setContents(dd);
        });
    }
}
exports.QuillContentUpdater = QuillContentUpdater;
