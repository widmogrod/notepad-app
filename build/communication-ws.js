"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/delay");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
// import {serialiseOperations, deserialiseOperations, SerialisedOrderedOperations} from './serialiser';
const proto_serialiser_1 = require("./proto-serialiser");
const pb = require("./protobuf/events");
function blobToArrayBuder(blob) {
    return Rx_1.Observable.create((sink) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            console.log(new Uint8Array(fileReader.result));
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
            .flatMap(data => blobToArrayBuder(data))
            .map(o => pb.OrderedOperations.decode(o))
            .map(proto_serialiser_1.deserialiseOperations)
            .subscribe(oo => {
            t.remoteChange(oo);
        });
    }
    publishLocalChanges(t) {
        t.onLocalChange((oo) => {
            console.log(pb.OrderedOperations.encode(proto_serialiser_1.serialiseOperations(oo)).finish());
            this.publish.next(pb.OrderedOperations.encode(proto_serialiser_1.serialiseOperations(oo)).finish());
        });
    }
}
exports.CommunicationWS = CommunicationWS;
