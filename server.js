const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer();

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(express.static('node_modules/js-crdt/dist'));

const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const {Insert, Delete, createFromOrderer} = require('js-crdt/build/text');
const {VectorClock, VectorClock2, Id} = require('js-crdt/build/order');
const {SortedSetArray} = require('js-crdt/build/structures/sorted-set-array');
const {NaiveArrayList} = require('js-crdt/build/structures/naive-array-list');

function serialise(order, operations) {
  return JSON.stringify(
    operations
    .reduce((result, operation) => {
      const value = operation instanceof Insert
        ? {type: 'insert', args: [operation.at, operation.value]}
        : {type: 'delete', args: [operation.at, operation.length]}
      ;

      result.operations.push(value);
      return result;
    }, {
      operations: [],
      order: serialiseOrder(order),
    })
  );
}

function create(id) {
  const set1 = new SortedSetArray(new NaiveArrayList([]));
  return new VectorClock(id, {})
}

function serialiseOrder(order) {
  if (order instanceof VectorClock) {
    return {
      t: 'v1',
      id: order.id,
      vector: order.vector,
    }
  } else {

  }
}

function deserialiesOrder(t, id, vector) {
  switch(t) {
    case 'v1':
      return new VectorClock(id, vector);
  }
}

function deserialise(string) {
  const {order, operations} = JSON.parse(string);
  const {t, id, vector} = order;

  return operations.reduce((text, {type, args}) => {
    const operation = (type === 'insert')
      ? new Insert(args[0], args[1])
      : new Delete(args[0], args[1]);

    text.apply(operation);
    return text;
  }, createFromOrderer(deserialiesOrder(t, id, vector)));
}

let database = createFromOrderer(create('server'));

wss.on('connection', function connection(ws) {
  // Restore database state
  database.reduce((_, operations, order) => {
    ws.send(serialise(order, operations));
  }, null);

  ws.on('message', function incoming(data) {
    // Update database state
    database = database.merge(deserialise(data));

    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

server.on('request', app);
server.listen(app.get('port'), function listening() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port)
});
