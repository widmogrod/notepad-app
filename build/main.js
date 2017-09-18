"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
const text_1 = require("js-crdt/build/text");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/delay");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
const serialiser_1 = require("./serialiser");
const ColorHash = require("color-hash");
function uuid() {
    const array = new Uint8Array(2);
    crypto.getRandomValues(array);
    return array.join('-');
}
const colorHash = new ColorHash();
let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';
const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '');
const clientID = uuid();
// this subject queues as necessary to ensure every message is delivered
const publish = new queueing_subject_1.QueueingSubject();
// this method returns an object which contains two observables
const { messages, connectionStatus } = rxjs_websockets_1.default(WebSocketURL, publish);
// This is hack to properly require quill :/
const Quill = require("quill");
const QuillDelta = require("quill-delta");
require("quill-cursors");
const quill_adapter_1 = require("./quill-adapter");
Quill.register('modules/crdtOperations', quill_adapter_1.CRDTOperations);
let editor = new Quill('#editor', {
    modules: {
        toolbar: false,
        cursors: true,
        crdtOperations: {
            selectionOrigin: clientID,
        },
    },
    formats: [],
    theme: 'snow'
});
editor.focus();
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
const textSync = new TextSync(js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock(clientID)));
textSync.onLocalChange((oo, text) => {
    publish.next(serialiser_1.serialiseOperations(oo));
});
textSync.onRemoteChange((oo, text) => {
    const dd = new QuillDelta()
        .retain(0)
        .insert(js_crdt_1.default.text.renderString(text));
    editor.setContents(dd);
});
editor.on('text-operations', (ops) => {
    textSync.localChange(ops);
});
messages
    .retryWhen(errors => errors.delay(10000))
    .map(serialiser_1.deserialiseOperations)
    .subscribe(oo => {
    textSync.remoteChange(oo);
});
class QuillCursorsUpdater {
    constructor(cursors) {
        this.cursors = cursors;
    }
    register(m) {
        m.onLocalChange((oo, text) => this.updateSelection(text));
        m.onRemoteChange((oo, text) => this.updateSelection(text));
    }
    updateSelection(text) {
        const defaultSelection = new text_1.Selection(clientID, 0, 0);
        const selections = js_crdt_1.default.text.getSelections(text, defaultSelection);
        selections.reduce((_, s) => {
            if (s.origin === clientID) {
                editor.setSelection(quill_adapter_1.selectionToRange(s));
            }
            else {
                this.cursors.setCursor(s.origin, quill_adapter_1.selectionToRange(s), s.origin, colorHash.hex(s.origin));
            }
        }, null);
    }
}
const cursorUpdater = new QuillCursorsUpdater(editor.getModule('cursors'));
cursorUpdater.register(textSync);
exports.default = {
    textSync,
};
