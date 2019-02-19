var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/Users/chinnababusadam/Desktop/sample.txt')
});


var lines = ["id"];

lineReader.on('line', function (line) {
  if (line !== "") {
      
      lines.push(line);
  }


  console.log(lines.map(i => `"${i}"`).join(','));

});