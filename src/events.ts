import {OrderedOperations} from 'js-crdt/build/text';

export type Event = TextChangedEvent;

export class TextChangedEvent {
  constructor(public orderedOperations: OrderedOperations) {}
}
