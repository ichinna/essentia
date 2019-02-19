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

function post(path, body, headers, callback) {
    unirest.post(path)
    .send(body)
    .headers(headers)
    .end(response => {
        if (response.error) {
            console.warn('POST error', response.error)
            callback(response.error, response.body)
        } else {
            callback(null, response.body)
        }
    })
}

module.exports = {
    get: get,
    post: post
};