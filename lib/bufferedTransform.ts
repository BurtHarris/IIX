/// <reference path="../typings/index.d.ts"/>

import * as stream from 'stream';
const Code = require('./code');

const DEFAULT_BLOCK_SIZE = 8192;
const MIN_BLOCK_SIZE = 16;

export class BufferedTransform extends stream.Transform {
    protected _continue: boolean = true;
    private _blockSize: number
    private _index: number;
    private _buffer: Buffer;

    constructor(opts?) {
        super(opts);
        this._blockSize = DEFAULT_BLOCK_SIZE;
        this._index = 0;
    }

    _flush(callback: Function) {
        this.reset(0);
        callback();
    }

    _transform(chunk: any, encoding: string, callback: Function) {
        this.push(chunk);
        callback();
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

        if (chunk !== null) {

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
        }
        return this._continue;
    }
}
