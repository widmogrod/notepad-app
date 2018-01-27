import * as $protobuf from "protobufjs";

/** Properties of an Id. */
export interface IId {

    /** Id node */
    node?: string;

    /** Id version */
    version?: number;
}

/** Represents an Id. */
export class Id {

    /**
     * Constructs a new Id.
     * @param [properties] Properties to set
     */
    constructor(properties?: IId);

    /** Id node. */
    public node: string;

    /** Id version. */
    public version: number;

    /**
     * Creates a new Id instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Id instance
     */
    public static create(properties?: IId): Id;

    /**
     * Encodes the specified Id message. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Id message, length delimited. Does not implicitly {@link Id.verify|verify} messages.
     * @param message Id message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IId, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Id message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Id;

    /**
     * Decodes an Id message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Id;

    /**
     * Verifies an Id message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Id message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Id
     */
    public static fromObject(object: { [k: string]: any }): Id;

    /**
     * Creates a plain object from an Id message. Also converts values to other types if specified.
     * @param message Id
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Id, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Id to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a VectorClock. */
export interface IVectorClock {

    /** VectorClock id */
    id?: IId;

    /** VectorClock vector */
    vector?: IId[];
}

/** Represents a VectorClock. */
export class VectorClock {

    /**
     * Constructs a new VectorClock.
     * @param [properties] Properties to set
     */
    constructor(properties?: IVectorClock);

    /** VectorClock id. */
    public id?: (IId|null);

    /** VectorClock vector. */
    public vector: IId[];

    /**
     * Creates a new VectorClock instance using the specified properties.
     * @param [properties] Properties to set
     * @returns VectorClock instance
     */
    public static create(properties?: IVectorClock): VectorClock;

    /**
     * Encodes the specified VectorClock message. Does not implicitly {@link VectorClock.verify|verify} messages.
     * @param message VectorClock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IVectorClock, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified VectorClock message, length delimited. Does not implicitly {@link VectorClock.verify|verify} messages.
     * @param message VectorClock message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IVectorClock, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a VectorClock message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns VectorClock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): VectorClock;

    /**
     * Decodes a VectorClock message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns VectorClock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): VectorClock;

    /**
     * Verifies a VectorClock message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a VectorClock message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns VectorClock
     */
    public static fromObject(object: { [k: string]: any }): VectorClock;

    /**
     * Creates a plain object from a VectorClock message. Also converts values to other types if specified.
     * @param message VectorClock
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: VectorClock, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this VectorClock to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Insert. */
export interface IInsert {

    /** Insert at */
    at?: number;

    /** Insert value */
    value?: string;
}

/** Represents an Insert. */
export class Insert {

    /**
     * Constructs a new Insert.
     * @param [properties] Properties to set
     */
    constructor(properties?: IInsert);

    /** Insert at. */
    public at: number;

    /** Insert value. */
    public value: string;

    /**
     * Creates a new Insert instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Insert instance
     */
    public static create(properties?: IInsert): Insert;

    /**
     * Encodes the specified Insert message. Does not implicitly {@link Insert.verify|verify} messages.
     * @param message Insert message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IInsert, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Insert message, length delimited. Does not implicitly {@link Insert.verify|verify} messages.
     * @param message Insert message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IInsert, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Insert message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Insert
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Insert;

    /**
     * Decodes an Insert message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Insert
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Insert;

    /**
     * Verifies an Insert message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Insert message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Insert
     */
    public static fromObject(object: { [k: string]: any }): Insert;

    /**
     * Creates a plain object from an Insert message. Also converts values to other types if specified.
     * @param message Insert
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Insert, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Insert to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Delete. */
export interface IDelete {

    /** Delete at */
    at?: number;

    /** Delete length */
    length?: number;
}

/** Represents a Delete. */
export class Delete {

    /**
     * Constructs a new Delete.
     * @param [properties] Properties to set
     */
    constructor(properties?: IDelete);

    /** Delete at. */
    public at: number;

    /** Delete length. */
    public length: number;

    /**
     * Creates a new Delete instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Delete instance
     */
    public static create(properties?: IDelete): Delete;

    /**
     * Encodes the specified Delete message. Does not implicitly {@link Delete.verify|verify} messages.
     * @param message Delete message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IDelete, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Delete message, length delimited. Does not implicitly {@link Delete.verify|verify} messages.
     * @param message Delete message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IDelete, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Delete message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Delete
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Delete;

    /**
     * Decodes a Delete message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Delete
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Delete;

    /**
     * Verifies a Delete message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Delete message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Delete
     */
    public static fromObject(object: { [k: string]: any }): Delete;

