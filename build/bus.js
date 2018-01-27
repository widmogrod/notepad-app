"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
class Bus {
    constructor() {
        this.events = new EventEmitter();
    }
    publish(topic, data) {
        this.events.emit(topic, data);
    }
    subscribe(topic, handler) {
        this.events.on(topic, handler);
    }
}
exports.Bus = Bus;
