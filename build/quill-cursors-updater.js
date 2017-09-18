"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("js-crdt/build/text");
const quill_adapter_1 = require("./quill-adapter");
class QuillCursorsUpdater {
    constructor(cursors, editor, selectionOrigin, color) {
        this.cursors = cursors;
        this.editor = editor;
        this.selectionOrigin = selectionOrigin;
        this.color = color;
    }
    register(m) {
        m.onLocalChange((oo, text) => this.updateSelection(text));
        m.onRemoteChange((oo, text) => this.updateSelection(text));
    }
    updateSelection(text) {
        const defaultSelection = new text_1.Selection(this.selectionOrigin, 0, 0);
        const selections = text_1.getSelections(text, defaultSelection);
        selections.reduce((_, s) => {
            if (s.origin === this.selectionOrigin) {
                this.editor.setSelection(quill_adapter_1.selectionToRange(s));
            }
            else {
                this.cursors.setCursor(s.origin, quill_adapter_1.selectionToRange(s), s.origin, this.color(s.origin));
            }
        }, null);
    }
}
exports.QuillCursorsUpdater = QuillCursorsUpdater;
