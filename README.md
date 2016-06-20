# IIX: Internet Information eXchange  
![My sigil](doc/sigil-small.png)*  Copyright 2016 by Burt Harris,<br> published under the [Apache-2.0 License](LICENSE).*

This project defines **IIX**, a new flexible byte-oriented [sesson layer](https://en.wikipedia.org/wiki/Session_layer) protocol; or it can be considered a streaming information [serialization](https://en.wikipedia.org/wiki/Serialization) format optimized for synergy with [UTF-8](https://en.wikipedia.org/wiki/UTF-8) character string encoding.  IIX has been designed to work well with for modern JavaScript implementations found both in web browsers and the latest generation of host-based environents like Node.js.   Its binary format is intended for machine-to-machine communications, information storage, and synchronization scenarios where text based formats like XML or [JSON](https://en.wikipedia.org/wiki/JSON) is are used today.   

IIX uses a syntax focused on represented information compactly and efficently. Contrasting IIX to JSON, this new format wasn't designed to be directly compatible with plain text editors or tools.  The machine-to-machine primary scenario use case permits frugally leveraging the fully 8-bit transparent protocols used in the modern internet. Instead of visible punctuation like XML and JSON, IIX byte sequences that can never appear in UTF-8 as a way to extend it to represent information rather than just text.   Punctuation characters lik brackets, commas, quotes and spaces never  need special treatment.

# Extending UTF-8 into IIX

The well-defined structure of UTF-8 has certain explicit constraints which allow for it to be frugally extended, as illustrated by this chart: 

![UTF-8 code page](doc/UTF-8.png)

The IIX protocol starts with the following frugal assumptions for converting between *data* and *information*:

- All valid character data is encoded as UTF-8 with the lightly shaded codes above.
- ASCII characters (including controls) require only a single byte each, like UTF-8.
- Codes between hex C0 and C1 are used to encode substitution of earlier values.
- Codes between hex F5 and FF are used to encode information structure consisting of elements.
- Codes between hex 80 and BF, when used at the beginning of an element, introduce non-textual elements.

The highly regular structure of IIX allows for a highly efficent yet simple state machine scanner to efficently identify element boundries within a IIX bytestream.  The selection this representations allows for much of the scanning to be achieved using [Single Instruction Multiple Data (SIMD)](https://en.wikipedia.org/wiki/SIMD) instruction sets, even when implemented in high-level languages like modern JavaScript.  Design choice can lead to an order of magnitude reduction in the scanning time on modern processors, which have been optimized to include SIMD for streaming multimedia processing and other applicaitons.

# IIX goes beyond JSON

IIX goes beyond the capabilities of UTF-8 and JSON by borrowing *concepts* from other modern and mature knowledge representation standards like:

- Single byte representations of the most common non-textual values like **0, 1, true, false,** and **null**.

- Single byte introduction of the most common information structure elements like tabular data, lists/arrays, structures/objects, self-desribing schema, etc.  

- Self delimiting variable-length binary numbers, repeated values, object references, and schema references. 

- Length-prefixed BLOB data formats which can be skip-scanned.
 
But IIX doesn't simply incoroporate these formats blindly, IIX assigns each of the above a code in the IIX introducer range (hex 80 - BF).   These permit use of non-textual encodings that can never conflict with UTF-8.  For example within tabular data, the field names don't need to be repeated, and IIX terminators are used to delimit character/string values, so no characters never need to be treated specially.
