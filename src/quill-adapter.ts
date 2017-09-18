import {Insert, Delete, Selection, Operation, OrderedOperations} from 'js-crdt/build/text';

type QRetain = {retain: number}
type QInsert = {insert: string}
type QDelete = {delete: number}
type QOperation = QRetain | QInsert | QDelete;
type QSource = "user" | "api"

interface QDelta {
  ops: QOperation[]
}

interface QRange {
  index: number;
  length: number;
}

interface Options {
  selectionOrigin: string;
}

export class CRDTOperations {
  constructor(private quill, private options: Options) {
    this.initEvents();
  }

  private initEvents() {
    this.quill.on('text-change', this.onTextChange.bind(this));
    this.quill.on('selection-change', this.onSelectionChange.bind(this));
  }

  private onTextChange(delta: QDelta, oldDelta: QDelta, source: QSource) {
    if (source !== "user") {
      return;
    }

    const ops = deltaToOperations(delta);
    const range = this.quill.getSelection(true);
    if (range) {
      const selection = this.rangeToSelection(range);
      ops.push(selection);
    }

    this.emitOperations(ops);
  }

  private onSelectionChange(range: QRange, oldRange: QRange, source: QSource) {
    if (source !== 'user') {
      return;
    }

    if (range) {
      let ops = [
        this.rangeToSelection(range),
      ];
      this.emitOperations(ops);
    }
  }

  private emitOperations(ops: Operation[]) {
    this.quill.emitter.emit('text-operations', ops);
  }

  private rangeToSelection(r: QRange): Selection {
    return rangeToSelection(this.options.selectionOrigin, r);
  }
}

export function rangeToSelection(origin: string, s: QRange): Selection {
  return new Selection(
    origin,
    s.index,
    s.length,
  );
}

export function selectionToRange(s: Selection): QRange {
  return {
    index: s.at,
    length: s.length,
  };
}

interface OperationReducer {
  pos: number;
  ops: Operation[];
}

export function deltaToOperations(delta: QDelta): Operation[] {
  return delta.ops.reduce((r: OperationReducer, o: QOperation) => {
    if ((<QRetain>o).retain) {
      r.pos = (<QRetain>o).retain;
    } else if ((<QInsert>o).insert) {
      // because for Quill when you replace selected text with other text
      // first you do insert and then delete :/
      r.ops.unshift(new Insert(r.pos, (<QInsert>o).insert));
    } else if ((<QDelete>o).delete) {
      // because for Quill when you replace selected text with other text
      // first you do insert and then delete :/
      r.ops.unshift(new Delete(r.pos, (<QDelete>o).delete));
    }

    return r;
  }, {pos: 0, ops: []}).ops;
}
