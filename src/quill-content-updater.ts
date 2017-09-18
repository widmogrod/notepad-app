import {Text, Operation, OrderedOperations, renderString} from 'js-crdt/build/text';
import * as QuillDelta from 'quill-delta'

interface Sync {
  localChange(ops: Operation[]);
  onRemoteChange(fn: (oo: OrderedOperations, text: Text) => void);
}

export class QuillContentUpdater {
  constructor(private quill) {}

  public register(t: Sync) {
    this.recordLocalChange(t);
    this.renderRemoteChange(t);
  }

  private recordLocalChange(t: Sync) {
    this.quill.on('text-operations', (ops: Operation[]) => {
      t.localChange(ops);
    });
  }

  private renderRemoteChange(t: Sync) {
    t.onRemoteChange((oo: OrderedOperations, text: Text) => {
      const dd = new QuillDelta()
        .retain(0)
        .insert(renderString(text))

      this.quill.setContents(dd);
    });
  }
}


