# DRAFT: UIF-8: Universial Information Format 8 

*Copyright 2016 by Burt Harris, published under the [MIT License](LICENSE).*

This project defines **UIF-8**, a new flexible byte-oriented [information serialization] format optimized for modern JavaScript implementations and machine-to-machine communications, storage, and synchronization scenarios. This new format builds the solid foundation of [UTF-8](https://en.wikipedia.org/wiki/UTF-8), extending it to support [JSON](https://en.wikipedia.org/wiki/JSON) like structures to be represented compactly and efficently. But unlike JSON, UIF-8 isn't designed to be directly compatible with plain text formate, gaining its efficencies through utilization of codes that UTF-8 treats as invalid.

UIF-8 goes beyond the capabilities of UTF-8 and JSON by borrowing *concepts* from other modern and mature knowledge representation standards like:

 - Tabular data like [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) format
 - Compact URIs from [CURIE](https://en.wikipedia.org/wiki/CURIE), 
 - Language-neutral 'data type' information similar to [JSON Schema](http://json-schema.org/) and/or [YAML ***!tag***](http://www.yaml.org/spec/1.2/spec.html#id2784064) properties.
