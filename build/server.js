"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const WebSocket = require("ws");
const http_1 = require("http");
const process_1 = require("process");
const app = express();
const server = http_1.createServer();
app.set('port', process_1.env.PORT || 8080);
app.use(express.static('dist'));
app.use(express.static('public'));
const text_1 = require("js-crdt/build/text");
const order_1 = require("js-crdt/build/order");
// import {serialiseOperations, deserialiseOperations} from './serialiser';
const proto_serialiser_1 = require("./proto-serialiser");
const pb = require("./protobuf/events");
let database = text_1.createFromOrderer(order_1.createVectorClock('server'));
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
    // Restore database state
    database.reduce((_, orderedOperations) => {
        return ws.send(JSON.stringify(proto_serialiser_1.serialiseOperations(orderedOperations)));
    }, null);
    ws.on('message', function incoming(data) {
        // Update database state
        // const object = JSON.parse(data);
        const object = pb.OrderedOperations.decode(new Uint8Array(data));
        const partial = proto_serialiser_1.deserialiseOperations(object);
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
    console.log('Listening at http://%s:%s', host, port);
});
