<style>
samp { background: #404040; margin:5px;  }
samp code { font-size-adjust: 0.5;}
</style>

UIF-8 extends UTF-8 by defining semantics for the code bytes that UTF-8 treats as invalid.  These invalid UTF codes are treated in UIF-8 as information *seperators* and *sigils*, much as JSON treats charcters like '`{`', '`}`', '`[`', '`]`', and '`,`'.   Because UIF-8 uses coded values that can never occur in UTF-8  in place of these common ASCII charcters, UIF-8 never needs  *quotes* or *escapes* like JSON's '`"`' or '`\`'. 

## Information Seperators (and terminators)
One set of encoded values that can never occur in UTF-8 data are bytes with the hexadecimal value of `F5` - `FF`.   UIF-8 allocates these codes to be used as information seperators, allowing it to unambigiously impose structure on data consisting primarly of Unicode characters.   

For notational simplicity, this document refers to these information seperators using similar to those for applied to certain [Control Characters](https://en.wikipedia.org/wiki/Control_character) mnemonics orginally defined in ASCII, such as `S0`, `S1`, `S2`, `S3` and `Sx` ...  In reading this document, it is important to remember these mnemonics do not represent the ASCII/Unicode control characters in the range `U+0000`-`U+001F`.  This allows UIF-8 to include *any* valid ASCII string to be represented literally without extra processing, even those containing control characters such as those containing ASCII `CR`, `LF`, `TAB`,or even `NUL`.

<table>
<tr><th>Hex code<td>F5<td>F6<td>F7<td>F8<td>F9<td>FA<td>FB<td>FC<td>FD<td>FE<td>FF</td>
<tr><th>Mnemonic<td>\*<td>\*<td>\*<td>\*<td>\*<td>\*<td>`Sx`<td>`S3`<td>`S2`<td>`S1`<td>`S0` 
</table>
\* reserved value.

Most common of these information seperators will be `S0` (String Terminator) and `S1` (Information Seperator 1). These, like any of the seperator codes, always terminate a UTF-8 text string.   As an example the values of a list of three single-digit numbers might be encoded in only six bytes with the hexidecimal values: 31 FF 32 FF 33 FE, which we will represent using mnemonics in this document as '<samp>1`S0`2`S0`3`S1`</samp>'     

  

  

    