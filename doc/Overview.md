<style>
samp { margin:5px; font-size:12pt; color:white; background:#2020a0; padding-left:2pt; padding-right:2pt;}
samp code { color:goldenrod; text-decoration:underline; margin-left:2pt; margin-right:2pt;}
</style>

# Overview of UIF-8 Format

UIF-8 is a higher-level protocol that extends UTF-8 with capabilities for compactly representing rich data structures without in any way changing how UTF-8 represents text.  The primitive values are generally represented as UTF-8 strings, but UIF-8 leverages several coded byte sequences would be non-conforming under UTF-8 to delimit and annotate the structure of the data.   As a result UIF-8 data is often a mix of printable Unicode characters, and certain noncharacter codes that can't be represented as plain text.    

In documenting such a format, we want visual representation of the noncharacter codes, so we identify them with mnemonics and a distinct visual appearance.   For example the three-character string "cat" might be delimited with a non-character seperator `S0`, and appear in an example as <samp>abc`S0`</samp>.  Since we've assigned `S0` the single-byte non-character code with the hexidecimal value FF, the actual byte sequence would be < 61 62 63 FF >.

Another sample:

<samp>`BLOB 0 100`</samp>


   that are non-conforming under 
defining semantics for the code bytes that UTF-8 treats as invalid. These invalid UTF codes are treated in UIF-8 as information ***seperators*** and ***sigils***, much as JSON treats characters like '`{`', '`}`', '`[`', '`]`', and '`,`'.   Because UIF-8 uses coded values that can never occur in UTF-8 in place of these common ASCII charcters, UIF-8 never needs ***quotes*** or ***escapes*** like JSON's `"` or `\` .   One set of encoded values that can never occur in UTF-8 data are bytes with the hexadecimal value of `F5` - `FF`.

## Document conventions

Because the UIF-8 format mixes printable character strings with unprintable information structure codes, it's not possible to clearly represent data in this format with simple text.   Instead, we will use mnemonic codes that represent the the unprintable seperators and sigils

## Seperators 

UIF-8 allocates these codes to be used as information seperators, allowing it to unambigiously impose structure on data consisting primarly of Unicode characters.   

For notational simplicity, this document refers to these information seperators using similar to those for applied to certain [Control Characters](https://en.wikipedia.org/wiki/Control_character) mnemonics orginally defined in ASCII, such as `S0`, `S1`, `S2`, `S3` and `Sx` ...  In reading this document, it is important to remember these mnemonics do not represent the ASCII/Unicode control characters in the range `U+0000`-`U+001F`.  This allows UIF-8 to include *any* valid ASCII string to be represented literally without extra processing, even those containing control characters such as those containing ASCII `CR`, `LF`, `TAB`,or even `NUL`.

<table>
<tr><th>Hex code<td>F5<td>F6<td>F7<td>F8<td>F9<td>FA<td>FB<td>FC<td>FD<td>FE<td>FF</td>
<tr><th>Mnemonic<td>\*<td>\*<td>\*<td>\*<td>\*<td>\*<td>`Sx`<td>`S3`<td>`S2`<td>`S1`<td>`S0` 
</table>
\* reserved value.

Most common of these information seperators will be `S0` (String Terminator) and `S1` (Information Seperator 1). These, like any of the seperator codes, always terminate a UTF-8 text string.   As an example the values of a list of three single-digit numbers might be encoded in only six bytes with the hexidecimal values: 31 FF 32 FF 33 FE, which we will represent using mnemonics in this document as <samp>1`S0`2`S0`3`S1`</samp>    

  

  

    