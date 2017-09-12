const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer();

app.set('port', process.env.PORT || 8080);
app.use(express.static('dist'));
app.use(express.static('public'));
// app.use(express.static('node_modules/js-crdt/dist'));

const wss = new WebSocket.Server({ server });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const {createFromOrderer} = require('js-crdt/build/text');
const {createVectorClock2} = require('js-crdt/build/order');
const {serialiseOperations, deserialise} = require('./build/serialiser');

let database = createFromOrderer(createVectorClock2('server'));

wss.on('connection', function connection(ws) {
  // Restore database state
  database.reduce((_, operations, order) => {
    ws.send(JSON.stringify(serialiseOperations(order, operations)));
  }, null);

  ws.on('message', function incoming(data) {
    // console.log(data)
    // Update database state
    const partial = deserialise(JSON.parse(data));
    database = database.next().merge(partial);

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
