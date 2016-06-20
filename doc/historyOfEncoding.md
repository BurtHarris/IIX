

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
