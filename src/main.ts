import crdt from 'js-crdt';
import {Insert, Delete} from 'js-crdt/build/text';
import {Observable, Observer, Scheduler} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import {serialise, deserialise} from './serialiser';

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '')

let database = crdt.text.createFromOrderer<Operation>(crdt.order.createVectorClock2(uuid()));

// this subject queues as necessary to ensure every message is delivered
const publish = new QueueingSubject()

// this method returns an object which contains two observables
const { messages, connectionStatus } = websocketConnect(WebSocketURL, publish)

connectionStatus.subscribe(e => console.log({status: e}));

// This is hack to properly require quill :/
import * as Quill from 'quill';

type QRetain = {retain: number}
type QInsert = {insert: string}
type QDelete = {delete: number}
type QOperation = QRetain | QInsert | QDelete;
type QSource = "user" | "api"

interface Delta {
  ops: QOperation[]
}

var editor = new Quill('#editor', {
  modules: {
    toolbar: false,
  },
  theme: 'snow'
});


type Operation = Insert | Delete;
type OperationReducer = {pos: number, op: Operation | null};

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

    const data = serialise(database);
    publish.next(data);
  }
});

import * as QuillDelta from 'quill-delta'

messages
  .retryWhen(errors => errors.delay(1000))
  .map(deserialise)
  .subscribe(e => {
    database = database.next();
    database = database.merge(e);

    const dd = new QuillDelta()
      .retain(0)
      .insert(crdt.text.renderString(database))

    const s = editor.getSelection()
    editor.setContents(dd);
    editor.setSelection(s)
  });
