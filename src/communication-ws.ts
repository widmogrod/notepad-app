import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import {QueueingSubject} from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import {serialiseOperations, deserialiseOperations, SerialisedOrderedOperations} from './serialiser';
import {OrderedOperations} from 'js-crdt/build/text';

interface Sync {
  onLocalChange(fn: (oo: OrderedOperations) => void);
  remoteChange(oo: OrderedOperations);
}

export class CommunicationWS {
  private publish: QueueingSubject<SerialisedOrderedOperations>;
  private messages: Observable<OrderedOperations>;

  constructor(private url: string) {
    this.publish = new QueueingSubject()
    this.messages = websocketConnect(url, this.publish).messages;
  }

  public register(t: Sync) {
    this.publishLocalChanges(t);
    this.subscribeRemoteChanges(t);
  }

  private subscribeRemoteChanges(t: Sync) {
    this.messages
      .retryWhen(errors => errors.delay(10000))
      .map(deserialiseOperations)
      .subscribe(oo => t.remoteChange(oo));
  }

  private publishLocalChanges(t: Sync) {
    t.onLocalChange((oo: OrderedOperations) => {
      this.publish.next(serialiseOperations(oo));
    })
  }
}


