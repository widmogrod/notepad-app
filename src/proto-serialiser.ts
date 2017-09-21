import * as pb from './protobuf/events';
import {VectorClock, Orderer, Id, VectorSortedSet} from 'js-crdt/build/order';
import {OrderedOperations, Operation, Insert, Delete, Selection} from 'js-crdt/build/text';
import {SortedSetArray, NaiveArrayList} from 'js-crdt/build/structures';

export function serialiseOperations(oo: OrderedOperations): pb.OrderedOperations {
  return new pb.OrderedOperations({
    order: new pb.Order({
      vectorClock: serialiseVectorClock(oo.order),
    }),
    operations: serialiseOperationsList(oo.operations),
  });
}

function push<T,R>(fn: (b: R) => T): (list: T[], v: R) => T[] {
  return (list: T[], v: R): T[] => {
    list.push(fn(v));
    return list;
  };
}

function serialiseVectorClock(order: Orderer<any>): pb.VectorClock {
  if (order instanceof VectorClock) {
    return new pb.VectorClock({
      id: serialiseVersion(order.id),
      vector: order.vector.reduce(push(serialiseVersion), []),
    });
  }

  return null;
}

function serialiseVersion(version: Id) : pb.Id {
  return new pb.Id({
    node: version.node,
    version: version.version,
  });
}

function serialiseOperationsList(ops: Operation[]): pb.Operation[] {
  return ops.reduce(push(serialiseOperation), []);
}

function serialiseOperation(op: Operation): pb.Operation {
  if (op instanceof Selection) {
    return new pb.Operation({
      selection: new pb.Selection({
        origin: op.origin,
        at: op.at,
        length: op.length,
      }),
    });
  }

  if (op instanceof Insert) {
    return new pb.Operation({
      insert: new pb.Insert({
        at: op.at,
        value: op.value,
      }),
    });
  }

  return new pb.Operation({
    'delete': new pb.Delete({
      at: op.at,
      length: op.length,
    }),
  });
}

export function deserialiseOperations(oo: pb.IOrderedOperations): OrderedOperations {
  return {
    order: deserialiesOrder(oo.order),
    operations: deserialiesOperationsList(oo.operations),
  };
}

export function deserialiesOrder(o: pb.IOrder): Orderer<any> {
  if (o.vectorClock) {
    return deserialiseVectorClock(o.vectorClock);
  }

  return null;
}

export function deserialiseVectorClock(vc: pb.IVectorClock): VectorClock {
  return new VectorClock(
    deserialiseId(vc.id),
    deserialiseVector(vc.vector),
  );
}

export function deserialiseId(id: pb.IId): Id {
  return new Id(
    id.node,
    id.version,
  );
}

export function deserialiseVector(v: pb.IId[]): VectorSortedSet<Id> {
  const set = new SortedSetArray(new NaiveArrayList([]));

  return v.reduce((set, id) => {
    return set.add(deserialiseId(id)).result
  }, set)
}

export function deserialiesOperationsList(ops: pb.IOperation[]): Operation[] {
  return ops.reduce(push(deserialiseOperation), []);
}

export function deserialiseOperation(op: pb.IOperation): Operation {
  if (op.selection) {
    return new Selection(
      op.selection.origin,
      op.selection.at,
      op.selection.length,
    );
  }

  if (op.insert) {
    return new Insert(
      op.insert.at,
      op.insert.value,
    );
  }

  return new Delete(
    op.delete.at,
    op.delete.length,
  );
}
