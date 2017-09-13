import crdt from 'js-crdt';
import {Observable, Scheduler} from 'rxjs/Rx';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import {serialise, deserialise} from './serialiser';

function bench(name, func, ctx?) {
  return function() {
    const start = new Date();
    const result = func.apply(ctx, arguments);
    const end = new Date();

    // console.log({name, time: end.getTime() - start.getTime()});

    return result;
  }
}

function uuid() {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

function shiftCursorPositionRelativeTo(text, position, diff?) {
  diff = diff |0;
  return text.reduce(({shiftBy, position}, operations) => {
    return operations.reduce(({shiftBy, position}, operation) => {
      if (operation instanceof crdt.text.Insert) {
        if (operation.at <= (position + diff)) {
          shiftBy += operation.value.length;
          position += operation.value.length;
        }
      } else if (operation instanceof crdt.text.Delete) {
        if (operation.at < position) {
          shiftBy -= operation.length;
        }
      }

      return {shiftBy, position};
    }, {shiftBy, position});
  }, {shiftBy: 0, position}).shiftBy;
}

interface Ev extends HTMLInputElement {
  preventDefault()
  type: string
  code: number
  key: string
  keyCode: number
  clipboardData: Cd
  target: T
}

interface G {
  target: T
}

interface T {
  selectionStart: number
  selectionEnd: number
}
interface Cd {
  getData(string):string
}

let editorElement = <HTMLInputElement>document.getElementById('editor');
// Observable.fromEvent(editorElement, 'select').subscribe(e => console.log(e))
// Observable.fromEvent(editorElement, 'click').subscribe(e => console.log(e))
// Observable.fromEvent(editorElement, 'focus').subscribe(e => console.log(e))
// Stream of requestAnimationFrame ticks
const animationFrame = Observable.interval(0, Scheduler.animationFrame);

var keyDowns = Observable
  .fromEvent(document, 'keydown')
  .map((e: KeyboardEvent) => {
    e.preventDefault();
    return e;
  });

var keyUps = Observable
  .fromEvent(document, 'keyup')
  .map((e: KeyboardEvent) => {
    e.preventDefault();
    return e;
  });

var keyPresses = keyDowns
  .merge(keyUps)
  .groupBy((e: KeyboardEvent) => e.keyCode)
  .map(group => {
    return group.distinctUntilChanged((x: KeyboardEvent, y: KeyboardEvent) => x.type !== y.type)
  })
  .mergeAll()

keyPresses.subscribe(e => console.log(e))
let positionSelection = animationFrame
  .map(() => p2s(<G>({target: editorElement})))
  .distinctUntilChanged((x, y) => x.pos === y.pos && x.selection === y.selection);

positionSelection.subscribe(e => console.log(e))

let charInputsStream = keyPresses
  .withLatestFrom(positionSelection, (e: KeyboardEvent, p: PosSelect) => {
    return {e: e, pos: p.pos, selection: p.selection};
  });

// charInputsStream.subscribe(e => console.log(e))

let cutStream = Observable.fromEvent(editorElement, 'cut');
let pasteStream = Observable.fromEvent(editorElement, 'paste');

let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '')

let database = crdt.text.createFromOrderer(crdt.order.createVectorClock2(uuid()));

// this subject queues as necessary to ensure every message is delivered
const publish = new QueueingSubject()

// this method returns an object which contains two observables
const { messages, connectionStatus } = websocketConnect(WebSocketURL, publish)

connectionStatus.subscribe(e => console.log({status: e}));

const BACKSPACE = 8;
const DELETE = 46;
const ENTER = 13;

type PosSelect = {pos: number, selection: number}
type KData = {e: KeyboardEvent, pos: number, selection: number}

function p2s(e: G): PosSelect {
  const pos = e.target.selectionStart;
  const selection = e.target.selectionEnd - pos;

  return {pos, selection}
}

const chars = charInputsStream
  .filter(({e}: KData) => {
    return e.key.length === 1;
  })
  .map(({e, pos, selection}: KData) => {
    return selection
      ? Observable.from([
        new crdt.text.Delete(pos, selection),
        new crdt.text.Insert(pos, e.key),
      ])
      : Observable.from([
        new crdt.text.Insert(pos, e.key),
      ]);
  })
  .concatAll();

const backspaceKey = charInputsStream.filter(({e}: KData) => e.keyCode === BACKSPACE).map(({pos, selection}:KData) => {
  return selection
    ? new crdt.text.Delete(pos, selection)
    : new crdt.text.Delete(pos-1, 1);
});

const deleteKey = charInputsStream.filter(({e}: KData) => e.keyCode === DELETE).map(({pos, selection}: KData) => {
  return selection
    ? new crdt.text.Delete(pos, selection)
    : new crdt.text.Delete(pos, 1);
});

const enterKey = charInputsStream.filter(({e}: KData) => e.keyCode === ENTER).map(({pos, selection}: KData) => {
  return selection
    ? Observable.from([
      new crdt.text.Delete(pos, selection),
      new crdt.text.Insert(pos, "\n"),
    ])
    : Observable.from([
      new crdt.text.Insert(pos, "\n"),
    ]);
}).concatAll();

const cutOp = cutStream.map((e: Ev) => {
  const {pos, selection} = p2s(e);
  return selection
    ? Observable.of(new crdt.text.Delete(pos, selection))
    : Observable.never()
}).concatAll();

const pasteOp = pasteStream.map((e: Ev) => {
  const {pos, selection} = p2s(e)
  return selection
    ? Observable.from([
      new crdt.text.Delete(pos, selection),
      new crdt.text.Insert(pos, e.clipboardData.getData('text/plain'))
    ])
    : Observable.from([
      new crdt.text.Insert(pos, e.clipboardData.getData('text/plain'))
    ])
}).concatAll();

chars
  .merge(backspaceKey)
  .merge(deleteKey)
  .merge(enterKey)
  .merge(cutOp)
  .merge(pasteOp)
  .subscribe((op) => {
    database = database.next();
    database.apply(op);

    const s = op instanceof crdt.text.Insert
      ? (op.at + op.value.length)
      : (op instanceof crdt.text.Delete
        ? (op.at)
        : 0);

    editorElement.value = renderer(database);
    editorElement.setSelectionRange(s,s);

    const data = serialise(database);
    publish.next(data);
  })
;

messages
  .map(bench('ws-deserialise', deserialise))
  .bufferTime(100)
  .subscribe(es => {
    es.map((e) => {
      database = database.next();
      database = database.merge(e);
      onFrame(render, setCursorOnUpdate)(e);
    });
  })
;

function renderer(text) {
  return crdt.text.renderString(text);
}

function onFrame(f1, f2) {
  return (arg) => {
    const start = editorElement.selectionStart;
    const end = editorElement.selectionEnd;
    const shiftBy = f2(arg, start, end);
    // editorElement.setSelectionRange(start, end);
    requestAnimationFrame(() => {
      f1(arg);
      editorElement.setSelectionRange(start + shiftBy, end + shiftBy);
    });
  };
}

function setCursorOnKey(e, start, end) {
  return bench('cursor-key-calculate', () => {
    return shiftCursorPositionRelativeTo(e, start);
  })();
}

function setCursorOnUpdate(e, start, end) {
  return bench('cursor-up-calculate', () => {
    return shiftCursorPositionRelativeTo(e, start, -1);
  })();
}

function render() {
  const string = bench('render-string', () => {
    return renderer(database);
  })();

  bench('render-set', () => editorElement.value = string)();
}

