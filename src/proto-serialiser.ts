import * as pb from './protobuf/events';
import {VectorClock, Orderer, Id, VectorSortedSet} from 'js-crdt/build/order';
import {OrderedOperations, Operation, Insert, Delete, Selection} from 'js-crdt/build/text';
import {SortedSetArray, NaiveArrayList} from 'js-crdt/build/structures';
import {Event, TextChangedEvent, ChangesFromEvent} from './events';

export function serialise(e: Event): Uint8Array {
  return pb.Event.encode(serialiseEvent(e)).finish();
}

export function serialiseEvent(e: Event): pb.Event {
  if (e instanceof TextChangedEvent) {
    return new pb.Event({
      textChanged: serialiseTextChangedEvent(e),
    });
  }

  if (e instanceof ChangesFromEvent) {
    return new pb.Event({
      changesFrom: serialiseChangesFromEvent(e),
    });
  }
}

export function serialiseTextChangedEvent(e: TextChangedEvent): pb.TextChangedEvent {
  return new pb.TextChangedEvent({
    orderedOperations: serialiseOperations(e.orderedOperations),
  });
}

export function serialiseChangesFromEvent(e: ChangesFromEvent): pb.ChangesFromEvent {
  return new pb.ChangesFromEvent({
    from: serialiseOrderer(e.from),
  });
}

export function serialiseOrderer(e: Orderer<any>): pb.Order {
  if (e instanceof VectorClock) {
    return new pb.Order({
      vectorClock: serialiseVectorClock(e),
    })
  }
}

export function serialiseOperations(oo: OrderedOperations): pb.OrderedOperations {
  return new pb.OrderedOperations({
    order: serialiseOrderer(oo.order),
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

export function deserialise(data: Uint8Array): Event {
  // TODO add validation
  const e = pb.Event.decode(data)
  if (e.textChanged) {
    return deserialiseTextChanged(e.textChanged);
  }
  if (e.changesFrom) {
    return deserialiseChangesFrom(e.changesFrom);
  }

  return null;
}

export function deserialiseTextChanged(tch: pb.ITextChangedEvent): TextChangedEvent {
  return new TextChangedEvent(
    deserialiseOperations(tch.orderedOperations),
  );
}

export function deserialiseChangesFrom(ch: pb.IChangesFromEvent): ChangesFromEvent {
  return new ChangesFromEvent(
    deserialiesOrder(ch.from),
  );
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
