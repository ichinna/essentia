const unirest = require('unirest');

function get(path, query, headers, callback) {
    unirest.get(path)
        .query(query)
        .headers(headers)
        .end(response => {
            if (response.error) {
                console.warn('GET error', response.error)
                callback(response.error, response.body)
            } else {
                callback(null, response.body)
            }
        })
}


function returnData(theData) {
    return theData;
}


module.exports = {
    get: get
};