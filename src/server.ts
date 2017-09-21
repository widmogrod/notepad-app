import * as express from 'express';
import * as WebSocket from 'ws';
import {createServer} from 'http';
import {env} from 'process';

const app = express();
const server = createServer();

app.set('port', env.PORT || 8080);
app.use(express.static('dist'));
app.use(express.static('public'));

import {createFromOrderer} from 'js-crdt/build/text';
import {createVectorClock} from 'js-crdt/build/order';
import {serialiseOperations, deserialiseOperations} from './serialiser';

let database = createFromOrderer(createVectorClock('server'));

const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
  // Restore database state
  database.reduce((_, orderedOperations) => {
    return ws.send(JSON.stringify(serialiseOperations(orderedOperations)));
  }, null);

  ws.on('message', function incoming(data) {
    // Update database state
    const object = JSON.parse(data);
    const partial = deserialiseOperations(object);

    database = database.next();
    database.mergeOperations(partial);

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
