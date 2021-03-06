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
const events_1 = require("./events");
const proto_serialiser_1 = require("./proto-serialiser");
let database = text_1.createFromOrderer(order_1.createVectorClock('server'));
const wss = new WebSocket.Server({ server });
wss.on('connection', function connection(ws) {
    // Restore database state
    database.reduce((_, orderedOperations) => {
        const event = new events_1.TextChangedEvent(orderedOperations);
        const data = proto_serialiser_1.serialise(event);
        return ws.send(data);
    }, null);
    ws.on('message', function incoming(data) {
        // Update database state
        const array = new Uint8Array(data);
        const event = proto_serialiser_1.deserialise(array);
        if (event instanceof events_1.TextChangedEvent) {
            database = database.next();
            database = database.mergeOperations(event.orderedOperations);
        }
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
