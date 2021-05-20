const fs = require('fs')

/**
 * Reads the data from the given file name
 * @param {*} name 
 */
const read = name => fs.readFileSync(name, 'utf8', (err, data) => {
    if (err) {
        console.log("File read failed:", err)
        return;
    }
    return data;
});

/**
 * Writes data to given file name
 * @param {*} name 
 * @param {*} data 
 */
const write = (name, data) => fs.createWriteStream(name, { flags: 'w' }).write(data);

module.exports = {
    read,
    write
}

