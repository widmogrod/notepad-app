"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pb = require("./protobuf/events");
const order_1 = require("js-crdt/build/order");
const text_1 = require("js-crdt/build/text");
const structures_1 = require("js-crdt/build/structures");
function serialiseOperations(oo) {
    return new pb.OrderedOperations({
        order: new pb.Order({
            vectorClock: serialiseVectorClock(oo.order),
        }),
        operations: serialiseOperationsList(oo.operations),
    });
}
exports.serialiseOperations = serialiseOperations;
function push(fn) {
    return (list, v) => {
        list.push(fn(v));
        return list;
    };
}
function serialiseVectorClock(order) {
    if (order instanceof order_1.VectorClock) {
        return new pb.VectorClock({
            id: serialiseVersion(order.id),
            vector: order.vector.reduce(push(serialiseVersion), []),
        });
    }
    return null;
}
function serialiseVersion(version) {
    return new pb.Id({
        node: version.node,
        version: version.version,
    });
}
function serialiseOperationsList(ops) {
    return ops.reduce(push(serialiseOperation), []);
}
function serialiseOperation(op) {
    if (op instanceof text_1.Selection) {
        return new pb.Selection({
            origin: op.origin,
            at: op.at,
            length: op.length,
        });
    }
    if (op instanceof text_1.Insert) {
        return new pb.Insert({
            at: op.at,
            value: op.value,
        });
    }
    return new pb.Delete({
        at: op.at,
        length: op.length,
    });
}
function deserialiseOperations(oo) {
    return {
        order: deserialiesOrder(oo.order),
        operations: deserialiesOperationsList(oo.operations),
    };
}
exports.deserialiseOperations = deserialiseOperations;
function deserialiesOrder(o) {
    if (o.vectorClock) {
        return deserialiseVectorClock(o.vectorClock);
    }
    return null;
}
exports.deserialiesOrder = deserialiesOrder;
function deserialiseVectorClock(vc) {
    return new order_1.VectorClock(deserialiseId(vc.id), deserialiseVector(vc.vector));
}
exports.deserialiseVectorClock = deserialiseVectorClock;
function deserialiseId(id) {
    return new order_1.Id(id.node, id.version);
}
exports.deserialiseId = deserialiseId;
function deserialiseVector(v) {
    const set = new structures_1.SortedSetArray(new structures_1.NaiveArrayList([]));
    return v.reduce((set, id) => {
        return set.add(deserialiseId(id)).result;
    }, set);
}
exports.deserialiseVector = deserialiseVector;
function deserialiesOperationsList(ops) {
    return ops.reduce(push(deserialiseOperation), []);
}
exports.deserialiesOperationsList = deserialiesOperationsList;
function deserialiseOperation(op) {
    if (op.selection) {
        return new text_1.Selection(op.selection.origin, op.selection.at, op.selection.length);
    }
    if (op.insert) {
        return new text_1.Insert(op.insert.at, op.insert.value);
    }
    return new text_1.Delete(op.delete.at, op.delete.length);
}
exports.deserialiseOperation = deserialiseOperation;
