const request = require('./util/request');
var cron = require('node-cron');
let getLbDocForKey = (elementId, writeFlag) => {

    let query = { force: true };

    let headers = {
        'Authorization': 'User stRiFjlMO9uq5GlScHZ0bfyJw6M7zBMs1MYjLYXLRgs=, Organization 188b228ebfb42861b44996eb230d1100',
        'Accept': 'application/json'
    };
    let requestUrl = `http://localhost:7070/elements/api-v2/elements/${elementId}/lbdocs`;
    return new Promise((resolve, reject) => {
        request.get(requestUrl, query, headers, (error, resp) => {
            // console.log(`Calling GET ${requestUrl}`);
            if (error === null) {
                if (writeFlag) {
                    var fs = require('fs');
                    if (Object.keys(resp).length >= 4) {
                        fs.writeFileSync(`${__dirname}/write/myTest/${elementId}.json`, JSON.stringify(resp, null, 4), 'utf8');
                        resolve(`fulfilled ${elementId}`);
                    } else {
                        var reason = new Error(`Fucking element ${elementId}`);
                        reject(elementId);
                    }
                } else {
                    console.log(JSON.stringify(resp));
                }
            } else {
                console.warn(`Call to GET ${requestUrl} has failed\nResponse: ${JSON.stringify(resp)}\nRequest Headers: ${JSON.stringify(headers)}`);
                // throw new Error(error);
                var reason = new Error(`Fucking element ${elementId}`);
                reject(elementId);
            }
        });
    });
};


let how = (id) => {
    setTimeout(() => { console.log(id) }
        , 5000);
};
// [281, 
var ids = [281, 134, 107, 44, 30, 183, 61, 168, 247, 333, 275, 184, 306, 88, 43, 100, 283, 1, 45, 58, 29, 353, 372, 82, 334, 352, 175, 41, 135, 167, 39, 368, 122, 190, 195, 295, 289, 305, 397];


var i = 0;
var id;
var task = cron.schedule('*/5 * * * * *', () => {
    id = ids[i];
    getLbDocForKey(id, true).then(r => console.log(` => ${r} @ ${new Date().toISOString()} `)).catch(error => console.log(` => ********* Failed for ${error} @ ${new Date().toISOString()} `));
    i++;
});

task.start();