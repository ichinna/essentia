var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/Users/chinnababusadam/Desktop/sage.txt')
});

lineReader.on('line', function (line) {
  console.log(`"${line}",`);
});