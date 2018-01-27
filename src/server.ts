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
import {TextChangedEvent, ChangesFromEvent} from './events';
import {serialise, deserialise} from './proto-serialiser';

let database = createFromOrderer(createVectorClock('server'));

const wss = new WebSocket.Server({ server });

wss.broadcast = function(data, exceptClient) {
  // Broadcast to everyone else.
  wss.clients.forEach(function each(client) {
    if (client !== exceptClient && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    // Update database state
    const array = new Uint8Array(data);
    const event = deserialise(array);

    if (event instanceof TextChangedEvent) {
      database = database.next();
      database = database.mergeOperations(event.orderedOperations);
      wss.broadcast(data, ws);
    }

    if (event instanceof ChangesFromEvent) {
      // Restore database state from order
      const restore = (_, orderedOperations) => {
        const event = new TextChangedEvent(orderedOperations);
        const data = serialise(event);
        return ws.send(data);
      }

      if (event.from !== null) {
        database.from(event.from).reduce(restore, null);
      } else {
        database.reduce(restore, null);
      }
    }
  });
});

server.on('request', app);
server.listen(app.get('port'), function listening() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port)
});
