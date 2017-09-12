import crdt from 'js-crdt';
import {Observable} from 'rxjs/Rx';
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

function snapshot(text) {
  return text.next();
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

interface Ev extends HTMLElement {
  preventDefault()
  type: string
  code: number
  key: string
  keyCode: number
  target: T
  clipboardData: Cd
}

interface T {
  selectionStart: number
  selectionEnd: number
}
interface Cd {
  getData(string):string
}

let editorElement = <HTMLInputElement>document.getElementById('editor');
let keyup = Observable.create(observer => {
  editorElement.addEventListener('keydown', e => { observer.next(e);});
  editorElement.addEventListener('keyup', e => {e.preventDefault(); observer.next(e);});
  editorElement.addEventListener('keypress', e => {e.preventDefault(); observer.next(e);});
  editorElement.addEventListener('paste', e => {e.preventDefault(); observer.next(e);});
  editorElement.addEventListener('cut', e => {e.preventDefault(); observer.next(e);});
});

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

keyup
  .filter((e: Ev) => {
    switch(e.type) {
      case 'keydown':
        return e.keyCode === BACKSPACE || e.keyCode === DELETE;
      case 'keypress':
        return true;
      case 'cut':
      case 'paste':
        return true;
      default:
        return false;
    }
  })
  .map((e: Ev) => {
    const selection = e.target.selectionEnd - e.target.selectionStart;
    const pos = e.target.selectionStart;

    // HACK: reset selection when keypress was made
    // without it selection do not disaperes
    // and this makes situations like
    // insert removes selected block all the time
    editorElement.setSelectionRange(pos, pos);

    return {
      key: (e.type === 'paste') ? e.clipboardData.getData('text/plain') : e.key,
      code: e.keyCode || e.type,
      pos,
      selection,
    };
  })
  .concatMap(({key, code, pos, selection}) => {
    if (code === ENTER) {
      key = '\n';
    }

    if (code === 'cut') {
      return Observable.from([
        new crdt.text.Delete(pos, selection)
      ]);
    }

    if (code === BACKSPACE) {
      return Observable.from([
        selection
        ? new crdt.text.Delete(pos, selection)
        : new crdt.text.Delete(Math.max(0, pos-1), 1)
      ]);
    }

    if (code === DELETE) {
      return Observable.from([
        selection
        ? new crdt.text.Delete(pos, selection)
        : new crdt.text.Delete(pos, 1)
      ]);
    }

    if (selection) {
      return Observable.from([
        new crdt.text.Delete(pos, selection),
        new crdt.text.Insert(pos, key),
      ]);
    }

    return Observable.from([
      new crdt.text.Insert(pos, key),
    ]);
  })
  .subscribe((op) => {
    onFrame(render, (op, start, end) => setCursorOnKey([[op]], start, end))(op)

    database = database.next();
    database.apply(op);

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
    const
    start = editorElement.selectionStart,
      end = editorElement.selectionEnd;

    const shiftBy = f2(arg, start, end);
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

// type Operation = Insert | Delete;

class Editor {
  onUndo() {}
  onRedo() {}
  onDelete() {}
  onInsert() {}
  onSelect() {}
}

