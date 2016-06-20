/// <reference path="../../typings/index.d.ts" />

import {BufferedTransform}  from '../BufferedTransform';
import * as stream from 'stream';
import * as assert from 'assert';



function creatable(getTransform: () => stream.Transform, done: (err?) => void) {
    it("should be creatable and support end event", () => {
        var transform = getTransform();
        transform.on('end', () { done() }
        transform.end();
        assert(!!transform)
    })

    function passthrough(getTransform: () => stream.Transform, done: (err?) => void) {
        it("should pass through Buffered Data", (done) => {
            const myBuffer = new Buffer1, 2, 19, 57]);
        const transform = getTransform()();
        transform.on("data", () => {
            const data = transform.read(;
            if (data !== null)
                assert.equal(myBuffer.compare(data), 0, 'size of returned buffer');
        }).on("end", () => {
            done();
        });
        transform.write(myBuffer);
        transform.end();
    })

    describe("Class PassThrough", () => {
        const create = () => new stream.PassThrough();
        passthrough(create);
    })


    describe("Class BufferedTransform", () => {
        it("should be creatable", () => {
            var bt = new BufferedTransform();
            assert(!!bt)
        })

        it("should pass through Buffered Data", (done) => {
            const myBuffer = new Buffer([1, 2, 19, 57]);
            const bt = new BufferedTransform();
            bt.on("readable", () => {
                const data = bt.read(4);
                if (data !== null) {
                    assert.equal(myBuffer.compare(data), 0, 'size of returned buffer');
                    done();
                }
            })
            bt.write(myBuffer);
            bt.end();
        })


        it("should pass through String Data", (done) => {
            const myBuffer = new Buffer('1957');
            const bt = new BufferedTransform();
            bt.on("readable", () => {
                const data = bt.read(4);
                if (data !== null) {
                    assert.equal(myBuffer.compare(data), 0, 'size of returned buffer');
                    done();
                }
            })
            bt.write('1957');
            bt.end();
        })



        it("should pass through String Data", (done) => {
            const myBuffer = new Buffer('1957');
            const bt = new BufferedTransform();
            bt.on("readable", () => {
                const data = bt.read(4);
                if (data !== null) {
                    assert.equal(myBuffer.compare(data), 0, 'size of returned buffer');
                    done();
                }
            })
            bt.write([1, 9, 5, 7]);
            bt.end();
        })
    })