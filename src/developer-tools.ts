import {Observable} from 'rxjs/Rx';

interface Publisher {
  publish(topic: string, data?: any)
}

export class DeveloperTools {
  constructor (public bus: Publisher) {}
  public start() {
    Observable.fromEvent(document, 'click')
      .subscribe((e: MouseEvent) => {
        const action = (<HTMLElement>e.target).dataset.action;
        switch (action) {
          case "disconnect-ws":
          case "connect-ws":
            this.bus.publish(action)
            break;
        }
      })
  }
}
