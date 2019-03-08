var readLine = require('readline');

export function readLines(file) {

  var lineRealrer = readLine.createInterface({
    input: require('fs').createReadStream(file)
  });
  var lines = [];
  lineRealrer.on('line', function (line) {
    if (line !== "") {
      lines.push(line);
    }
  });
  return lines;
};

