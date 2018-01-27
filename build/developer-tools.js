"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rx_1 = require("rxjs/Rx");
class DeveloperTools {
    constructor(bus) {
        this.bus = bus;
    }
    start() {
        Rx_1.Observable.fromEvent(document, 'click')
            .subscribe((e) => {
            const action = e.target.dataset.action;
            switch (action) {
                case "disconnect-ws":
                case "connect-ws":
                    this.bus.publish(action);
                    break;
            }
        });
    }
}
exports.DeveloperTools = DeveloperTools;
