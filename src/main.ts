import crdt from 'js-crdt';
import {Text, Operation, OrderedOperations} from 'js-crdt/build/text';
import * as ColorHash from 'color-hash';

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '')

const clientID = uuid();

// This is hack to properly require quill :/
import * as Quill from 'quill';
import 'quill-cursors';
import {CRDTOperations} from './quill-adapter';

Quill.register('modules/crdtOperations', CRDTOperations)

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

import {TextSync} from './text-sync';

const textSync = new TextSync(
  crdt.text.createFromOrderer(
    crdt.order.createVectorClock(clientID),
  ),
);

import {QuillContentUpdater} from './quill-content-updater';

const contentUpdater = new QuillContentUpdater(editor);
contentUpdater.register(textSync);

import {QuillCursorsUpdater} from './quill-cursors-updater';

const colorHash = new ColorHash();
const cursorUpdater = new QuillCursorsUpdater(
  editor.getModule('cursors'),
  editor,
  clientID,
  colorHash.hex.bind(colorHash),
);
cursorUpdater.register(textSync);

import {CommunicationWS} from './communication-ws';

const communicationWS = new CommunicationWS(WebSocketURL);
communicationWS.register(textSync);
