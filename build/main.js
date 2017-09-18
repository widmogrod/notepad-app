"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
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
const text_sync_1 = require("./text-sync");
const textSync = new text_sync_1.TextSync(js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock(clientID)));
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
const quill_cursors_updater_1 = require("./quill-cursors-updater");
const colorHash = new ColorHash();
const cursorUpdater = new quill_cursors_updater_1.QuillCursorsUpdater(editor.getModule('cursors'), editor, clientID, colorHash.hex.bind(colorHash));
cursorUpdater.register(textSync);
exports.default = {
    textSync,
};
