"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("js-crdt/build/text");
class CRDTOperations {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.initEvents();
    }
    initEvents() {
        this.quill.on('text-change', this.onTextChange.bind(this));
        this.quill.on('selection-change', this.onSelectionChange.bind(this));
    }
    onTextChange(delta, oldDelta, source) {
        if (source !== "user") {
            return;
        }
        const ops = deltaToOperations(delta);
        const range = this.quill.getSelection(true);
        if (range) {
            const selection = this.rangeToSelection(range);
            ops.push(selection);
        }
        this.emitOperations(ops);
    }
    onSelectionChange(range, oldRange, source) {
        if (source !== 'user') {
            return;
        }
        if (range) {
            let ops = [
                this.rangeToSelection(range),
            ];
            this.emitOperations(ops);
        }
    }
    emitOperations(ops) {
        this.quill.emitter.emit('text-operations', ops);
    }
    rangeToSelection(r) {
        return rangeToSelection(this.options.selectionOrigin, r);
    }
}
exports.CRDTOperations = CRDTOperations;
function rangeToSelection(origin, s) {
    return new text_1.Selection(origin, s.index, s.length);
}
exports.rangeToSelection = rangeToSelection;
function selectionToRange(s) {
    return {
        index: s.at,
        length: s.length,
    };
}
exports.selectionToRange = selectionToRange;
function deltaToOperations(delta) {
    return delta.ops.reduce((r, o) => {
        if (o.retain) {
            r.pos = o.retain;
        }
        else if (o.insert) {
            // because for Quill when you replace selected text with other text
            // first you do insert and then delete :/
            r.ops.unshift(new text_1.Insert(r.pos, o.insert));
        }
        else if (o.delete) {
            // because for Quill when you replace selected text with other text
            // first you do insert and then delete :/
            r.ops.unshift(new text_1.Delete(r.pos, o.delete));
        }
        return r;
    }, { pos: 0, ops: [] }).ops;
}
exports.deltaToOperations = deltaToOperations;
