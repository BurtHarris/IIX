/// <reference path="../typings/globals/node/index.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var stream = require('stream');
var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo() {
        _super.apply(this, arguments);
    }
    Foo.prototype.greet = function () {
        console.log('greet');
    };
    return Foo;
}(stream.Transform));
exports.Foo = Foo;
console.log('loaded', __filename);
var x = new Foo();
x.greet();
