import {OrderedOperations} from 'js-crdt/build/text';
import {Orderer} from 'js-crdt/build/order';

export type Event = TextChangedEvent | ChangesFromEvent;

export class TextChangedEvent {
  constructor(public orderedOperations: OrderedOperations) {}
}

export class ChangesFromEvent {
  constructor(public from: Orderer<any>) {}
}
