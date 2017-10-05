import {Observable, Subscription} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import {QueueingSubject} from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import {serialise, deserialise} from './proto-serialiser';
import {TextChangedEvent, ChangesFromEvent} from './events';
import {Text, OrderedOperations} from 'js-crdt/build/text';

function blobToArrayBuffer(blob: Blob): Observable<Uint8Array> {
  return Observable.create((sink) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      sink.next(new Uint8Array(fileReader.result))
      sink.complete();
    }
    fileReader.readAsArrayBuffer(blob);
  });
}

interface Sync {
  onLocalChange(fn: (oo: OrderedOperations) => void);
  remoteChange(oo: OrderedOperations);
  getText(): Text
}

interface Subscriber {
  subscribe(topic, handler)
}

export class CommunicationWS {
  private publish: QueueingSubject<string>;
  private messages: Observable<string>;
  private connectionStatus: Observable<number>;
  private messagesSub: Subscription;

  constructor(private url: string) {
    this.publish = new QueueingSubject()

    const connection = websocketConnect(url, this.publish, 'arraybuffer');
    this.messages = connection.messages;
    this.connectionStatus = connection.connectionStatus;
  }

  public register(t: Sync, bus: Subscriber) {
    this.publishLocalChanges(t);
    this.subscribeRemoteChanges(t);
    this.requestChangesFrom(t);
    this.developerTools(t, bus);
  }

  private subscribeRemoteChanges(t: Sync) {
    this.messagesSub = this.messages
      .retryWhen(errors => errors.delay(10000))
      .flatMap(data => blobToArrayBuffer(<any>data))
      .map(deserialise)
      .subscribe(event => {
        if (event instanceof TextChangedEvent) {
          t.remoteChange(event.orderedOperations);
        }
      });
  }

  private publishLocalChanges(t: Sync) {
    t.onLocalChange((oo: OrderedOperations) => {
      const event = new TextChangedEvent(oo);
      this.publish.next(<any>serialise(event));
    })
  }

  private requestChangesFrom(t: Sync) {
    this.connectionStatus
      .subscribe(status => {
        if (status === 1) {
          const event = new ChangesFromEvent(t.getText().order);
          this.publish.next(<any>serialise(event));
        }
      });
  }

  private developerTools(t: Sync, bus: Subscriber) {
    bus.subscribe("connect-ws", () => {
      this.subscribeRemoteChanges(t)
    });
    bus.subscribe("disconnect-ws", () => {
      this.messagesSub.unsubscribe();
    });
  }
}
