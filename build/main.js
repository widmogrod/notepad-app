"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
const ColorHash = require("color-hash");
function uuid() {
    const array = new Uint8Array(2);
    crypto.getRandomValues(array);
    return array.join('-');
}
function websocketURL() {
    let host = window.document.location.host.replace(/:.*/, '');
    let port = window.document.location.port;
    let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';
    return protocol + '://' + host + (port ? (':' + port) : '');
}
// This is hack to properly require quill :/
const Quill = require("quill");
require("quill-cursors");
const quill_adapter_1 = require("./quill-adapter");
Quill.register('modules/crdtOperations', quill_adapter_1.CRDTOperations);
const text_sync_1 = require("./text-sync");
const quill_content_updater_1 = require("./quill-content-updater");
const quill_cursors_updater_1 = require("./quill-cursors-updater");
const communication_ws_1 = require("./communication-ws");
function creteQuill(di) {
    return new Quill(di.editorId, {
        modules: {
            toolbar: false,
            cursors: true,
            crdtOperations: {
                selectionOrigin: di.clientId,
            },
        },
        formats: [],
        theme: 'snow'
    });
}
function createContentUpdater(di) {
    return new quill_content_updater_1.QuillContentUpdater(di.editor);
}
function createCursorUpdater(di) {
    return new quill_cursors_updater_1.QuillCursorsUpdater(di.editor.getModule('cursors'), di.editor, di.clientId, di.stringToColor);
}
function createCommunicationWS(di) {
    return new communication_ws_1.CommunicationWS(di.wsURL);
}
function createTextSync(di) {
    return new text_sync_1.TextSync(js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock(di.clientId)));
}
function createStringToColor(di) {
    return (s) => di.colorHash.hex(s);
}
let DI = {
    editorId: '#editor',
    clientId: uuid(),
    wsURL: websocketURL(),
};
DI.colorHash = new ColorHash();
DI.editor = creteQuill(DI);
DI.stringToColor = createStringToColor(DI);
DI.contentUpdater = createContentUpdater(DI);
DI.cursorUpdater = createCursorUpdater(DI);
DI.communicationWS = createCommunicationWS(DI);
DI.textSync = createTextSync(DI);
function main(di) {
    di.contentUpdater.register(di.textSync);
    di.cursorUpdater.register(di.textSync);
    di.communicationWS.register(di.textSync);
    di.editor.focus();
}
main(DI);
