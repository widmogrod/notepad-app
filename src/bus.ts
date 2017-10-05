import * as EventEmitter from 'events';

type Data = any;
type Topic = string;
type Handler = (data?: Data) => void;

export class Bus {
  private events: EventEmitter;
  constructor() {
    this.events = new EventEmitter();
  }

  public publish(topic: Topic, data?: Data) {
    this.events.emit(topic, data);
  }

  public subscribe(topic: Topic, handler: Handler) {
    this.events.on(topic, handler);
  }
}
