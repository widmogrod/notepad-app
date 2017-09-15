"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_crdt_1 = require("js-crdt");
function serialiseOperations(oo) {
    return oo.operations.reduce((result, operation) => {
        let value = operation instanceof js_crdt_1.default.text.Insert
            ? { type: 'insert', args: [operation.at, operation.value] }
            : { type: 'delete', args: [operation.at, operation.length] };
        result.operations.push(value);
        return result;
    }, {
        operations: [],
        order: serialiseOrder(oo.order),
    });
}
exports.serialiseOperations = serialiseOperations;
function serialiseOrder(order) {
    if (order instanceof js_crdt_1.default.order.VectorClock) {
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
        case 'v2':
            const set = new js_crdt_1.default.structures.SortedSetArray(new js_crdt_1.default.structures.NaiveArrayList([]));
            return new js_crdt_1.default.order.VectorClock(new js_crdt_1.default.order.Id(id.node, id.version), vector.reduce((set, id) => {
                return set.add(new js_crdt_1.default.order.Id(id.node, id.version)).result;
            }, set));
    }
}
function deserialiseOperations({ order, operations }) {
    const { t, id, vector } = order;
    return {
        order: deserialiesOrder(t, id, vector),
        operations: operations.reduce((operations, { type, args }) => {
            const operation = (type === 'insert')
                ? new js_crdt_1.default.text.Insert(args[0], args[1])
                : new js_crdt_1.default.text.Delete(args[0], args[1]);
            operations.push(operation);
            return operations;
        }, []),
    };
}
exports.deserialiseOperations = deserialiseOperations;
