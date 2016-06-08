import * as Scanner from './scanner';

function testScanner(bytes:any[]) {
    var buffer = new Buffer(bytes);
    var scanner = new Scanner.Scanner(buffer);
    scanner.scan();
    console.log(scanner);
    for (var i=0; i< scanner.tokenCount; i++ ) {
        console.log(`- !${scanner.getTypeName(i)} ${scanner.getValue(i)}`);
    }
}

testScanner([0x31, 0x32, 0x33]);

testScanner([0x31, 0xFF, 0x32, 0xFF, 0x33, 0xFE]);


