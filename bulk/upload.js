/**
 * How to run it???
 * 
 * node viaApi.js -c '{"baseUrl":"http://localhost:8080/elements/api-v2","authorization":"User XXXXXX, Organization XXXXXX, Element XXXXXXXX=","objectName":"sfdcAccounts"}'

 */
const sleep = require('sleep');
const rp = require('request-promise');
var fs = require('fs')
const args = require('minimist')(process.argv.slice(2));
if (!(args && args.c)) {
    console.warn("Yoo boy.... put some data in there with command line arg '-c'!  Like authorization, objectName, and baseUrl as a JSONObject");
    process.exit(-1);
}

var creds = JSON.parse(args.c);
if (!creds.hasOwnProperty("baseUrl") || !creds.hasOwnProperty('authorization') || !creds.hasOwnProperty('objectName')) {
    console.warn('Missing one of Authorization, baseUrl, objectName');
    process.exit(-1);
}


var objectName = creds.objectName;
var authorization = creds.authorization;
var url = creds.baseUrl;

var writer = fs.createWriteStream(`./data/${objectName}.txt`, {
    flags: 'w' // 'a' means appending (old data will be preserved)
})

var nextPage = null;

const safeSleep = secs => {
    sleep.sleep(secs);
}
//where: "incremental='true' and start_time='1389743940'",
const buildOptions = () => {
    return {
        uri: `${url}/${objectName}`,
        method: 'POST',
        body: {
            name: Math.random().toString(36).substring(7)
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': authorization
        },
        json: true,
        resolveWithFullResponse: true,
    };
}
var start = null, count = 1;
/**
 * Runs untill last page and writes each page into the specified file...
 */
const run = async () => {
    // safeSleep(10);
    await rp(buildOptions())
        .then((r) => {

            console.log(r.statusCode + " -- " + JSON.stringify(r.body));

            if (count < 300) {
                count++
                run();
            } else {
                console.log('Time taken to finish bulk via API calls: ', (new Date().getTime() - start));
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
start = new Date().getTime();
run();

