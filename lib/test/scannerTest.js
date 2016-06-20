"use strict";
const Scanner = require('../lib/scanner');
const fs = require("fs");
function testScanner(bytes) {
    var buffer = new Buffer(bytes);
    var writable = fs.createWriteStream(__dirname + "/testScanner.dat");
    writable.write(buffer);
    writable.end();
    var scanner = new Scanner.Scanner(buffer);
    scanner.scan();
    console.log(scanner);
    for (var i = 0; i < scanner.tokenCount; i++) {
        console.log(`- !${scanner.getTypeName(i)} ${scanner.getValue(i)}`);
    }
}
testScanner([0x31, 0x32, 0x33]);
testScanner([0x31, 0xFF, 0x32, 0xFF, 0x33, 0xFE]);
//# sourceMappingURL=scannerTest.js.map