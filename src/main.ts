import crdt from 'js-crdt';
import {Text, Operation, OrderedOperations} from 'js-crdt/build/text';
import * as ColorHash from 'color-hash';

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

function websocketURL(): string {
  let host = window.document.location.host.replace(/:.*/, '');
  let port = window.document.location.port;
  let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

  return protocol + '://' + host + (port ? (':' + port) : '')
}

// This is hack to properly require quill :/
import * as Quill from 'quill';
import 'quill-cursors';
import {CRDTOperations} from './quill-adapter';

Quill.register('modules/crdtOperations', CRDTOperations)

function creteQuill(config) {
  return  new Quill(config.editorId, {
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

import {TextSync} from './text-sync';
import {QuillContentUpdater} from './quill-content-updater';
import {QuillCursorsUpdater} from './quill-cursors-updater';
import {CommunicationWS} from './communication-ws';

function createContentUpdater(editor): QuillContentUpdater {
  return new QuillContentUpdater(editor);
}

function createCursorUpdater(editor, config, colorHash): QuillCursorsUpdater {
  return new QuillCursorsUpdater(
    editor.getModule('cursors'),
    editor,
    config.clientID,
    colorHash.hex.bind(colorHash),
  );
}

function createCommunicationWS(config: {wsURL: string}): CommunicationWS {
  return new CommunicationWS(config.wsURL);
}

function createTextSync(config: {clientID: string}): TextSync {
  return new TextSync(
    crdt.text.createFromOrderer(
      crdt.order.createVectorClock(config.clientID),
    ),
  );
}

const config = {
  editorId: '#editor',
  clientID: uuid(),
  wsURL : websocketURL(),
};

const colorHash = new ColorHash();
const editor = creteQuill(config);
const contentUpdater = createContentUpdater(editor)
const cursorUpdater =  createCursorUpdater(editor, config, colorHash);
const communicationWS = createCommunicationWS(config);
const textSync = createTextSync(config);

function main() {
  contentUpdater.register(textSync);
  cursorUpdater.register(textSync);
  communicationWS.register(textSync);

  editor.focus();
}

main();
