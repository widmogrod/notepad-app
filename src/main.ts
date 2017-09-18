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

const colorHash = new ColorHash();

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

type ChangeFunc = (oo: OrderedOperations, text: Text, previous: Text) => void;

import * as EventEmitter from 'events';

class TextSync {
  private events: EventEmitter;
  constructor(private text: Text) {
    this.events = new EventEmitter();
  }

  public localChange(ops: Operation[]) {
    if (!ops || !ops.length) {
      return;
    }

    const previous = this.text;
    this.text = this.text.next();
    const oo = this.text.apply(...ops);

    this.triggerLocalModelUpdate(oo, this.text, previous)
  }

  public remoteChange(oo: OrderedOperations) {
    const previous = this.text;
    this.text = this.text.next();
    this.text = this.text.mergeOperations(oo);

    this.triggerRemoteModelUpdate(oo, this.text, previous);
  }

  public triggerLocalModelUpdate(oo: OrderedOperations, text: Text, previous: Text) {
    this.events.emit('local-change', oo, text, previous)
  }

  public triggerRemoteModelUpdate(oo: OrderedOperations, text: Text, previous: Text) {
    this.events.emit('remote-change', oo, text, previous)
  }

  public onLocalChange(fn: ChangeFunc) {
    this.events.on('local-change', fn);
  }

  public onRemoteChange(fn: ChangeFunc) {
    this.events.on('remote-change', fn);
  }
}

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

class QuillCursorsUpdater {
  constructor(private cursors) {}

  public register(m: TextSync) {
    m.onLocalChange((oo: OrderedOperations, text: Text) => this.updateSelection(text))
    m.onRemoteChange((oo: OrderedOperations, text: Text) => this.updateSelection(text))
  }

  private updateSelection(text: Text) {
    const defaultSelection = new Selection(clientID, 0, 0);
    const selections = crdt.text.getSelections(text, defaultSelection);

    selections.reduce((_, s: Selection) => {
      if (s.origin === clientID) {
        editor.setSelection(selectionToRange(s));
      } else {
        this.cursors.setCursor(s.origin, selectionToRange(s), s.origin, colorHash.hex(s.origin));
      }
    }, null);
  }
}

const cursorUpdater = new QuillCursorsUpdater(
  editor.getModule('cursors'),
);

cursorUpdater.register(textSync);

export default {
  textSync,
};
