

enum U_Code {
    TRAILING = 0x80,
    LEADING = 0xC2,
    TERMINATING = 0xF5,
}

enum ScannerState {
    START=-2,
    EOF=-1,
    UTF_8=0,
    LEADING,
    OVERLONG,
    HIGH,
    Sx = 0xFB, S3, S2, S1
}

class Scanner {

    buffer: Buffer;
    offset: number = 0;
    tokenCount: number = 0;
    tokenOffsets: number[] = [];
    tokenTypes: ScannerState[] = [];

    constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    scan() {

        var state = ScannerState.START;
        var buffer = this.buffer;

        for (var offset = this.offset; offset < buffer.length; offset++) {
            var code: number = buffer[offset];

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
                    } else {
                        if (code < 0xFF){
                            this.tokenOffsets.push(offset+1);
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
        this.tokenOffsets.push(offset+1);
        this.tokenTypes.push(ScannerState.EOF); // end of file
    }

    getValue(index:number) {
        switch (this.tokenTypes[index]) {
            case ScannerState.UTF_8:
                return this.buffer.toString( null, this.tokenOffsets[index], this.tokenOffsets[index+1]-1)
        }
        return "";
    }

    getTypeName(index:number) { 
        return ScannerState[this.tokenTypes[index]];
    }

}

export { Scanner };