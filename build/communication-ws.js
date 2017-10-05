"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/delay");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
const proto_serialiser_1 = require("./proto-serialiser");
const events_1 = require("./events");
function blobToArrayBuffer(blob) {
    return Rx_1.Observable.create((sink) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            sink.next(new Uint8Array(fileReader.result));
            sink.complete();
        };
        fileReader.readAsArrayBuffer(blob);
    });
}
class CommunicationWS {
    constructor(url) {
        this.url = url;
        this.publish = new queueing_subject_1.QueueingSubject();
        const connection = rxjs_websockets_1.default(url, this.publish, 'arraybuffer');
        this.messages = connection.messages;
        this.connectionStatus = connection.connectionStatus;
    }
    register(t, bus) {
        this.publishLocalChanges(t);
        this.subscribeRemoteChanges(t);
        this.requestChangesFrom(t);
        this.developerTools(t, bus);
    }
    subscribeRemoteChanges(t) {
        this.messagesSub = this.messages
            .retryWhen(errors => errors.delay(10000))
            .flatMap(data => blobToArrayBuffer(data))
            .map(proto_serialiser_1.deserialise)
            .subscribe(event => {
            if (event instanceof events_1.TextChangedEvent) {
                t.remoteChange(event.orderedOperations);
            }
        });
    }
    publishLocalChanges(t) {
        t.onLocalChange((oo) => {
            const event = new events_1.TextChangedEvent(oo);
            this.publish.next(proto_serialiser_1.serialise(event));
        });
    }
    requestChangesFrom(t) {
        this.connectionStatus
            .subscribe(status => {
            if (status === 1) {
                const event = new events_1.ChangesFromEvent(t.getText().order);
                this.publish.next(proto_serialiser_1.serialise(event));
            }
        });
    }
    developerTools(t, bus) {
        bus.subscribe("connect-ws", () => {
            this.subscribeRemoteChanges(t);
        });
        bus.subscribe("disconnect-ws", () => {
            this.messagesSub.unsubscribe();
        });
    }
}
exports.CommunicationWS = CommunicationWS;
