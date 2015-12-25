var morse = {};

morse.MAP = {
  'a': '.-',
  'b': '-...',
  'c': '-.-.',
  'd': '-..',
  'e': '.',
  'f': '..-.',
  'g': '--.',
  'h': '....',
  'i': '..',
  'j': '.---',
  'k': '-.-',
  'l': '.-..',
  'm': '--',
  'n': '-.',
  'o': '---',
  'p': '.--.',
  'q': '--.-',
  'r': '.-.',
  's': '...',
  't': '-',
  'u': '..-',
  'v': '...-',
  'w': '.--',
  'x': '-..-',
  'y': '-.--',
  'z': '--..',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '0': '-----',
};

morse.encode = function (s) {
  var tokens = s.toLowerCase().split(' ');
  var result = tokens.map(function (token) {
    var innerResult = [];
    for (var i = 0; i < token.length; ++i) {
      var m = token[i];
      if (m in morse.MAP) {
        innerResult.push(morse.MAP[m]);
      }
    }

    return innerResult.join(' ');
  });

  return result.join(' / ');
};

morse.decode = function (ms) {
  var reverseMap = {};
  for (k in morse.MAP) {
    reverseMap[morse.MAP[k]] = k;
  }

  var tokens = ms.split(' ');
  var result = tokens.map(function (token) {
    if (token in reverseMap) {
      return reverseMap[token];
    } else if (token == '/') {
      return ' ';
    }
    return '';
  });

  return result.join('');
};