const jwt = require('jsonwebtoken');
// const config = require('./config');
const rp = require('request-promise');

const payload = {
    iss: 'BX1fO9MRQh2B0ZGT29tODQ',
    exp: ((new Date()).getTime() + 5000)
};

//Automatically creates header, and returns JWT
const token = jwt.sign(payload, 'VXGFTRCVQm3sN83w6iUUkj08lEhk6HiB');

console.log('token: ', token);
console.log();
console.log();
console.log();
// var options = {
//     uri: 'https://api.zoom.us/v2/users',
//     qs: {
//         status: 'active' // -> uri + '?status=active'
//     },
   
//     headers: {
//         'User-Agent': 'Zoom-Jwt-Request',
//         'content-type': 'application/json',
//         'Authorization': `bearer ${token}`
//     },
//     json: true // Automatically parses the JSON string in the response
// };
var options = {
    uri: 'https://api.zoom.us/v2/users',
    qs: {
        status: 'active' // -> uri + '?status=active'
    },
    // auth: {
    // 		'bearer': token
  	// },
    headers: {
        'User-Agent': 'Zoom-Jwt-Request',
        'content-type': 'application/json',
        'Authorization': `Bearer ${token}` 
    },
    json: true // Automatically parses the JSON string in the response
};

rp(options)
    .then(function (response) {
        console.log('User has', response);
    })
    .catch(function (err) {
        // API call failed...
        console.log('API call failed, reason ', err);
    });