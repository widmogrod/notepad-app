import {Text, OrderedOperations, Selection, getSelections} from 'js-crdt/build/text';
import {selectionToRange} from './quill-adapter';
import {nextTick} from 'process';

interface Sync {
  onLocalChange(fn);
  onRemoteChange(fn);
}

type StringToColor = (value: string) => string;

export class QuillCursorsUpdater {
  constructor(private cursors, private editor, private selectionOrigin: string, private color: StringToColor) {}

  public register(m: Sync) {
    m.onLocalChange((oo: OrderedOperations, text: Text) => this.updateSelection(text))
    m.onRemoteChange((oo: OrderedOperations, text: Text) => this.updateSelection(text))
  }

  private updateSelection(text: Text) {
    const defaultSelection = new Selection(this.selectionOrigin, 0, 0);
    const selections = getSelections(text, defaultSelection);

    selections.reduce((_, s: Selection) => {
      if (s.origin === this.selectionOrigin) {
        this.editor.setSelection(selectionToRange(s));
      } else {
        this.cursors.setCursor(s.origin, selectionToRange(s), s.origin, this.color(s.origin));
      }
    }, null);
  }
}