    /**
     * Creates a plain object from a Delete message. Also converts values to other types if specified.
     * @param message Delete
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Delete, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Delete to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Selection. */
export interface ISelection {

    /** Selection origin */
    origin?: string;

    /** Selection at */
    at?: number;

    /** Selection length */
    length?: number;
}

/** Represents a Selection. */
export class Selection {

    /**
     * Constructs a new Selection.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISelection);

    /** Selection origin. */
    public origin: string;

    /** Selection at. */
    public at: number;

    /** Selection length. */
    public length: number;

    /**
     * Creates a new Selection instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Selection instance
     */
    public static create(properties?: ISelection): Selection;

    /**
     * Encodes the specified Selection message. Does not implicitly {@link Selection.verify|verify} messages.
     * @param message Selection message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISelection, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Selection message, length delimited. Does not implicitly {@link Selection.verify|verify} messages.
     * @param message Selection message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISelection, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Selection message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Selection
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Selection;

    /**
     * Decodes a Selection message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Selection
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Selection;

    /**
     * Verifies a Selection message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Selection message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Selection
     */
    public static fromObject(object: { [k: string]: any }): Selection;

    /**
     * Creates a plain object from a Selection message. Also converts values to other types if specified.
     * @param message Selection
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Selection, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Selection to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Operation. */
export interface IOperation {

    /** Operation insert */
    insert?: IInsert;

    /** Operation delete */
    "delete"?: IDelete;

    /** Operation selection */
    selection?: ISelection;
}

/** Represents an Operation. */
export class Operation {

    /**
     * Constructs a new Operation.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOperation);

    /** Operation insert. */
    public insert?: (IInsert|null);

    /** Operation delete. */
    public delete_?: (IDelete|null);

    /** Operation selection. */
    public selection?: (ISelection|null);

    /** Operation type. */
    public type?: string;

    /**
     * Creates a new Operation instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Operation instance
     */
    public static create(properties?: IOperation): Operation;

    /**
     * Encodes the specified Operation message. Does not implicitly {@link Operation.verify|verify} messages.
     * @param message Operation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Operation message, length delimited. Does not implicitly {@link Operation.verify|verify} messages.
     * @param message Operation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Operation message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Operation;

    /**
     * Decodes an Operation message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Operation;

    /**
     * Verifies an Operation message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Operation message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Operation
     */
    public static fromObject(object: { [k: string]: any }): Operation;

    /**
     * Creates a plain object from an Operation message. Also converts values to other types if specified.
     * @param message Operation
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Operation, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Operation to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Order. */
export interface IOrder {

    /** Order vectorClock */
    vectorClock?: IVectorClock;
}

/** Represents an Order. */
export class Order {

    /**
     * Constructs a new Order.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOrder);

    /** Order vectorClock. */
    public vectorClock?: (IVectorClock|null);

    /** Order type. */
    public type?: string;

    /**
     * Creates a new Order instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Order instance
     */
    public static create(properties?: IOrder): Order;

    /**
     * Encodes the specified Order message. Does not implicitly {@link Order.verify|verify} messages.
     * @param message Order message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Order message, length delimited. Does not implicitly {@link Order.verify|verify} messages.
     * @param message Order message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOrder, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Order message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Order
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Order;

    /**
     * Decodes an Order message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Order
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Order;

    /**
     * Verifies an Order message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Order message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Order
     */
    public static fromObject(object: { [k: string]: any }): Order;

    /**
     * Creates a plain object from an Order message. Also converts values to other types if specified.
     * @param message Order
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Order, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Order to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an OrderedOperations. */
export interface IOrderedOperations {

    /** OrderedOperations order */
    order?: IOrder;

    /** OrderedOperations operations */
    operations?: IOperation[];
}

/** Represents an OrderedOperations. */
export class OrderedOperations {

    /**
     * Constructs a new OrderedOperations.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOrderedOperations);

    /** OrderedOperations order. */
    public order?: (IOrder|null);

    /** OrderedOperations operations. */
    public operations: IOperation[];

    /**
     * Creates a new OrderedOperations instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OrderedOperations instance
     */
    public static create(properties?: IOrderedOperations): OrderedOperations;

