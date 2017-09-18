import {Text, OrderedOperations, Operation} from 'js-crdt/build/text';
import * as EventEmitter from 'events';

type ChangeFunc = (oo: OrderedOperations, text: Text, previous: Text) => void;

export class TextSync {
  private events: EventEmitter;
  constructor(private text: Text) {
    this.events = new EventEmitter();
  }

  public localChange(ops: Operation[]) {
    if (!ops || !ops.length) {
      return;
    }

    const previous = this.text;
    this.text = this.text.next();
    const oo = this.text.apply(...ops);

    this.triggerLocalModelUpdate(oo, this.text, previous)
  }

  public remoteChange(oo: OrderedOperations) {
    const previous = this.text;
    this.text = this.text.next();
    this.text = this.text.mergeOperations(oo);

    this.triggerRemoteModelUpdate(oo, this.text, previous);
  }

  public triggerLocalModelUpdate(oo: OrderedOperations, text: Text, previous: Text) {
    this.events.emit('local-change', oo, text, previous)
  }

  public triggerRemoteModelUpdate(oo: OrderedOperations, text: Text, previous: Text) {
    this.events.emit('remote-change', oo, text, previous)
  }

  public onLocalChange(fn: ChangeFunc) {
    this.events.on('local-change', fn);
  }

  public onRemoteChange(fn: ChangeFunc) {
    this.events.on('remote-change', fn);
  }
}
