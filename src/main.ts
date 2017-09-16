import crdt from 'js-crdt';
import {Insert, Delete, Selection, Operation} from 'js-crdt/build/text';
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
let database = crdt.text.createFromOrderer(crdt.order.createVectorClock(clientID));

// this subject queues as necessary to ensure every message is delivered
const publish = new QueueingSubject()

// this method returns an object which contains two observables
const { messages, connectionStatus } = websocketConnect(WebSocketURL, publish)

connectionStatus.subscribe(e => console.log({status: e}));

// This is hack to properly require quill :/
import * as Quill from 'quill';
import * as QuillDelta from 'quill-delta'
import 'quill-cursors';

type QRetain = {retain: number}
type QInsert = {insert: string}
type QDelete = {delete: number}
type QOperation = QRetain | QInsert | QDelete;
type QSource = "user" | "api"

interface Delta {
  ops: QOperation[]
}

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

interface OperationReducer {
  pos: number;
  op: Operation;
}

editor.on('text-change', function(delta: Delta, oldDelta: Delta, source: QSource) {
  if (source !== "user") {
    return;
  }

  const r = delta.ops.reduce((r: OperationReducer, o: QOperation) => {
    if ((<QRetain>o).retain) {
      r.pos = (<QRetain>o).retain;
    } else if ((<QInsert>o).insert) {
      r.op = new crdt.text.Insert(r.pos, (<QInsert>o).insert);
    } else if ((<QDelete>o).delete) {
      r.op = new crdt.text.Delete(r.pos, (<QDelete>o).delete);
    }

    return r;
  }, {pos: 0, op: null});

  if (r.op) {
    database = database.next();
    database.apply(r.op);
    let op = database.apply(quillSelectionToCrdt(editor.getSelection(true)));
    publish.next(serialiseOperations(op));
  }
});
editor.on('selection-change', function(range: QSelection, oldRange: QSelection, source: QSource) {
  if (source !== 'user') {
    return;
  }

  if (range) {
    database = database.next();
    let op = database.apply(quillSelectionToCrdt(range))
    publish.next(serialiseOperations(op));
  }
});


messages
  .retryWhen(errors => errors.delay(10000))
  .map(deserialiseOperations)
  .subscribe(oo => {
    database = database.next();
    database = database.mergeOperations(oo);
    // diff?
    // database.diff(database.mergeOperations(oo));

    const dd = new QuillDelta()
      .retain(0)
      .insert(crdt.text.renderString(database))

    editor.setContents(dd);

    const currentSelection = quillSelectionToCrdt(editor.getSelection(true));
    const selections = crdt.text.getSelections(database, currentSelection);

    selections.reduce((_, s: Selection) => {
      if (s.origin === clientID) {
        editor.setSelection(crdtSelectionToQuill(s))
      } else {
        cursors.setCursor(s.origin, crdtSelectionToQuill(s), s.origin, colorHash.hex(s.origin));
      }
    }, null);
  });

interface QSelection {
  index: number;
  length: number;
}

function quillSelectionToCrdt(s: QSelection): Selection {
  return new Selection(
    clientID,
    s.index,
    s.length,
  );
}

function crdtSelectionToQuill(s: Selection): QSelection {
  return {
    index: s.at,
    length: s.length,
  };
}
