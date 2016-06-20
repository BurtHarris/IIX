# DRAFT: IIX: Internet Information eXchange  

*Copyright 2016 by Burt Harris, published under the [Apache-2.0 License](LICENSE).*

This project defines **IIX**, a new flexible byte-oriented sesson layer protocol 
(fitting well into level 6 of the OSI model.)   Another way of thinking about it is that 
IIX is [information serialization] format optimized for synergy with [UTF-8](https://en.wikipedia.org/wiki/UTF-8) 
character string encoding, and its language independent, its been designed to work well with 
for modern JavaScript implementations found in web browsers.   The intended to fit into 
machine-to-machine communications, information storage, and synchronization scenarios 
similar to how [JSON](https://en.wikipedia.org/wiki/JSON) is used today.   

IIX uses a syntax focused on represented information compactly and efficently. Contrasting
it to JSON, IIX wasn't designed to be directly compatible with plain text editors or tools.
The primary use case is machine-to-machine, which permits different efficencies through 
elimination of quoting and escaping overhead in encoding and decoding strings.  
Instead of visible punctuation, IIX uses encoded byte sequences that UTF-8 can never generate
as the means of imposing structure, thus content characters like brackets, commas, quotes
don't need special treatment.

IIX goes beyond the capabilities of UTF-8 and JSON by borrowing *concepts* from other modern and mature knowledge representation standards like:

 - Tabular data like [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) format
 - Compact URIs from [CURIE](https://en.wikipedia.org/wiki/CURIE), 
 - Language-neutral 'data type' information similar to [JSON Schema](http://json-schema.org/) and/or [YAML ***!tag***](http://www.yaml.org/spec/1.2/spec.html#id2784064) properties.

... but rather than simply encorporating these formats blindly, IIX adopts an approach of 
assiging encodings that can never conflict with UTF-8 encoding, and which allows for straightforward
non-extractive scanning, parsing and encoding into native data types.

A short bit of history
----------------------

Over 50 years ago, in 1963, the way computers represent charactars was changed in a way that is 
still important today: the American Standard Code for Information Interchange (ASCII).   ASCII
lives on today, and for the forseeable future as the first 128 characters of Unicode.   At the time
ASCII was published, most computers non-standard character repreentations, typicaly using 6 bits 
per character.   ASCII to a step forward, advancing the proposition that in only 7-bits was enough to encode any the 
characters commonly used in American English, including both upper and lower case alphabets,
digits and punctuation with *room to spare*.    That extra space in the ASCII chart was 
allocated to **control charactars** with hex values 00-1F and 7F.   Of those 33 control 
characters, only 3 (
[TAB](https://en.wikipedia.org/wiki/Tab_key#Tab_characters), 
[CR](https://en.wikipedia.org/wiki/Carriage_return), and 
[LF](https://en.wikipedia.org/wiki/Newline)) 
are found in files today, with only a few more receiving some arguablly standard, 
but far from universal, uses (e.g. 
[BEL](https://en.wikipedia.org/wiki/Bell_character), 
[ESC](https://en.wikipedia.org/wiki/Escape_character), and just maybe 
[NUL](https://en.wikipedia.org/wiki/Null_character).)   

The remaining 27 control characters, go virtually unused today.  A large part of this is due to the development of 
better concepts, like layered protocols, protocol tranparency, 8-bit characters sets, and 
eventually Unicode (which incoporated the ASCII C0 control charactars without attempting
to further define them.)   In the context of information represenation, the four **information seperators** 
characters at the end of the primary control C0 block never really caught on, perhaps because 
the assigned meanings    

   four interesting but 
rarely ASCII control characters were assigned to the ASCII category of 
**information seperators**, those with the hex values of 1C-1D, followed by the non-control 
character SPACE (20).           
