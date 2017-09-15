"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/delay");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
const serialiser_1 = require("./serialiser");
function uuid() {
    const array = new Uint8Array(2);
    crypto.getRandomValues(array);
    return array.join('-');
}
let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';
const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '');
let database = js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock2(uuid()));
// this subject queues as necessary to ensure every message is delivered
const publish = new queueing_subject_1.QueueingSubject();
// this method returns an object which contains two observables
const { messages, connectionStatus } = rxjs_websockets_1.default(WebSocketURL, publish);
connectionStatus.subscribe(e => console.log({ status: e }));
// This is hack to properly require quill :/
const Quill = require("quill");
var editor = new Quill('#editor', {
    modules: {
        toolbar: false,
    },
    theme: 'snow'
});
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
        const data = serialiser_1.serialise(database);
        publish.next(data);
    }
});
const QuillDelta = require("quill-delta");
messages
    .retryWhen(errors => errors.delay(1000))
    .map(serialiser_1.deserialise)
    .subscribe(e => {
    database = database.next();
    database = database.merge(e);
    const dd = new QuillDelta()
        .retain(0)
        .insert(js_crdt_1.default.text.renderString(database));
    const s = editor.getSelection();
    editor.setContents(dd);
    editor.setSelection(s);
});
