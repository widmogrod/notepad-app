"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
const Rx_1 = require("rxjs/Rx");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
function bench(name, func, ctx) {
    return function () {
        const start = new Date();
        const result = func.apply(ctx, arguments);
        const end = new Date();
        // console.log({name, time: end.getTime() - start.getTime()});
        return result;
    };
}
function uuid() {
    const array = new Uint8Array(2);
    crypto.getRandomValues(array);
    return array.join('-');
}
function snapshot(text) {
    return text.next();
}
function shiftCursorPositionRelativeTo(text, position, diff) {
    diff = diff | 0;
    return text.reduce(({ shiftBy, position }, operations) => {
        return operations.reduce(({ shiftBy, position }, operation) => {
            if (operation instanceof js_crdt_1.default.text.Insert) {
                if (operation.at <= (position + diff)) {
                    shiftBy += operation.value.length;
                    position += operation.value.length;
                }
            }
            else if (operation instanceof js_crdt_1.default.text.Delete) {
                if (operation.at < position) {
                    shiftBy -= operation.length;
                }
            }
            return { shiftBy, position };
        }, { shiftBy, position });
    }, { shiftBy: 0, position }).shiftBy;
}
function serialise(text) {
    const operations = text.setMap.get(text.order)
        .reduce((result, operation) => {
        let value = operation instanceof js_crdt_1.default.text.Insert
            ? { type: 'insert', args: [operation.at, operation.value] }
            : { type: 'delete', args: [operation.at, operation.length] };
        result.operations.push(value);
        return result;
    }, {
        operations: [],
        order: serialiseOrder(text.order),
    });
    return operations;
}
function create(id) {
    // return new crdt.order.VectorClock(id, {});
    const set1 = new js_crdt_1.default.structures.SortedSetArray(new js_crdt_1.default.structures.NaiveArrayList([]));
    return new js_crdt_1.default.order.VectorClock2(new js_crdt_1.default.order.Id(id, 0), set1);
}
function serialiseOrder(order) {
    if (order instanceof js_crdt_1.default.order.VectorClock) {
        return {
            t: 'v1',
            id: order.id,
            vector: order.vector,
        };
    }
    else if (order instanceof js_crdt_1.default.order.VectorClock2) {
        function serialiseId(id) {
            return {
                node: id.node,
                version: id.version,
            };
        }
        return {
            t: 'v2',
            id: serialiseId(order.id),
            vector: order.vector.reduce((r, item) => {
                r.push(serialiseId(item));
                return r;
            }, []),
        };
    }
}
function deserialiesOrder(t, id, vector) {
    switch (t) {
        case 'v1':
            return new js_crdt_1.default.order.VectorClock(id, vector);
        case 'v2':
            const set = new js_crdt_1.default.structures.SortedSetArray(new js_crdt_1.default.structures.NaiveArrayList([]));
            return new js_crdt_1.default.order.VectorClock2(new js_crdt_1.default.order.Id(id.node, id.version), vector.reduce((set, id) => {
                return set.add(new js_crdt_1.default.order.Id(id.node, id.version)).result;
            }, set));
    }
}
function deserialise({ order, operations }) {
    const { t, id, vector } = order;
    return operations.reduce((text, { type, args }) => {
        const operation = (type === 'insert')
            ? new js_crdt_1.default.text.Insert(args[0], args[1])
            : new js_crdt_1.default.text.Delete(args[0], args[1]);
        text.apply(operation);
        return text;
    }, js_crdt_1.default.text.createFromOrderer(deserialiesOrder(t, id, vector)));
}
let editorElement = document.getElementById('editor');
let keyup = Rx_1.Observable.create(observer => {
    editorElement.addEventListener('keydown', e => { observer.next(e); });
    editorElement.addEventListener('keyup', e => { e.preventDefault(); observer.next(e); });
    editorElement.addEventListener('keypress', e => { e.preventDefault(); observer.next(e); });
    editorElement.addEventListener('paste', e => { e.preventDefault(); observer.next(e); });
    editorElement.addEventListener('cut', e => { e.preventDefault(); observer.next(e); });
});
let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';
const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '');
let database = js_crdt_1.default.text.createFromOrderer(create(uuid()));
// this subject queues as necessary to ensure every message is delivered
const publish = new queueing_subject_1.QueueingSubject();
// this method returns an object which contains two observables
const { messages, connectionStatus } = rxjs_websockets_1.default(WebSocketURL, publish);
connectionStatus.subscribe(e => console.log({ status: e }));
const BACKSPACE = 8;
const DELETE = 46;
const ENTER = 13;
keyup
    .filter((e) => {
    switch (e.type) {
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
    .map((e) => {
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
    .concatMap(({ key, code, pos, selection }) => {
    if (code === ENTER) {
        key = '\n';
    }
    if (code === 'cut') {
        return Rx_1.Observable.from([
            new js_crdt_1.default.text.Delete(pos, selection)
        ]);
    }
    if (code === BACKSPACE) {
        return Rx_1.Observable.from([
            selection
                ? new js_crdt_1.default.text.Delete(pos, selection)
                : new js_crdt_1.default.text.Delete(Math.max(0, pos - 1), 1)
        ]);
    }
    if (code === DELETE) {
        return Rx_1.Observable.from([
            selection
                ? new js_crdt_1.default.text.Delete(pos, selection)
                : new js_crdt_1.default.text.Delete(pos, 1)
        ]);
    }
    if (selection) {
        return Rx_1.Observable.from([
            new js_crdt_1.default.text.Delete(pos, selection),
            new js_crdt_1.default.text.Insert(pos, key),
        ]);
    }
    return Rx_1.Observable.from([
        new js_crdt_1.default.text.Insert(pos, key),
    ]);
})
    .subscribe((op) => {
    onFrame(render, (op, start, end) => setCursorOnKey([[op]], start, end))(op);
    database = database.next();
    database.apply(op);
    const data = serialise(database);
    publish.next(data);
});
messages
    .map(bench('ws-deserialise', deserialise))
    .bufferTime(100)
    .subscribe(es => {
    es.map((e) => {
        database = database.next();
        database = database.merge(e);
        onFrame(render, setCursorOnUpdate)(e);
    });
});
function renderer(text) {
    return js_crdt_1.default.text.renderString(text);
}
function onFrame(f1, f2) {
    return (arg) => {
        const start = editorElement.selectionStart, end = editorElement.selectionEnd;
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
    onUndo() { }
    onRedo() { }
    onDelete() { }
    onInsert() { }
    onSelect() { }
}
