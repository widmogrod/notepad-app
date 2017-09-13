"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
const Rx_1 = require("rxjs/Rx");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
const serialiser_1 = require("./serialiser");
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
let editorElement = document.getElementById('editor');
// Observable.fromEvent(editorElement, 'select').subscribe(e => console.log(e))
// Observable.fromEvent(editorElement, 'click').subscribe(e => console.log(e))
// Observable.fromEvent(editorElement, 'focus').subscribe(e => console.log(e))
// Stream of requestAnimationFrame ticks
const animationFrame = Rx_1.Observable.interval(0, Rx_1.Scheduler.animationFrame);
var keyDowns = Rx_1.Observable
    .fromEvent(document, 'keydown')
    .map((e) => {
    e.preventDefault();
    return e;
});
var keyUps = Rx_1.Observable
    .fromEvent(document, 'keyup')
    .map((e) => {
    e.preventDefault();
    return e;
});
var keyPresses = keyDowns
    .merge(keyUps)
    .groupBy((e) => e.keyCode)
    .map(group => {
    return group.distinctUntilChanged((x, y) => x.type !== y.type);
})
    .mergeAll();
keyPresses.subscribe(e => console.log(e));
let positionSelection = animationFrame
    .map(() => p2s(({ target: editorElement })))
    .distinctUntilChanged((x, y) => x.pos === y.pos && x.selection === y.selection);
positionSelection.subscribe(e => console.log(e));
let charInputsStream = keyPresses
    .withLatestFrom(positionSelection, (e, p) => {
    return { e: e, pos: p.pos, selection: p.selection };
});
// charInputsStream.subscribe(e => console.log(e))
let cutStream = Rx_1.Observable.fromEvent(editorElement, 'cut');
let pasteStream = Rx_1.Observable.fromEvent(editorElement, 'paste');
let host = window.document.location.host.replace(/:.*/, '');
let port = window.document.location.port;
let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';
const WebSocketURL = protocol + '://' + host + (port ? (':' + port) : '');
let database = js_crdt_1.default.text.createFromOrderer(js_crdt_1.default.order.createVectorClock2(uuid()));
// this subject queues as necessary to ensure every message is delivered
const publish = new queueing_subject_1.QueueingSubject();
// this method returns an object which contains two observables
const { messages, connectionStatus } = rxjs_websockets_1.default(WebSocketURL, publish);
connectionStatus.subscribe(e => console.log({ status: e }));
const BACKSPACE = 8;
const DELETE = 46;
const ENTER = 13;
function p2s(e) {
    const pos = e.target.selectionStart;
    const selection = e.target.selectionEnd - pos;
    return { pos, selection };
}
const chars = charInputsStream
    .filter(({ e }) => {
    return e.key.length === 1;
})
    .map(({ e, pos, selection }) => {
    return selection
        ? Rx_1.Observable.from([
            new js_crdt_1.default.text.Delete(pos, selection),
            new js_crdt_1.default.text.Insert(pos, e.key),
        ])
        : Rx_1.Observable.from([
            new js_crdt_1.default.text.Insert(pos, e.key),
        ]);
})
    .concatAll();
const backspaceKey = charInputsStream.filter(({ e }) => e.keyCode === BACKSPACE).map(({ pos, selection }) => {
    return selection
        ? new js_crdt_1.default.text.Delete(pos, selection)
        : new js_crdt_1.default.text.Delete(pos - 1, 1);
});
const deleteKey = charInputsStream.filter(({ e }) => e.keyCode === DELETE).map(({ pos, selection }) => {
    return selection
        ? new js_crdt_1.default.text.Delete(pos, selection)
        : new js_crdt_1.default.text.Delete(pos, 1);
});
const enterKey = charInputsStream.filter(({ e }) => e.keyCode === ENTER).map(({ pos, selection }) => {
    return selection
        ? Rx_1.Observable.from([
            new js_crdt_1.default.text.Delete(pos, selection),
            new js_crdt_1.default.text.Insert(pos, "\n"),
        ])
        : Rx_1.Observable.from([
            new js_crdt_1.default.text.Insert(pos, "\n"),
        ]);
}).concatAll();
const cutOp = cutStream.map((e) => {
    const { pos, selection } = p2s(e);
    return selection
        ? Rx_1.Observable.of(new js_crdt_1.default.text.Delete(pos, selection))
        : Rx_1.Observable.never();
}).concatAll();
const pasteOp = pasteStream.map((e) => {
    const { pos, selection } = p2s(e);
    return selection
        ? Rx_1.Observable.from([
            new js_crdt_1.default.text.Delete(pos, selection),
            new js_crdt_1.default.text.Insert(pos, e.clipboardData.getData('text/plain'))
        ])
        : Rx_1.Observable.from([
            new js_crdt_1.default.text.Insert(pos, e.clipboardData.getData('text/plain'))
        ]);
}).concatAll();
chars
    .merge(backspaceKey)
    .merge(deleteKey)
    .merge(enterKey)
    .merge(cutOp)
    .merge(pasteOp)
    .subscribe((op) => {
    console.log(op);
    database = database.next();
    database.apply(op);
    const s = op instanceof js_crdt_1.default.text.Insert
        ? (op.at + op.value.length)
        : (op instanceof js_crdt_1.default.text.Delete
            ? (op.at)
            : 0);
    editorElement.value = renderer(database);
    console.log({ selection: s });
    editorElement.setSelectionRange(s, s);
    const data = serialiser_1.serialise(database);
    publish.next(data);
});
messages
    .map(bench('ws-deserialise', serialiser_1.deserialise))
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
