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
        this.messages = rxjs_websockets_1.default(url, this.publish, 'arraybuffer').messages;
    }
    register(t) {
        this.publishLocalChanges(t);
        this.subscribeRemoteChanges(t);
    }
    subscribeRemoteChanges(t) {
        this.messages
            .retryWhen(errors => errors.delay(10000))
            .flatMap(data => blobToArrayBuffer(data))
            .map(proto_serialiser_1.deserialise)
            .subscribe(e => {
            if (e instanceof events_1.TextChangedEvent) {
                t.remoteChange(e.orderedOperations);
            }
        });
    }
    publishLocalChanges(t) {
        t.onLocalChange((oo) => {
            const textChanged = new events_1.TextChangedEvent(oo);
            this.publish.next(proto_serialiser_1.serialise(textChanged));
        });
    }
}
exports.CommunicationWS = CommunicationWS;
