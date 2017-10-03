/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.Id = (function() {

    /**
     * Properties of an Id.
     * @exports IId
     * @interface IId
     * @property {string} [node] Id node
     * @property {number} [version] Id version
     */

    /**
     * Constructs a new Id.
     * @exports Id
     * @classdesc Represents an Id.
     * @constructor
     * @param {IId=} [properties] Properties to set
     */
    function Id(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Id node.
     * @member {string}node
     * @memberof Id
     * @instance
     */
    Id.prototype.node = "";

    /**
     * Id version.
     * @member {number}version
     * @memberof Id
     * @instance
     */
    Id.prototype.version = 0;

    /**
     * Creates a new Id instance using the specified properties.
     * @function create
     * @memberof Id
     * @static
     * @param {IId=} [properties] Properties to set
     * @returns {Id} Id instance
     */
    Id.create = function create(properties) {
        return new Id(properties);
    };

    /**
     * Encodes the specified Id message. Does not implicitly {@link Id.verify|verify} messages.
     * @function encode
     * @memberof Id
     * @static
     * @param {IId} message Id message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Id.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.node != null && message.hasOwnProperty("node"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.node);
        if (message.version != null && message.hasOwnProperty("version"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.version);
        return writer;
    };

    /**
     * Encodes the specified Id message, length delimited. Does not implicitly {@link Id.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Id
     * @static
     * @param {IId} message Id message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Id.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Id message from the specified reader or buffer.
     * @function decode
     * @memberof Id
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Id} Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Id.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Id();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.node = reader.string();
                break;
            case 2:
                message.version = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Id message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Id
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Id} Id
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Id.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Id message.
     * @function verify
     * @memberof Id
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Id.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.node != null && message.hasOwnProperty("node"))
            if (!$util.isString(message.node))
                return "node: string expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isInteger(message.version))
                return "version: integer expected";
        return null;
    };

    /**
     * Creates an Id message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Id
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Id} Id
     */
    Id.fromObject = function fromObject(object) {
        if (object instanceof $root.Id)
            return object;
        var message = new $root.Id();
        if (object.node != null)
            message.node = String(object.node);
        if (object.version != null)
            message.version = object.version >>> 0;
        return message;
    };

    /**
     * Creates a plain object from an Id message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Id
     * @static
     * @param {Id} message Id
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Id.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.node = "";
            object.version = 0;
        }
        if (message.node != null && message.hasOwnProperty("node"))
            object.node = message.node;
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        return object;
    };

    /**
     * Converts this Id to JSON.
     * @function toJSON
     * @memberof Id
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Id.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Id;
})();

$root.VectorClock = (function() {

    /**
     * Properties of a VectorClock.
     * @exports IVectorClock
     * @interface IVectorClock
     * @property {IId} [id] VectorClock id
     * @property {Array.<IId>} [vector] VectorClock vector
     */

    /**
     * Constructs a new VectorClock.
     * @exports VectorClock
     * @classdesc Represents a VectorClock.
     * @constructor
     * @param {IVectorClock=} [properties] Properties to set
     */
    function VectorClock(properties) {
        this.vector = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * VectorClock id.
     * @member {(IId|null|undefined)}id
     * @memberof VectorClock
     * @instance
     */
    VectorClock.prototype.id = null;

    /**
     * VectorClock vector.
     * @member {Array.<IId>}vector
     * @memberof VectorClock
     * @instance
     */
    VectorClock.prototype.vector = $util.emptyArray;

    /**
     * Creates a new VectorClock instance using the specified properties.
     * @function create
     * @memberof VectorClock
     * @static
     * @param {IVectorClock=} [properties] Properties to set
     * @returns {VectorClock} VectorClock instance
     */
    VectorClock.create = function create(properties) {
        return new VectorClock(properties);
    };

    /**
     * Encodes the specified VectorClock message. Does not implicitly {@link VectorClock.verify|verify} messages.
     * @function encode
     * @memberof VectorClock
     * @static
     * @param {IVectorClock} message VectorClock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VectorClock.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            $root.Id.encode(message.id, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.vector != null && message.vector.length)
            for (var i = 0; i < message.vector.length; ++i)
                $root.Id.encode(message.vector[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified VectorClock message, length delimited. Does not implicitly {@link VectorClock.verify|verify} messages.
     * @function encodeDelimited
     * @memberof VectorClock
     * @static
     * @param {IVectorClock} message VectorClock message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    VectorClock.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a VectorClock message from the specified reader or buffer.
     * @function decode
     * @memberof VectorClock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {VectorClock} VectorClock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VectorClock.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.VectorClock();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = $root.Id.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.vector && message.vector.length))
                    message.vector = [];
                message.vector.push($root.Id.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a VectorClock message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof VectorClock
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {VectorClock} VectorClock
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    VectorClock.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a VectorClock message.
     * @function verify
     * @memberof VectorClock
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    VectorClock.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id")) {
            var error = $root.Id.verify(message.id);
            if (error)
                return "id." + error;
        }
        if (message.vector != null && message.hasOwnProperty("vector")) {
            if (!Array.isArray(message.vector))
                return "vector: array expected";
            for (var i = 0; i < message.vector.length; ++i) {
                error = $root.Id.verify(message.vector[i]);
                if (error)
                    return "vector." + error;
            }
        }
        return null;
    };

    /**
     * Creates a VectorClock message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof VectorClock
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {VectorClock} VectorClock
     */
    VectorClock.fromObject = function fromObject(object) {
        if (object instanceof $root.VectorClock)
            return object;
        var message = new $root.VectorClock();
        if (object.id != null) {
            if (typeof object.id !== "object")
                throw TypeError(".VectorClock.id: object expected");
            message.id = $root.Id.fromObject(object.id);
        }
        if (object.vector) {
            if (!Array.isArray(object.vector))
                throw TypeError(".VectorClock.vector: array expected");
            message.vector = [];
            for (var i = 0; i < object.vector.length; ++i) {
                if (typeof object.vector[i] !== "object")
                    throw TypeError(".VectorClock.vector: object expected");
                message.vector[i] = $root.Id.fromObject(object.vector[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a VectorClock message. Also converts values to other types if specified.
     * @function toObject
     * @memberof VectorClock
     * @static
     * @param {VectorClock} message VectorClock
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    VectorClock.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.vector = [];
        if (options.defaults)
            object.id = null;
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = $root.Id.toObject(message.id, options);
        if (message.vector && message.vector.length) {
            object.vector = [];
            for (var j = 0; j < message.vector.length; ++j)
                object.vector[j] = $root.Id.toObject(message.vector[j], options);
        }
        return object;
    };

    /**
     * Converts this VectorClock to JSON.
     * @function toJSON
     * @memberof VectorClock
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    VectorClock.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return VectorClock;
})();

$root.Insert = (function() {

    /**
     * Properties of an Insert.
     * @exports IInsert
     * @interface IInsert
     * @property {number} [at] Insert at
     * @property {string} [value] Insert value
     */

    /**
     * Constructs a new Insert.
     * @exports Insert
     * @classdesc Represents an Insert.
     * @constructor
     * @param {IInsert=} [properties] Properties to set
     */
    function Insert(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Insert at.
     * @member {number}at
     * @memberof Insert
     * @instance
     */
    Insert.prototype.at = 0;

    /**
     * Insert value.
     * @member {string}value
     * @memberof Insert
     * @instance
     */
    Insert.prototype.value = "";

    /**
     * Creates a new Insert instance using the specified properties.
     * @function create
     * @memberof Insert
     * @static
     * @param {IInsert=} [properties] Properties to set
     * @returns {Insert} Insert instance
     */
    Insert.create = function create(properties) {
        return new Insert(properties);
    };

    /**
     * Encodes the specified Insert message. Does not implicitly {@link Insert.verify|verify} messages.
     * @function encode
     * @memberof Insert
     * @static
     * @param {IInsert} message Insert message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Insert.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.at != null && message.hasOwnProperty("at"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.at);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified Insert message, length delimited. Does not implicitly {@link Insert.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Insert
     * @static
     * @param {IInsert} message Insert message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Insert.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Insert message from the specified reader or buffer.
     * @function decode
     * @memberof Insert
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Insert} Insert
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Insert.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Insert();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.at = reader.uint32();
                break;
            case 2:
                message.value = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Insert message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Insert
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Insert} Insert
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Insert.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Insert message.
     * @function verify
     * @memberof Insert
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Insert.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.at != null && message.hasOwnProperty("at"))
            if (!$util.isInteger(message.at))
                return "at: integer expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates an Insert message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Insert
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Insert} Insert
     */
    Insert.fromObject = function fromObject(object) {
        if (object instanceof $root.Insert)
            return object;
        var message = new $root.Insert();
        if (object.at != null)
            message.at = object.at >>> 0;
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from an Insert message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Insert
     * @static
     * @param {Insert} message Insert
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Insert.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.at = 0;
            object.value = "";
        }
        if (message.at != null && message.hasOwnProperty("at"))
            object.at = message.at;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this Insert to JSON.
     * @function toJSON
     * @memberof Insert
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Insert.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Insert;
})();

$root.Delete = (function() {

    /**
     * Properties of a Delete.
     * @exports IDelete
     * @interface IDelete
     * @property {number} [at] Delete at
     * @property {number} [length] Delete length
     */

    /**
     * Constructs a new Delete.
     * @exports Delete
     * @classdesc Represents a Delete.
     * @constructor
     * @param {IDelete=} [properties] Properties to set
     */
    function Delete(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Delete at.
     * @member {number}at
     * @memberof Delete
     * @instance
     */
    Delete.prototype.at = 0;

    /**
     * Delete length.
     * @member {number}length
     * @memberof Delete
     * @instance
     */
    Delete.prototype.length = 0;

    /**
     * Creates a new Delete instance using the specified properties.
     * @function create
     * @memberof Delete
     * @static
     * @param {IDelete=} [properties] Properties to set
     * @returns {Delete} Delete instance
     */
    Delete.create = function create(properties) {
        return new Delete(properties);
    };

    /**
     * Encodes the specified Delete message. Does not implicitly {@link Delete.verify|verify} messages.
     * @function encode
     * @memberof Delete
     * @static
     * @param {IDelete} message Delete message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Delete.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.at != null && message.hasOwnProperty("at"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.at);
        if (message.length != null && message.hasOwnProperty("length"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.length);
        return writer;
    };

    /**
     * Encodes the specified Delete message, length delimited. Does not implicitly {@link Delete.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Delete
     * @static
     * @param {IDelete} message Delete message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Delete.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Delete message from the specified reader or buffer.
     * @function decode
     * @memberof Delete
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Delete} Delete
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Delete.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Delete();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.at = reader.uint32();
                break;
            case 2:
                message.length = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Delete message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Delete
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Delete} Delete
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Delete.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Delete message.
     * @function verify
     * @memberof Delete
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Delete.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.at != null && message.hasOwnProperty("at"))
            if (!$util.isInteger(message.at))
                return "at: integer expected";
        if (message.length != null && message.hasOwnProperty("length"))
            if (!$util.isInteger(message.length))
                return "length: integer expected";
        return null;
    };

    /**
     * Creates a Delete message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Delete
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Delete} Delete
     */
    Delete.fromObject = function fromObject(object) {
        if (object instanceof $root.Delete)
            return object;
        var message = new $root.Delete();
        if (object.at != null)
            message.at = object.at >>> 0;
        if (object.length != null)
            message.length = object.length >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a Delete message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Delete
     * @static
     * @param {Delete} message Delete
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Delete.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.at = 0;
            object.length = 0;
        }
        if (message.at != null && message.hasOwnProperty("at"))
            object.at = message.at;
        if (message.length != null && message.hasOwnProperty("length"))
            object.length = message.length;
        return object;
    };

    /**
     * Converts this Delete to JSON.
     * @function toJSON
     * @memberof Delete
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Delete.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Delete;
})();

$root.Selection = (function() {

    /**
     * Properties of a Selection.
     * @exports ISelection
     * @interface ISelection
     * @property {string} [origin] Selection origin
     * @property {number} [at] Selection at
     * @property {number} [length] Selection length
     */

    /**
     * Constructs a new Selection.
     * @exports Selection
     * @classdesc Represents a Selection.
     * @constructor
     * @param {ISelection=} [properties] Properties to set
     */
    function Selection(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Selection origin.
     * @member {string}origin
     * @memberof Selection
     * @instance
     */
    Selection.prototype.origin = "";

    /**
     * Selection at.
     * @member {number}at
     * @memberof Selection
     * @instance
     */
    Selection.prototype.at = 0;

    /**
     * Selection length.
     * @member {number}length
     * @memberof Selection
     * @instance
     */
    Selection.prototype.length = 0;

    /**
     * Creates a new Selection instance using the specified properties.
     * @function create
     * @memberof Selection
     * @static
     * @param {ISelection=} [properties] Properties to set
     * @returns {Selection} Selection instance
     */
    Selection.create = function create(properties) {
        return new Selection(properties);
    };

    /**
     * Encodes the specified Selection message. Does not implicitly {@link Selection.verify|verify} messages.
     * @function encode
     * @memberof Selection
     * @static
     * @param {ISelection} message Selection message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Selection.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.origin != null && message.hasOwnProperty("origin"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.origin);
        if (message.at != null && message.hasOwnProperty("at"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.at);
        if (message.length != null && message.hasOwnProperty("length"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.length);
        return writer;
    };

    /**
     * Encodes the specified Selection message, length delimited. Does not implicitly {@link Selection.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Selection
     * @static
     * @param {ISelection} message Selection message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Selection.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Selection message from the specified reader or buffer.
     * @function decode
     * @memberof Selection
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Selection} Selection
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Selection.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Selection();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.origin = reader.string();
                break;
            case 2:
                message.at = reader.uint32();
                break;
            case 3:
                message.length = reader.uint32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Selection message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Selection
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Selection} Selection
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Selection.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Selection message.
     * @function verify
     * @memberof Selection
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Selection.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.origin != null && message.hasOwnProperty("origin"))
            if (!$util.isString(message.origin))
                return "origin: string expected";
        if (message.at != null && message.hasOwnProperty("at"))
            if (!$util.isInteger(message.at))
                return "at: integer expected";
        if (message.length != null && message.hasOwnProperty("length"))
            if (!$util.isInteger(message.length))
                return "length: integer expected";
        return null;
    };

    /**
     * Creates a Selection message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Selection
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Selection} Selection
     */
    Selection.fromObject = function fromObject(object) {
        if (object instanceof $root.Selection)
            return object;
        var message = new $root.Selection();
        if (object.origin != null)
            message.origin = String(object.origin);
        if (object.at != null)
            message.at = object.at >>> 0;
        if (object.length != null)
            message.length = object.length >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a Selection message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Selection
     * @static
     * @param {Selection} message Selection
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Selection.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.origin = "";
            object.at = 0;
            object.length = 0;
        }
        if (message.origin != null && message.hasOwnProperty("origin"))
            object.origin = message.origin;
        if (message.at != null && message.hasOwnProperty("at"))
            object.at = message.at;
        if (message.length != null && message.hasOwnProperty("length"))
            object.length = message.length;
        return object;
    };

    /**
     * Converts this Selection to JSON.
     * @function toJSON
     * @memberof Selection
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Selection.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Selection;
})();

$root.Operation = (function() {

    /**
     * Properties of an Operation.
     * @exports IOperation
     * @interface IOperation
     * @property {IInsert} [insert] Operation insert
     * @property {IDelete} ["delete"] Operation delete
     * @property {ISelection} [selection] Operation selection
     */

    /**
     * Constructs a new Operation.
     * @exports Operation
     * @classdesc Represents an Operation.
     * @constructor
     * @param {IOperation=} [properties] Properties to set
     */
    function Operation(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Operation insert.
     * @member {(IInsert|null|undefined)}insert
     * @memberof Operation
     * @instance
     */
    Operation.prototype.insert = null;

    /**
     * Operation delete.
     * @member {(IDelete|null|undefined)}delete_
     * @memberof Operation
     * @instance
     */
    Operation.prototype["delete"] = null;

    /**
     * Operation selection.
     * @member {(ISelection|null|undefined)}selection
     * @memberof Operation
     * @instance
     */
    Operation.prototype.selection = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Operation type.
     * @member {string|undefined} type
     * @memberof Operation
     * @instance
     */
    Object.defineProperty(Operation.prototype, "type", {
        get: $util.oneOfGetter($oneOfFields = ["insert", "delete", "selection"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Operation instance using the specified properties.
     * @function create
     * @memberof Operation
     * @static
     * @param {IOperation=} [properties] Properties to set
     * @returns {Operation} Operation instance
     */
    Operation.create = function create(properties) {
        return new Operation(properties);
    };

    /**
     * Encodes the specified Operation message. Does not implicitly {@link Operation.verify|verify} messages.
     * @function encode
     * @memberof Operation
     * @static
     * @param {IOperation} message Operation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Operation.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.insert != null && message.hasOwnProperty("insert"))
            $root.Insert.encode(message.insert, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message["delete"] != null && message.hasOwnProperty("delete"))
            $root.Delete.encode(message["delete"], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.selection != null && message.hasOwnProperty("selection"))
            $root.Selection.encode(message.selection, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Operation message, length delimited. Does not implicitly {@link Operation.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Operation
     * @static
     * @param {IOperation} message Operation message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Operation.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Operation message from the specified reader or buffer.
     * @function decode
     * @memberof Operation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Operation} Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Operation.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Operation();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.insert = $root.Insert.decode(reader, reader.uint32());
                break;
            case 2:
                message["delete"] = $root.Delete.decode(reader, reader.uint32());
                break;
            case 3:
                message.selection = $root.Selection.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Operation message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Operation
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Operation} Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Operation.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Operation message.
     * @function verify
     * @memberof Operation
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Operation.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.insert != null && message.hasOwnProperty("insert")) {
            properties.type = 1;
            var error = $root.Insert.verify(message.insert);
            if (error)
                return "insert." + error;
        }
        if (message["delete"] != null && message.hasOwnProperty("delete")) {
            if (properties.type === 1)
                return "type: multiple values";
            properties.type = 1;
            error = $root.Delete.verify(message["delete"]);
            if (error)
                return "delete." + error;
        }
        if (message.selection != null && message.hasOwnProperty("selection")) {
            if (properties.type === 1)
                return "type: multiple values";
            properties.type = 1;
            error = $root.Selection.verify(message.selection);
            if (error)
                return "selection." + error;
        }
        return null;
    };

    /**
     * Creates an Operation message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Operation
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Operation} Operation
     */
    Operation.fromObject = function fromObject(object) {
        if (object instanceof $root.Operation)
            return object;
        var message = new $root.Operation();
        if (object.insert != null) {
            if (typeof object.insert !== "object")
                throw TypeError(".Operation.insert: object expected");
            message.insert = $root.Insert.fromObject(object.insert);
        }
        if (object["delete"] != null) {
            if (typeof object["delete"] !== "object")
                throw TypeError(".Operation.delete: object expected");
            message["delete"] = $root.Delete.fromObject(object["delete"]);
        }
        if (object.selection != null) {
            if (typeof object.selection !== "object")
                throw TypeError(".Operation.selection: object expected");
            message.selection = $root.Selection.fromObject(object.selection);
        }
        return message;
    };

    /**
     * Creates a plain object from an Operation message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Operation
     * @static
     * @param {Operation} message Operation
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Operation.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.insert != null && message.hasOwnProperty("insert")) {
            object.insert = $root.Insert.toObject(message.insert, options);
            if (options.oneofs)
                object.type = "insert";
        }
        if (message["delete"] != null && message.hasOwnProperty("delete")) {
            object["delete"] = $root.Delete.toObject(message["delete"], options);
            if (options.oneofs)
                object.type = "delete";
        }
        if (message.selection != null && message.hasOwnProperty("selection")) {
            object.selection = $root.Selection.toObject(message.selection, options);
            if (options.oneofs)
                object.type = "selection";
        }
        return object;
    };

    /**
     * Converts this Operation to JSON.
     * @function toJSON
     * @memberof Operation
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Operation.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Operation;
})();

$root.Order = (function() {

    /**
     * Properties of an Order.
     * @exports IOrder
     * @interface IOrder
     * @property {IVectorClock} [vectorClock] Order vectorClock
     */

    /**
     * Constructs a new Order.
     * @exports Order
     * @classdesc Represents an Order.
     * @constructor
     * @param {IOrder=} [properties] Properties to set
     */
    function Order(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Order vectorClock.
     * @member {(IVectorClock|null|undefined)}vectorClock
     * @memberof Order
     * @instance
     */
    Order.prototype.vectorClock = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Order type.
     * @member {string|undefined} type
     * @memberof Order
     * @instance
     */
    Object.defineProperty(Order.prototype, "type", {
        get: $util.oneOfGetter($oneOfFields = ["vectorClock"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Order instance using the specified properties.
     * @function create
     * @memberof Order
     * @static
     * @param {IOrder=} [properties] Properties to set
     * @returns {Order} Order instance
     */
    Order.create = function create(properties) {
        return new Order(properties);
    };

    /**
     * Encodes the specified Order message. Does not implicitly {@link Order.verify|verify} messages.
     * @function encode
     * @memberof Order
     * @static
     * @param {IOrder} message Order message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Order.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.vectorClock != null && message.hasOwnProperty("vectorClock"))
            $root.VectorClock.encode(message.vectorClock, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Order message, length delimited. Does not implicitly {@link Order.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Order
     * @static
     * @param {IOrder} message Order message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Order.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Order message from the specified reader or buffer.
     * @function decode
     * @memberof Order
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Order} Order
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Order.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Order();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.vectorClock = $root.VectorClock.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Order message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Order
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Order} Order
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Order.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Order message.
     * @function verify
     * @memberof Order
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Order.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.vectorClock != null && message.hasOwnProperty("vectorClock")) {
            properties.type = 1;
            var error = $root.VectorClock.verify(message.vectorClock);
            if (error)
                return "vectorClock." + error;
        }
        return null;
    };

    /**
     * Creates an Order message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Order
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Order} Order
     */
    Order.fromObject = function fromObject(object) {
        if (object instanceof $root.Order)
            return object;
        var message = new $root.Order();
        if (object.vectorClock != null) {
            if (typeof object.vectorClock !== "object")
                throw TypeError(".Order.vectorClock: object expected");
            message.vectorClock = $root.VectorClock.fromObject(object.vectorClock);
        }
        return message;
    };

    /**
     * Creates a plain object from an Order message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Order
     * @static
     * @param {Order} message Order
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Order.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.vectorClock != null && message.hasOwnProperty("vectorClock")) {
            object.vectorClock = $root.VectorClock.toObject(message.vectorClock, options);
            if (options.oneofs)
                object.type = "vectorClock";
        }
        return object;
    };

    /**
     * Converts this Order to JSON.
     * @function toJSON
     * @memberof Order
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Order.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Order;
})();

$root.OrderedOperations = (function() {

    /**
     * Properties of an OrderedOperations.
     * @exports IOrderedOperations
     * @interface IOrderedOperations
     * @property {IOrder} [order] OrderedOperations order
     * @property {Array.<IOperation>} [operations] OrderedOperations operations
     */

    /**
     * Constructs a new OrderedOperations.
     * @exports OrderedOperations
     * @classdesc Represents an OrderedOperations.
     * @constructor
     * @param {IOrderedOperations=} [properties] Properties to set
     */
    function OrderedOperations(properties) {
        this.operations = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OrderedOperations order.
     * @member {(IOrder|null|undefined)}order
     * @memberof OrderedOperations
     * @instance
     */
    OrderedOperations.prototype.order = null;

    /**
     * OrderedOperations operations.
     * @member {Array.<IOperation>}operations
     * @memberof OrderedOperations
     * @instance
     */
    OrderedOperations.prototype.operations = $util.emptyArray;

    /**
     * Creates a new OrderedOperations instance using the specified properties.
     * @function create
     * @memberof OrderedOperations
     * @static
     * @param {IOrderedOperations=} [properties] Properties to set
     * @returns {OrderedOperations} OrderedOperations instance
     */
    OrderedOperations.create = function create(properties) {
        return new OrderedOperations(properties);
    };

    /**
     * Encodes the specified OrderedOperations message. Does not implicitly {@link OrderedOperations.verify|verify} messages.
     * @function encode
     * @memberof OrderedOperations
     * @static
     * @param {IOrderedOperations} message OrderedOperations message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OrderedOperations.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.order != null && message.hasOwnProperty("order"))
            $root.Order.encode(message.order, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.operations != null && message.operations.length)
            for (var i = 0; i < message.operations.length; ++i)
                $root.Operation.encode(message.operations[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified OrderedOperations message, length delimited. Does not implicitly {@link OrderedOperations.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OrderedOperations
     * @static
     * @param {IOrderedOperations} message OrderedOperations message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OrderedOperations.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OrderedOperations message from the specified reader or buffer.
     * @function decode
     * @memberof OrderedOperations
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OrderedOperations} OrderedOperations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OrderedOperations.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OrderedOperations();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.order = $root.Order.decode(reader, reader.uint32());
                break;
            case 2:
                if (!(message.operations && message.operations.length))
                    message.operations = [];
                message.operations.push($root.Operation.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OrderedOperations message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OrderedOperations
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OrderedOperations} OrderedOperations
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OrderedOperations.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OrderedOperations message.
     * @function verify
     * @memberof OrderedOperations
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OrderedOperations.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.order != null && message.hasOwnProperty("order")) {
            var error = $root.Order.verify(message.order);
            if (error)
                return "order." + error;
        }
        if (message.operations != null && message.hasOwnProperty("operations")) {
            if (!Array.isArray(message.operations))
                return "operations: array expected";
            for (var i = 0; i < message.operations.length; ++i) {
                error = $root.Operation.verify(message.operations[i]);
                if (error)
                    return "operations." + error;
            }
        }
        return null;
    };

    /**
     * Creates an OrderedOperations message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OrderedOperations
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OrderedOperations} OrderedOperations
     */
    OrderedOperations.fromObject = function fromObject(object) {
        if (object instanceof $root.OrderedOperations)
            return object;
        var message = new $root.OrderedOperations();
        if (object.order != null) {
            if (typeof object.order !== "object")
                throw TypeError(".OrderedOperations.order: object expected");
            message.order = $root.Order.fromObject(object.order);
        }
        if (object.operations) {
            if (!Array.isArray(object.operations))
                throw TypeError(".OrderedOperations.operations: array expected");
            message.operations = [];
            for (var i = 0; i < object.operations.length; ++i) {
                if (typeof object.operations[i] !== "object")
                    throw TypeError(".OrderedOperations.operations: object expected");
                message.operations[i] = $root.Operation.fromObject(object.operations[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an OrderedOperations message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OrderedOperations
     * @static
     * @param {OrderedOperations} message OrderedOperations
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OrderedOperations.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.operations = [];
        if (options.defaults)
            object.order = null;
        if (message.order != null && message.hasOwnProperty("order"))
            object.order = $root.Order.toObject(message.order, options);
        if (message.operations && message.operations.length) {
            object.operations = [];
            for (var j = 0; j < message.operations.length; ++j)
                object.operations[j] = $root.Operation.toObject(message.operations[j], options);
        }
        return object;
    };

    /**
     * Converts this OrderedOperations to JSON.
     * @function toJSON
     * @memberof OrderedOperations
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OrderedOperations.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return OrderedOperations;
})();

$root.TextChangedEvent = (function() {

    /**
     * Properties of a TextChangedEvent.
     * @exports ITextChangedEvent
     * @interface ITextChangedEvent
     * @property {IOrderedOperations} [orderedOperations] TextChangedEvent orderedOperations
     */

    /**
     * Constructs a new TextChangedEvent.
     * @exports TextChangedEvent
     * @classdesc Represents a TextChangedEvent.
     * @constructor
     * @param {ITextChangedEvent=} [properties] Properties to set
     */
    function TextChangedEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TextChangedEvent orderedOperations.
     * @member {(IOrderedOperations|null|undefined)}orderedOperations
     * @memberof TextChangedEvent
     * @instance
     */
    TextChangedEvent.prototype.orderedOperations = null;

    /**
     * Creates a new TextChangedEvent instance using the specified properties.
     * @function create
     * @memberof TextChangedEvent
     * @static
     * @param {ITextChangedEvent=} [properties] Properties to set
     * @returns {TextChangedEvent} TextChangedEvent instance
     */
    TextChangedEvent.create = function create(properties) {
        return new TextChangedEvent(properties);
    };

    /**
     * Encodes the specified TextChangedEvent message. Does not implicitly {@link TextChangedEvent.verify|verify} messages.
     * @function encode
     * @memberof TextChangedEvent
     * @static
     * @param {ITextChangedEvent} message TextChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TextChangedEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.orderedOperations != null && message.hasOwnProperty("orderedOperations"))
            $root.OrderedOperations.encode(message.orderedOperations, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified TextChangedEvent message, length delimited. Does not implicitly {@link TextChangedEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TextChangedEvent
     * @static
     * @param {ITextChangedEvent} message TextChangedEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TextChangedEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TextChangedEvent message from the specified reader or buffer.
     * @function decode
     * @memberof TextChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TextChangedEvent} TextChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TextChangedEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TextChangedEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.orderedOperations = $root.OrderedOperations.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TextChangedEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TextChangedEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TextChangedEvent} TextChangedEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TextChangedEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TextChangedEvent message.
     * @function verify
     * @memberof TextChangedEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TextChangedEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.orderedOperations != null && message.hasOwnProperty("orderedOperations")) {
            var error = $root.OrderedOperations.verify(message.orderedOperations);
            if (error)
                return "orderedOperations." + error;
        }
        return null;
    };

    /**
     * Creates a TextChangedEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TextChangedEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TextChangedEvent} TextChangedEvent
     */
    TextChangedEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.TextChangedEvent)
            return object;
        var message = new $root.TextChangedEvent();
        if (object.orderedOperations != null) {
            if (typeof object.orderedOperations !== "object")
                throw TypeError(".TextChangedEvent.orderedOperations: object expected");
            message.orderedOperations = $root.OrderedOperations.fromObject(object.orderedOperations);
        }
        return message;
    };

    /**
     * Creates a plain object from a TextChangedEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TextChangedEvent
     * @static
     * @param {TextChangedEvent} message TextChangedEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TextChangedEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.orderedOperations = null;
        if (message.orderedOperations != null && message.hasOwnProperty("orderedOperations"))
            object.orderedOperations = $root.OrderedOperations.toObject(message.orderedOperations, options);
        return object;
    };

    /**
     * Converts this TextChangedEvent to JSON.
     * @function toJSON
     * @memberof TextChangedEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TextChangedEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TextChangedEvent;
})();

$root.Event = (function() {

    /**
     * Properties of an Event.
     * @exports IEvent
     * @interface IEvent
     * @property {ITextChangedEvent} [textChanged] Event textChanged
     */

    /**
     * Constructs a new Event.
     * @exports Event
     * @classdesc Represents an Event.
     * @constructor
     * @param {IEvent=} [properties] Properties to set
     */
    function Event(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Event textChanged.
     * @member {(ITextChangedEvent|null|undefined)}textChanged
     * @memberof Event
     * @instance
     */
    Event.prototype.textChanged = null;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * Event type.
     * @member {string|undefined} type
     * @memberof Event
     * @instance
     */
    Object.defineProperty(Event.prototype, "type", {
        get: $util.oneOfGetter($oneOfFields = ["textChanged"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof Event
     * @static
     * @param {IEvent=} [properties] Properties to set
     * @returns {Event} Event instance
     */
    Event.create = function create(properties) {
        return new Event(properties);
    };

    /**
     * Encodes the specified Event message. Does not implicitly {@link Event.verify|verify} messages.
     * @function encode
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.textChanged != null && message.hasOwnProperty("textChanged"))
            $root.TextChangedEvent.encode(message.textChanged, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Event
     * @static
     * @param {IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Event();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.textChanged = $root.TextChangedEvent.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        var properties = {};
        if (message.textChanged != null && message.hasOwnProperty("textChanged")) {
            properties.type = 1;
            var error = $root.TextChangedEvent.verify(message.textChanged);
            if (error)
                return "textChanged." + error;
        }
        return null;
    };

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Event} Event
     */
    Event.fromObject = function fromObject(object) {
        if (object instanceof $root.Event)
            return object;
        var message = new $root.Event();
        if (object.textChanged != null) {
            if (typeof object.textChanged !== "object")
                throw TypeError(".Event.textChanged: object expected");
            message.textChanged = $root.TextChangedEvent.fromObject(object.textChanged);
        }
        return message;
    };

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Event
     * @static
     * @param {Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (message.textChanged != null && message.hasOwnProperty("textChanged")) {
            object.textChanged = $root.TextChangedEvent.toObject(message.textChanged, options);
            if (options.oneofs)
                object.type = "textChanged";
        }
        return object;
    };

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Event;
})();

module.exports = $root;
