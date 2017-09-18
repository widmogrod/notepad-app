"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/map");
require("rxjs/add/operator/retryWhen");
require("rxjs/add/operator/delay");
const queueing_subject_1 = require("queueing-subject");
const rxjs_websockets_1 = require("rxjs-websockets");
const serialiser_1 = require("./serialiser");
class CommunicationWS {
    constructor(url) {
        this.url = url;
        this.publish = new queueing_subject_1.QueueingSubject();
        this.messages = rxjs_websockets_1.default(url, this.publish).messages;
    }
    register(t) {
        this.publishLocalChanges(t);
        this.subscribeRemoteChanges(t);
    }
    subscribeRemoteChanges(t) {
        this.messages
            .retryWhen(errors => errors.delay(10000))
            .map(serialiser_1.deserialiseOperations)
            .subscribe(oo => t.remoteChange(oo));
    }
    publishLocalChanges(t) {
        t.onLocalChange((oo) => {
            this.publish.next(serialiser_1.serialiseOperations(oo));
        });
    }
}
exports.CommunicationWS = CommunicationWS;
