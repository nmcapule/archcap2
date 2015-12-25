+++
Categories = ["showcase"]
Tags = ["showcase", "javascript"]
date = "2015-12-25T13:55:49+08:00"
title = "morse"

+++

> A simple morse code converter script

When I was dabbling in javascript, this is one of the first codes that I made. Sadly, the previous code has been lost in the oblivion of deleted blogspot sites. More than 5 years later, here's an iteration.

<!--more-->

{{< script "/js/morse.js" >}}
{{< verbatim >}}
<div>
  <label for="normal-input">Normal</label>
  <input type="text" id="normal-input" onkeyup="toMorse()"/>
</div>
<div>
  <label for="morse-input">Morse</label>
  <input type="text" id="morse-input" onkeyup="toNormal()"/>
</div>

<script type="text/javascript">
  var morseInput = document.getElementById('morse-input');
  var normalInput = document.getElementById('normal-input');

  function toNormal() {
    normalInput.value = morse.decode(morseInput.value);
  }

  function toMorse() {
    morseInput.value = morse.encode(normalInput.value);
  }
</script>
{{< /verbatim >}}

I'm very proud of the [code](/js/morse.js) for this one when compared to the code I made years before. 