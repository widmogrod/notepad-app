"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
class TextSync {
    constructor(text) {
        this.text = text;
        this.events = new EventEmitter();
    }
    localChange(ops) {
        if (!ops || !ops.length) {
            return;
        }
        const previous = this.text;
        this.text = this.text.next();
        const oo = this.text.apply(...ops);
        this.triggerLocalModelUpdate(oo, this.text, previous);
    }
    remoteChange(oo) {
        const previous = this.text;
        this.text = this.text.next();
        this.text = this.text.mergeOperations(oo);
        this.triggerRemoteModelUpdate(oo, this.text, previous);
    }
    triggerLocalModelUpdate(oo, text, previous) {
        this.events.emit('local-change', oo, text, previous);
    }
    triggerRemoteModelUpdate(oo, text, previous) {
        this.events.emit('remote-change', oo, text, previous);
    }
    onLocalChange(fn) {
        this.events.on('local-change', fn);
    }
    onRemoteChange(fn) {
        this.events.on('remote-change', fn);
    }
}
exports.TextSync = TextSync;
