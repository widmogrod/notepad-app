import crdt from 'js-crdt';
import {OrderedOperations} from 'js-crdt/build/text';

type SerialisedOrder = Object
type SerialisedText = {operations: Array<any>, order: SerialisedOrder}

export function serialiseOperations(oo: OrderedOperations): SerialisedText {
    return oo.operations.reduce((result, operation) => {
      let value = operation instanceof crdt.text.Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);

      return result;
    }, {
      operations: [],
      order: serialiseOrder(oo.order),
    });
}

function serialiseOrder(order) {
  if (order instanceof crdt.order.VectorClock) {
    function serialiseId(id) {
      return {
        node: id.node,
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
    case 'v2':
      const set = new crdt.structures.SortedSetArray(new crdt.structures.NaiveArrayList([]));

      return new crdt.order.VectorClock(
        new crdt.order.Id(id.node, id.version),
        vector.reduce((set, id) => {
          return set.add(new crdt.order.Id(id.node, id.version)).result
        }, set)
      );
  }
}

export function deserialiseOperations({order, operations}): OrderedOperations {
  const {t, id, vector} = order;

  return {
    order: deserialiesOrder(t, id, vector),
    operations: operations.reduce((operations, {type, args}) => {
      const operation = (type === 'insert')
        ? new crdt.text.Insert(args[0], args[1])
        : new crdt.text.Delete(args[0], args[1]);

      operations.push(operation);
      return operations;
    }, []),
  };
}
