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
function creteQuill(config) {
    return new Quill(config.editorId, {
        modules: {
            toolbar: false,
            cursors: true,
            crdtOperations: {
                selectionOrigin: config.clientID,
            },
        },
        formats: [],
        theme: 'snow'
    });
}
const text_sync_1 = require("./text-sync");
const quill_content_updater_1 = require("./quill-content-updater");
const quill_cursors_updater_1 = require("./quill-cursors-updater");
const communication_ws_1 = require("./communication-ws");
function createContentUpdater(editor) {
    return new quill_content_updater_1.QuillContentUpdater(editor);
}
function createCursorUpdater(editor, config, colorHash) {
    return new quill_cursors_updater_1.QuillCursorsUpdater(editor.getModule('cursors'), editor, config.clientID, colorHash.hex.bind(colorHash));
}
function createCommunicationWS(config) {
    return new communication_ws_1.CommunicationWS(config.wsURL);
}
function createTextSync(config) {
    return new text_sync_1.TextSync(js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock(config.clientID)));
}
const config = {
    editorId: '#editor',
    clientID: uuid(),
    wsURL: websocketURL(),
};
const colorHash = new ColorHash();
const editor = creteQuill(config);
const contentUpdater = createContentUpdater(editor);
const cursorUpdater = createCursorUpdater(editor, config, colorHash);
const communicationWS = createCommunicationWS(config);
const textSync = createTextSync(config);
function main() {
    contentUpdater.register(textSync);
    cursorUpdater.register(textSync);
    communicationWS.register(textSync);
    editor.focus();
}
main();
