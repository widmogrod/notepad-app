"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
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
// This is hack to properly require quill :/
const Quill = require("quill");
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
const quill_content_updater_1 = require("./quill-content-updater");
const contentUpdater = new quill_content_updater_1.QuillContentUpdater(editor);
contentUpdater.register(textSync);
const quill_cursors_updater_1 = require("./quill-cursors-updater");
const colorHash = new ColorHash();
const cursorUpdater = new quill_cursors_updater_1.QuillCursorsUpdater(editor.getModule('cursors'), editor, clientID, colorHash.hex.bind(colorHash));
cursorUpdater.register(textSync);
const communication_ws_1 = require("./communication-ws");
const communicationWS = new communication_ws_1.CommunicationWS(WebSocketURL);
communicationWS.register(textSync);
