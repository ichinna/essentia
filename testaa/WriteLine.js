// import './lineReader.js';
var readLine = require('readline');

function readLines(file) {

    var lineRealrer = readLine.createInterface({
        input: require('fs').createReadStream(file)
    });


    return new Promise((resolve, reject) => {

        var lines = [];
        lineRealrer.on('line', function (line) {
            if (line !== "") {
                let splits = line.split('/');
                line += ` >> /Users/sandeep/circleCi/${splits[1].trim()}.txt`;

                lines.push(line);
            }
        });
        setTimeout(() => {
            resolve(lines);
        }, 5000);
    })
};


// >> /Users/sandeep/circleCi/${splits[1]}.txt



let ls = readLines('/Users/chinnababusadam/Desktop/lines.txt').then(r => console.log(r));

// console.log(ls);
