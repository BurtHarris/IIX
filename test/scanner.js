"use strict";
var U_Code;
(function (U_Code) {
    U_Code[U_Code["TRAILING"] = 128] = "TRAILING";
    U_Code[U_Code["LEADING"] = 194] = "LEADING";
    U_Code[U_Code["TERMINATING"] = 245] = "TERMINATING";
})(U_Code || (U_Code = {}));
var ScannerState;
(function (ScannerState) {
    ScannerState[ScannerState["START"] = 0] = "START";
    ScannerState[ScannerState["UTF_8"] = 1] = "UTF_8";
    ScannerState[ScannerState["LEADING"] = 2] = "LEADING";
    ScannerState[ScannerState["OVERLONG"] = 3] = "OVERLONG";
    ScannerState[ScannerState["HIGH"] = 4] = "HIGH";
    ScannerState[ScannerState["EOF"] = 5] = "EOF";
    ScannerState[ScannerState["Sx"] = 251] = "Sx";
    ScannerState[ScannerState["S3"] = 252] = "S3";
    ScannerState[ScannerState["S2"] = 253] = "S2";
    ScannerState[ScannerState["S1"] = 254] = "S1";
})(ScannerState || (ScannerState = {}));
var Scanner = (function () {
    function Scanner(buffer) {
        this.offset = 0;
        this.tokenCount = 0;
        this.tokenOffsets = [];
        this.tokenTypes = [];
        this.buffer = buffer;
    }
    Scanner.prototype.scan = function () {
        var state = ScannerState.START;
        var buffer = this.buffer;
        for (var offset = this.offset; offset < buffer.length; offset++) {
            var code = buffer[offset];
            // At the beginning of any field, the code determines the next state
            if (state == ScannerState.START) {
                if (code < 0x80) {
                    state = ScannerState.UTF_8;
                }
                else if (code < 0xC0) {
                    state = ScannerState.LEADING;
                }
                else if (code < 0xC2) {
                    state = ScannerState.OVERLONG;
                }
                else if (code < 0xF5) {
                    state = ScannerState.UTF_8;
                }
                else {
                    state = ScannerState.HIGH;
                }
                this.tokenOffsets.push(offset);
                this.tokenTypes.push(state);
            }
            switch (state) {
                case ScannerState.UTF_8:
                    if (code < 0xF5) {
                        continue;
                    }
                    else {
                        if (code < 0xFF) {
                            this.tokenOffsets.push(offset + 1);
                            this.tokenTypes.push(code);
                        }
                        state = ScannerState.START;
                    }
                // Fall through
                case ScannerState.START:
                    break;
                default:
                    console.assert(false, "unimplemented ScannerState");
                    break;
            }
        }
        this.offset = offset;
        this.tokenCount = this.tokenOffsets.length;
        this.tokenOffsets.push(offset + 1);
        this.tokenTypes.push(ScannerState.EOF); // end of file
    };
    Scanner.prototype.getValue = function (index) {
        switch (this.tokenTypes[index]) {
            case ScannerState.UTF_8:
                return this.buffer.toString(null, this.tokenOffsets[index], this.tokenOffsets[index + 1] - 1);
        }
        return "";
    };
    Scanner.prototype.getTypeName = function (index) {
        return ScannerState[this.tokenTypes[index]];
    };
    return Scanner;
}());
exports.Scanner = Scanner;
