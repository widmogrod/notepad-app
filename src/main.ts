import crdt from 'js-crdt';
import {Text, Insert, Delete, Selection, Operation, OrderedOperations} from 'js-crdt/build/text';
import {Observable, Observer, Scheduler} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import {serialiseOperations, deserialiseOperations} from './serialiser';
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

// this subject queues as necessary to ensure every message is delivered
const publish = new QueueingSubject()

// this method returns an object which contains two observables
const { messages, connectionStatus } = websocketConnect(WebSocketURL, publish)

// This is hack to properly require quill :/
import * as Quill from 'quill';
import * as QuillDelta from 'quill-delta'
import 'quill-cursors';
import {CRDTOperations, rangeToSelection, selectionToRange} from './quill-adapter';

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

textSync.onLocalChange((oo: OrderedOperations, text: Text) => {
  publish.next(serialiseOperations(oo));
});
textSync.onRemoteChange((oo: OrderedOperations, text: Text) => {
  const dd = new QuillDelta()
    .retain(0)
    .insert(crdt.text.renderString(text))

  editor.setContents(dd);
});

editor.on('text-operations', (ops: Operation[]) => {
  textSync.localChange(ops);
});

messages
  .retryWhen(errors => errors.delay(10000))
  .map(deserialiseOperations)
  .subscribe(oo => {
    textSync.remoteChange(oo);
  });

import {QuillCursorsUpdater} from './quill-cursors-updater';

const colorHash = new ColorHash();
const cursorUpdater = new QuillCursorsUpdater(
  editor.getModule('cursors'),
  editor,
  clientID,
  colorHash.hex.bind(colorHash),
);

cursorUpdater.register(textSync);

export default {
  textSync,
};
