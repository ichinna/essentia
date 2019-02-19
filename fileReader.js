var fs = require('fs');
var files = fs.readdirSync('./XSD');

files.forEach(fileName => {
    console.log(`<xsd:include schemaLocation="${fileName}"/>`)
    // console.log(`/Users/chinnababu/Desktop/AMP/XSD/${fileName}`);
});