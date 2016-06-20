/// <reference path="../typings/index.d.ts"/>

export const enum Code {
    // Single-byte literal values
    ZERO = 0x80,
    POS1, POS2, NEG1, NEG2,
    UNKNOWN, NULL, TRUE, FALSE,


    // Augmented by a VarInt
    BLOB = 0x90, REF, POS, NEG, STRREF, 

    // Start tags
    ARRAY = 0xA0, OBJECT, DECIMAL,

    // Terminators
    ST = 0xFD, OT,
    ETX = 0xFF
}
