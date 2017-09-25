import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/retryWhen";
import "rxjs/add/operator/delay";
import {QueueingSubject} from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
// import {serialiseOperations, deserialiseOperations, SerialisedOrderedOperations} from './serialiser';
import {serialise, deserialiseOperations} from './proto-serialiser';
import * as pb from './protobuf/events';
import {TextChangedEvent} from './events';
import {OrderedOperations} from 'js-crdt/build/text';

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
}

export class CommunicationWS {
  private publish: QueueingSubject<string>;
  private messages: Observable<string>;

  constructor(private url: string) {
    this.publish = new QueueingSubject()
    this.messages = websocketConnect(url, this.publish, 'arraybuffer').messages;
  }

  public register(t: Sync) {
    this.publishLocalChanges(t);
    this.subscribeRemoteChanges(t);
  }

  private subscribeRemoteChanges(t: Sync) {
    this.messages
      .retryWhen(errors => errors.delay(10000))
      .flatMap(data => blobToArrayBuffer(<any>data))
      .map(o => pb.OrderedOperations.decode(o))
      .map(deserialiseOperations)
      .subscribe(oo => {
        t.remoteChange(oo);
      });
  }

  private publishLocalChanges(t: Sync) {
    t.onLocalChange((oo: OrderedOperations) => {
      const textChanged = new TextChangedEvent(oo);
      this.publish.next(<any>serialise(textChanged));
      // this.publish.next(<any>pb.OrderedOperations.encode(serialiseOperations(oo)).finish());
    })
  }
}
