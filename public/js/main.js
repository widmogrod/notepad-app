'use strict';

function bench(name, func, ctx) {
  return function() {
    const start = new Date();
    const result = func.apply(ctx, arguments);
    const end = new Date();

    console.log({name, time: end.getTime() - start.getTime()});

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

function shiftCursorPositionRelativeTo(text, position, diff) {
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

function serialise(text) {
  // console.log({
  //   order: text.order.toString(),
  //   id: text.order.id.toString(),
  //   changes: text.setMap.get(text.order)
  // });
  const operations = text.setMap.get(text.order)
    .reduce((result, operation) => {
      let value = operation instanceof crdt.text.Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);

      return result;
    }, {
      operations: [],
      order: serialiseOrder(text.order),
    });

  return JSON.stringify(operations);
}

function create(id) {
  // return new crdt.order.VectorClock(id, {});
  const set1 = new crdt.structures.SortedSetArray(new crdt.structures.NaiveArrayList([]));
  return new crdt.order.VectorClock2(
    new crdt.order.Id(id, 0),
    set1
  );
}

function serialiseOrder(order) {
  if (order instanceof crdt.order.VectorClock) {
    return {
      t: 'v1',
      id: order.id,
      vector: order.vector,
    }
  } else if (order instanceof crdt.order.VectorClock2) {
    function serialiseId(id) {
      return {
        key: id.key,
        version: id.version,
      }
    }

    return {
      t: 'v2',
      id: serialiseId(order.id),
      vector: order.vector.reduce((r, item) => {
        r.push(serialiseId(item))
        return r;
      }, []),
    }
  }
}

function deserialiesOrder(t, id, vector) {
  switch(t) {
    case 'v1':
      return new crdt.order.VectorClock(id, vector);
    case 'v2':
      const set = new crdt.structures.SortedSetArray(new crdt.structures.NaiveArrayList([]));

      return new crdt.order.VectorClock2(
        new crdt.order.Id(id.key, id.version),
        vector.reduce((set, id) => {
          return set.add(new crdt.order.Id(id.key, id.version)).result
        }, set)
      );
  }
}

function deserialise(string) {
  const {order, operations} = JSON.parse(string);
  const {t, id, vector} = order;

  return operations.reduce((text, {type, args}) => {
    const operation = (type === 'insert')
      ? new crdt.text.Insert(args[0], args[1])
      : new crdt.text.Delete(args[0], args[1]);

    text.apply(operation)
    return text
  }, crdt.text.createFromOrderer(deserialiesOrder(t, id, vector)));
}

let editorElement = document.getElementById('editor');
let keyup = new jef.stream(function(onValue){
  editorElement.addEventListener('keydown', e => { onValue(e);});
  editorElement.addEventListener('keyup', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('keypress', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('paste', e => {e.preventDefault(); onValue(e);});
  editorElement.addEventListener('cut', e => {e.preventDefault(); onValue(e);});
});

let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

let messages = new jef.stream.Push();
let publish = new jef.stream.Push();
let online = new jef.stream.Push();

let database = crdt.text.createFromOrderer(create(uuid()));

const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '')

function connect(online, messages) {
  const ws = new WebSocket(WebSocketURL);
  ws.onmessage = (e) => messages.push(e);
  ws.onopen = (e) => online.push({online: true, ws});
  ws.onclose = (e) => online.push({online: false});
}

connect(online, messages);

function bufferUntil(streamA, streamB) {
  var buffer = [];
  var buffering = true;
  return new jef.stream(function (sinkValue, sinkError, sinkComplete) {
    streamB.on(function (value) {
      if (value) {
        buffering = true;
      } else {
        buffering = false;
        const copy = buffer.splice(0);
        buffer = [];
        copy.forEach(sinkValue)
      }
    }, sinkError, sinkComplete);

    streamA.on(function (value) {
      if (buffering) {
        buffer.push(value);
      } else {
        sinkValue(value);
      }

    }, sinkError, sinkComplete);
  });
}

const connected = online.filter(({online}) => online).log('connected').pluck('ws')
const disconnected = online.filter(({online}) => !online).log('offline - reconnecting').timeout(5000).on(_ => connect(online, messages))

const operations = bufferUntil(
  publish,
  online.map(({online}) => !online)
)

jef.stream.when([
  connected,
  operations,
]).on(([ws, data]) => ws.send(data));

const BACKSPACE = 8;
const DELETE = 46;
const ENTER = 13;

keyup
  .filter(e => {
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
  .map(e => {
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
  .flatMap(({key, code, pos, selection}) => {
    if (code === ENTER) {
      key = '\n';
    }

    if (code === 'cut') {
      return jef.stream.fromValue(
        new crdt.text.Delete(pos, selection)
      );
    }

    if (code === BACKSPACE) {
      return jef.stream.fromValue(
        selection
        ? new crdt.text.Delete(pos, selection)
        : new crdt.text.Delete(Math.max(0, pos-1), 1)
      );
    }

    if (code === DELETE) {
      return jef.stream.fromValue(
        selection
        ? new crdt.text.Delete(pos, selection)
        : new crdt.text.Delete(pos, 1)
      );
    }

    if (selection) {
      return jef.stream.fromArray([
        new crdt.text.Delete(pos, selection),
        new crdt.text.Insert(pos, key),
      ]);
    }

    return jef.stream.fromValue(new crdt.text.Insert(pos, key))
  })
  // .on((op) => {
  //   console.log({op});
  //   database = bench('key-snapshot', snapshot)(database);
  // })
  // .on(op => bench('key-apply', database.apply, database)(op))
  .on(onFrame(render, (op, start, end) => setCursorOnKey([[op]], start, end)))
// .timeout(300) // here is issue with empty sends
  .on((op) => {
    // const a = database.order;
    // database = database.next();
    // const b = database.order;
    //
    // console.log({
    //   a: a.toString(),
    //   b: b.toString(),
    //   cmp: a.compare(b),
    // })

    database = database.next();
    database.apply(op);
    const data = serialise(database);
    // const data = bench('key-serialise', serialise)(database);
    publish.push(data);
  })
;

messages
  .map(e => e.data)
  .map(bench('ws-deserialise', deserialise))
  .on(e => {
    database = database.next();
    database = database.merge(e);
    // database = database.next();
    // database = bench('ws-merge', database.merge, database)(e);
  })
  .debounce(10)
  .on(onFrame(render, setCursorOnUpdate))
;

function renderer(text) {
  return crdt.text.renderString(text);
}

function onFrame(f1, f2) {
  return (arg) => {
    requestAnimationFrame(() => {
      const
      start = editorElement.selectionStart,
        end = editorElement.selectionEnd;

      const shiftBy = f2(arg, start, end);
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
