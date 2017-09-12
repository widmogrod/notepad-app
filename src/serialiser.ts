import crdt from 'js-crdt';

type SerialisedOrder = Object
type SerialisedText = {operations: Array<any>, order: SerialisedOrder}

export function serialiseOperations(order, operations) {
    return operations.reduce((result, operation) => {
      let value = operation instanceof crdt.text.Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);

      return result;
    }, {
      operations: [],
      order: serialiseOrder(order),
    });
}

export function serialise(text): SerialisedText {
  const operations = text.setMap.get(text.order)
  return serialiseOperations(text.order, operations);
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
    case 'v1':
      return new crdt.order.VectorClock(id, vector);
    case 'v2':
      const set = new crdt.structures.SortedSetArray(new crdt.structures.NaiveArrayList([]));

      return new crdt.order.VectorClock2(
        new crdt.order.Id(id.node, id.version),
        vector.reduce((set, id) => {
          return set.add(new crdt.order.Id(id.node, id.version)).result
        }, set)
      );
  }
}

export function deserialise({order, operations}) {
  const {t, id, vector} = order;

  return operations.reduce((text, {type, args}) => {
    const operation = (type === 'insert')
      ? new crdt.text.Insert(args[0], args[1])
      : new crdt.text.Delete(args[0], args[1]);

    text.apply(operation)
    return text
  }, crdt.text.createFromOrderer(deserialiesOrder(t, id, vector)));
}
