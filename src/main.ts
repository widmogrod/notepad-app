import crdt from 'js-crdt';
import {Text, Insert, Operation, OrderedOperations} from 'js-crdt/build/text';
import * as ColorHash from 'color-hash';

function uuid(): string {
  const array = new Uint8Array(2);
  crypto.getRandomValues(array);
  return array.join('-')
}

function websocketURL(): string {
  let host = window.document.location.host.replace(/:.*/, '');
  let port = window.document.location.port;
  let protocol = window.document.location.protocol.match(/s:$/) ? 'wss' : 'ws';

  return protocol + '://' + host + (port ? (':' + port) : '')
}

// This is hack to properly require quill :/
import * as Quill from 'quill';
import 'quill-cursors';
import {CRDTOperations} from './quill-adapter';

Quill.register('modules/crdtOperations', CRDTOperations)

import {TextSync} from './text-sync';
import {QuillContentUpdater} from './quill-content-updater';
import {QuillCursorsUpdater} from './quill-cursors-updater';
import {CommunicationWS} from './communication-ws';

interface CreateQuillDependencies {
  editorId: string
  clientId: string
}

function creteQuill(di: CreateQuillDependencies): Quill {
  return  new Quill(di.editorId, {
    modules: {
      toolbar: false,
      cursors: true,
      crdtOperations: {
        selectionOrigin: di.clientId,
      },
    },
    formats: [],
    theme: 'snow'
  });
}

interface CreateContentUpdaterDependencies {
  editor: Quill
}

function createContentUpdater(di: CreateContentUpdaterDependencies): QuillContentUpdater {
  return new QuillContentUpdater(di.editor);
}

interface CreateCursorUpdaterDependencies {
  editor: Quill;
  clientId: string;
  stringToColor: StringToColorFunc;
}

function createCursorUpdater(di: CreateCursorUpdaterDependencies): QuillCursorsUpdater {
  return new QuillCursorsUpdater(
    di.editor.getModule('cursors'),
    di.editor,
    di.clientId,
    di.stringToColor,
  );
}

interface CreateCommunicationWSDependencies {
  wsURL: string;
}

function createCommunicationWS(di: CreateCommunicationWSDependencies): CommunicationWS {
  return new CommunicationWS(di.wsURL);
}

interface CreateTextDependencies {
  clientId: string;
}

function createText(di: CreateTextDependencies): Text {
  return crdt.text.createFromOrderer(
    crdt.order.createVectorClock(di.clientId),
  );
}

interface CreateTextSyncDependencies {
  text: Text;
}

function createTextSync(di: CreateTextSyncDependencies): TextSync {
  return new TextSync(di.text);
}

interface StringToColorDependencies {
  colorHash: ColorHash;
}

type StringToColorFunc = (s: string) => string;

function createStringToColor(di: StringToColorDependencies): StringToColorFunc {
  return (s: string) => di.colorHash.hex(s);
}

interface DeIi {
  editorId: string;
  clientId: string;
  wsURL: string;
  colorHash: ColorHash;
  editor: Quill;
  stringToColor: StringToColorFunc;
  contentUpdater: QuillContentUpdater;
  cursorUpdater: QuillCursorsUpdater;
  communicationWS: CommunicationWS;
  text: Text;
  textSync: TextSync;
}

const DI = <DeIi>{};

DI.clientId = uuid();
DI.editorId = '#editor';
DI.wsURL = websocketURL();
DI.colorHash = new ColorHash();
DI.editor = creteQuill(DI);
DI.stringToColor = createStringToColor(DI);
DI.contentUpdater = createContentUpdater(DI);
DI.cursorUpdater = createCursorUpdater(DI);
DI.communicationWS = createCommunicationWS(DI);
DI.text = createText(DI);
DI.textSync = createTextSync(DI);

function main(di: DeIi) {
  di.contentUpdater.register(di.textSync);
  di.cursorUpdater.register(di.textSync);
  di.communicationWS.register(di.textSync);
  di.editor.focus();
}

main(DI);
