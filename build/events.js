"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextChangedEvent {
    constructor(orderedOperations) {
        this.orderedOperations = orderedOperations;
    }
}
exports.TextChangedEvent = TextChangedEvent;
class ChangesFromEvent {
    constructor(from) {
        this.from = from;
    }
}
exports.ChangesFromEvent = ChangesFromEvent;
