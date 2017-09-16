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
let database = js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock(clientID));
// this subject queues as necessary to ensure every message is delivered
const publish = new queueing_subject_1.QueueingSubject();
// this method returns an object which contains two observables
const { messages, connectionStatus } = rxjs_websockets_1.default(WebSocketURL, publish);
connectionStatus.subscribe(e => console.log({ status: e }));
// This is hack to properly require quill :/
const Quill = require("quill");
const QuillDelta = require("quill-delta");
require("quill-cursors");
let editor = new Quill('#editor', {
    modules: {
        toolbar: false,
        cursors: true,
    },
    formats: [],
    theme: 'snow'
});
editor.focus();
let cursors = editor.getModule('cursors');
editor.on('text-change', function (delta, oldDelta, source) {
    if (source !== "user") {
        return;
    }
    const r = delta.ops.reduce((r, o) => {
        if (o.retain) {
            r.pos = o.retain;
        }
        else if (o.insert) {
            r.op = new js_crdt_1.default.text.Insert(r.pos, o.insert);
        }
        else if (o.delete) {
            r.op = new js_crdt_1.default.text.Delete(r.pos, o.delete);
        }
        return r;
    }, { pos: 0, op: null });
    if (r.op) {
        database = database.next();
        database.apply(r.op);
        let op = database.apply(quillSelectionToCrdt(editor.getSelection(true)));
        publish.next(serialiser_1.serialiseOperations(op));
    }
});
editor.on('selection-change', function (range, oldRange, source) {
    if (source !== 'user') {
        return;
    }
    if (range) {
        database = database.next();
        let op = database.apply(quillSelectionToCrdt(range));
        publish.next(serialiser_1.serialiseOperations(op));
    }
});
messages
    .retryWhen(errors => errors.delay(10000))
    .map(serialiser_1.deserialiseOperations)
    .subscribe(oo => {
    database = database.next();
    database = database.mergeOperations(oo);
    // diff?
    // database.diff(database.mergeOperations(oo));
    const dd = new QuillDelta()
        .retain(0)
        .insert(js_crdt_1.default.text.renderString(database));
    editor.setContents(dd);
    const currentSelection = quillSelectionToCrdt(editor.getSelection(true));
    const selections = js_crdt_1.default.text.getSelections(database, currentSelection);
    selections.reduce((_, s) => {
        if (s.origin === clientID) {
            editor.setSelection(crdtSelectionToQuill(s));
        }
        else {
            cursors.setCursor(s.origin, crdtSelectionToQuill(s), s.origin, colorHash.hex(s.origin));
        }
    }, null);
});
function quillSelectionToCrdt(s) {
    return new text_1.Selection(clientID, s.index, s.length);
}
function crdtSelectionToQuill(s) {
    return {
        index: s.at,
        length: s.length,
    };
}