    /**
     * Encodes the specified OrderedOperations message. Does not implicitly {@link OrderedOperations.verify|verify} messages.
     * @param message OrderedOperations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOrderedOperations, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified OrderedOperations message, length delimited. Does not implicitly {@link OrderedOperations.verify|verify} messages.
     * @param message OrderedOperations message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOrderedOperations, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an OrderedOperations message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OrderedOperations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): OrderedOperations;

    /**
     * Decodes an OrderedOperations message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OrderedOperations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): OrderedOperations;

    /**
     * Verifies an OrderedOperations message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an OrderedOperations message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OrderedOperations
     */
    public static fromObject(object: { [k: string]: any }): OrderedOperations;

    /**
     * Creates a plain object from an OrderedOperations message. Also converts values to other types if specified.
     * @param message OrderedOperations
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: OrderedOperations, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this OrderedOperations to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a TextChangedEvent. */
export interface ITextChangedEvent {

    /** TextChangedEvent orderedOperations */
    orderedOperations?: IOrderedOperations;
}

/** Represents a TextChangedEvent. */
export class TextChangedEvent {

    /**
     * Constructs a new TextChangedEvent.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITextChangedEvent);

    /** TextChangedEvent orderedOperations. */
    public orderedOperations?: (IOrderedOperations|null);

    /**
     * Creates a new TextChangedEvent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TextChangedEvent instance
     */
    public static create(properties?: ITextChangedEvent): TextChangedEvent;

    /**
     * Encodes the specified TextChangedEvent message. Does not implicitly {@link TextChangedEvent.verify|verify} messages.
     * @param message TextChangedEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITextChangedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TextChangedEvent message, length delimited. Does not implicitly {@link TextChangedEvent.verify|verify} messages.
     * @param message TextChangedEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITextChangedEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TextChangedEvent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TextChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TextChangedEvent;

    /**
     * Decodes a TextChangedEvent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TextChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TextChangedEvent;

    /**
     * Verifies a TextChangedEvent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TextChangedEvent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TextChangedEvent
     */
    public static fromObject(object: { [k: string]: any }): TextChangedEvent;

    /**
     * Creates a plain object from a TextChangedEvent message. Also converts values to other types if specified.
     * @param message TextChangedEvent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TextChangedEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TextChangedEvent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a ChangesFromEvent. */
export interface IChangesFromEvent {

    /** ChangesFromEvent from */
    from?: IOrder;
}

/** Represents a ChangesFromEvent. */
export class ChangesFromEvent {

    /**
     * Constructs a new ChangesFromEvent.
     * @param [properties] Properties to set
     */
    constructor(properties?: IChangesFromEvent);

    /** ChangesFromEvent from. */
    public from?: (IOrder|null);

    /**
     * Creates a new ChangesFromEvent instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ChangesFromEvent instance
     */
    public static create(properties?: IChangesFromEvent): ChangesFromEvent;

    /**
     * Encodes the specified ChangesFromEvent message. Does not implicitly {@link ChangesFromEvent.verify|verify} messages.
     * @param message ChangesFromEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IChangesFromEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ChangesFromEvent message, length delimited. Does not implicitly {@link ChangesFromEvent.verify|verify} messages.
     * @param message ChangesFromEvent message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IChangesFromEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ChangesFromEvent message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ChangesFromEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ChangesFromEvent;

    /**
     * Decodes a ChangesFromEvent message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ChangesFromEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ChangesFromEvent;

    /**
     * Verifies a ChangesFromEvent message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ChangesFromEvent message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ChangesFromEvent
     */
    public static fromObject(object: { [k: string]: any }): ChangesFromEvent;

    /**
     * Creates a plain object from a ChangesFromEvent message. Also converts values to other types if specified.
     * @param message ChangesFromEvent
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ChangesFromEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ChangesFromEvent to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Event. */
export interface IEvent {

    /** Event textChanged */
    textChanged?: ITextChangedEvent;

    /** Event changesFrom */
    changesFrom?: IChangesFromEvent;
}

/** Represents an Event. */
export class Event {

    /**
     * Constructs a new Event.
     * @param [properties] Properties to set
     */
    constructor(properties?: IEvent);

    /** Event textChanged. */
    public textChanged?: (ITextChangedEvent|null);

    /** Event changesFrom. */
    public changesFrom?: (IChangesFromEvent|null);

    /** Event type. */
    public type?: string;

    /**
     * Creates a new Event instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Event instance
     */
    public static create(properties?: IEvent): Event;

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @param message Event message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IEvent, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Event;

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Event;

    /**
     * Verifies an Event message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Event
     */
    public static fromObject(object: { [k: string]: any }): Event;

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @param message Event
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Event, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Event to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
