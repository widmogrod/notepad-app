const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = require('http').createServer();

app.set('port', process.env.PORT || 8080);
app.use(express.static('dist'));
app.use(express.static('public'));

const {createFromOrderer} = require('js-crdt/build/text');
const {createVectorClock} = require('js-crdt/build/order');
const {serialiseOperations, deserialiseOperations} = require('./build/serialiser');

let database = createFromOrderer(createVectorClock('server'));

const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  // Restore database state
  database.reduce((_, orderedOperations) => {
    ws.send(JSON.stringify(serialiseOperations(orderedOperations)));
  }, null);

  ws.on('message', function incoming(data) {
    // Update database state
    const partial = deserialiseOperations(JSON.parse(data));
    database = database.next().mergeOperations(partial);

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
