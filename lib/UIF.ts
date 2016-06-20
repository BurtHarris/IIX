/// <reference path="../typings/index.d.ts"/>

import * as stream from 'stream';
const Code = require('./code');

const DEFAULT_BLOCK_SIZE = 8192;
const MIN_BLOCK_SIZE = 16;

class BufferedTransform extends stream.Transform {
    protected _continue: boolean = true;
    private _blockSize: number
    private _index: number;
    private _buffer: Buffer;

    constructor(opts) {
        super(opts);
        this._blockSize = DEFAULT_BLOCK_SIZE;
        this._index = 0;
    }

    _flush() {
        this.reset(0);
    }

    /** 
     * Return a buffer with at least size bytes available
     *  @param {number} size - requested size in bytes
     *  If size == 0, this forces a flush of the internal buffer.
     *  If this function returns null, the buffer has been flushed,
     *  but the requested size exceeds the maximum block size, caller should 
     *  allocate a buffer directly from Buffer, and push it when done. 
     *  is it is the caller should get the buffer by other means
     */

    protected reset(size?: number): Buffer {
        if (!size) { size = 0; }
        let buffer = this._buffer;
        let index = this._index;
        let remaining = buffer ? buffer.length - index : 0;

        // If not flushing and existing buffer works, return it
        if (size && remaining >= size) {
            return buffer;
        }

        if (size == 0 && buffer && index) {
            this._continue = super.push(buffer.slice(0, index));
            if (remaining > size) {
                this._buffer = buffer = this._buffer.slice(index);
                this._index = 0;
                return buffer;
            }
            else {
                this._buffer = buffer = null;
                this._index = -1;
            }
        }

        if (size && !buffer) {
            if (size + 1 >= this._blockSize) {
                return null;  // Indicate caller should deal with their own large buffer
            }

            this._buffer = buffer = new Buffer(this._blockSize);
            this._index = 0;
        }
        return buffer;
    }


    pushByte(byte: number): void {
        let value = byte & 0xFF;
        if (value !== byte) {
            throw new RangeError("Not a byte: " + byte);
        }
        let i: number, buffer = this.reset(1);
        buffer[i = this._index++] = value;
        if (i >= buffer.length) {
            this.reset(0);
        }
    }

    push(chunk: any, encoding?: string): boolean {
        let buffer: Buffer;
        let type = typeof chunk;
        let bytecount: number;

        switch (type) {

            case 'string':
                bytecount = Buffer.byteLength(chunk, encoding);
                if (buffer = this.reset(bytecount)) {
                    this._index += buffer.write(chunk, this._index, bytecount, "utf8");
                } else {
                    this._continue = super.push(new Buffer(chunk))
                }
                break;
            case 'object':
                if (Buffer.isBuffer(chunk)) {
                    bytecount = chunk.length;
                    if (buffer = this.reset(bytecount)) {
                        (<Buffer>chunk).copy(buffer, this._index);
                        this._index += bytecount;
                    } else {
                        this._continue = super.push(chunk);
                    }
                } else if (Array.isArray(chunk)) {
                    bytecount = chunk.length;
                    let index = this._index;
                    if (buffer = this.reset(bytecount)) {
                        for (let i = 0; i < bytecount; i++) {
                            buffer[index + i] = chunk[i];
                        }
                        this._index = index;
                    } else {
                        this._continue = super.push(new Buffer(chunk));
                    }
                } else {
                    throw new TypeError("chunk must be a string, number, buffer, or array of numbers, ")
                }
        }
        return this._continue;
    }
}

export class Serializer extends BufferedTransform {
    protected _terminator: number;
    private _stringMap = new WeakMap<string,number>();
    private _stringID = 0;

    constructor(options?: stream.TransformOptions) {
        super(Serializer.optionFixup(options));
    }

    static optionFixup(options?: stream.TransformOptions): stream.TransformOptions {
        if (!options) {
            return { objectMode: true };
        }
        options.objectMode = true;
        return options;
    }

    _flush() {
        if (this._terminator) {
            this.pushByte(this._terminator);
            this._terminator = 0;
        }
        super._flush();
    }

    _transform(chunk: any, encoding: string, callback: Function): void {
        try {
            this._encode(chunk);
            callback();
        } catch (err) {
            callback(err);
        }
        this._terminator = Code.ETX;
        this._flush();
    }

    _encode(chunk: any) {
        let err = null;

        // Write any pending terminator
        if (this._terminator) {
            this.pushByte(this._terminator);
            this._terminator = null;
        }

        switch (typeof chunk) {
            case 'string': {
                let stringID: number; 

                if (undefined !== (stringID = this._stringMap[chunk])) {
                    // Already seen, just reference the previous value
                    this.pushVInt( Code.STRREF, stringID );
                } else {
                    // assign this string a new ID
                    this._stringMap[chunk] = this._stringID++;
                    this.push(chunk);
                    this._terminator = Code.ST;
                }
                break;
            }
            case 'number': {
                switch (chunk) {
                    case 0:
                    case 1:
                    case 2:
                    case -1:
                    case -2:
                        this.pushByte(Code.ZERO + chunk);
                        break;
                    default:
                        if (chunk < 0) {
                            if (this.pushVInt(Code.NEG, -chunk)) {
                                break;
                            }
                        } else {
                            if (this.pushVInt(Code.POS, chunk)) {
                                break;
                            }
                        }
                        this.pushByte(Code.DECIMAL);
                        this.push(chunk.toString());
                        this._terminator = Code.ST;
                        break;
                }
                break;
            }
            case 'object': {
                if (Array.isArray(chunk)) {
                    let length = chunk.length;
                    this.pushByte(Code.ARRAY);
                    for (let i = 0; i < length; i++) {
                        this._encode(chunk[i])
                    }
                    // TODO: optimize multi-level ENDs
                    this._terminator = Code.OT;
                    break;
                }
            }
            default: {
                throw new Error(
                    `Unable to encode type ${typeof chunk} - ${chunk.toString()}`
                );
            }
        }

    }

    protected pushVInt(code: number, value: number): boolean {
        let i: number = value | 0;
        if (i != value) return false;
        if (i < 0) throw new TypeError("Vints are unsigned");
        if ((i & 0x7fffffff) !== i)
            return false;

        this.pushByte(code);
        if (i > 0xfffffff)
            this.pushByte((i >> 4 * 7) & 0x7F);
        if (i > 0x1fffff)
            this.pushByte((i >> 3 * 7) & 0x7F);
        if (i > 0x3fff)
            this.pushByte((i >> 2 * 7) & 0x7F);
        if (i > 0x7f)
            this.pushByte((i >> 7) & 0x7F);
        this.pushByte(0x80 | (i & 0x7F));
        return true;
    }

    protected static keys(o) {
        var result = [];
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                result.push(k);
            }
        }
        return result;
    }
}

var ser = new Serializer();

ser.on('readable', () => {
    var chunk : Buffer;
    while (null != (chunk = ser.read())) {
        console.log(chunk);
    }
});

// ser.pipe(process.stdout);

ser.on('finish', () => {
    console.log("finish");
    process.exit(1);
})
ser.on('end', () => {
    console.log("end");
    process.exit(1);
})

function test( chunk ) {
    console.log('----');
    console.log(JSON.stringify(chunk));
    ser.write(chunk)
}

test([0, "one", "two", "three", 0, "one" ])

//ser.write([0x40, 0x80, 0x100, 0x200, 0x400, 0x800, 0x1000, 0x2000, 0x4000, 0x8000 ]);
ser.end();


