const rp = require('request-promise');
const chalk = require('chalk');
// const args = require('minimist')(process.argv.slice(2));
// if (!args || !args.accounts) {
//     throw "pass accounts as argument";
// }
// let accounts = JSON.parse(args.accounts);

/**
 * 
 * curl --location --request POST 'https://snapshot.cloud-elements.com/elements/api-v2/formulas/context' \
--header 'Authorization: User LVc3bSTCkvpmnu1mmkGzOCZ3VEgXjJE0+uyDlorwawk=, Organization 589f81848b13fe777edee74dddfeb1b5' \
--header 'x-consumer-id: 123' \
--header 'Content-Type: application/json' \
--data-raw '{
    "formulaExecutionId": 14629930

}'
 */
// let totalTime = 0, milliTotal = 0;
// let current = 0, diff = 0;
let start = 0;
const doGet = async () => {
    let options = {
        method: 'GET',
        uri: 'http://localhost:8080/elements/api-v2/formulas/steps/debug/Zm9ybXVsYUlkOjI2OC1mb3JtdWxhSW5zdGFuY2VJZDoyMTctZm9ybXVsYVN0ZXBJZDozMDc1',
        headers: {
            Authorization: 'User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca',
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        
        resolveWithFullResponse: true
    };
    start = Date.now();
    await rp(options)
        .then(r => {
            // if (r.statusCode >= 200 || r.statusCode < 300) {
            //     console.log(`Response code for request ${count} : ${r.statusCode}`);
            // } else {
            //     console.log(`Response code for request ${count} : ${r.statusCode}`);
            // }
            console.log(`Response code for request ${count} : ${r.statusCode} -`);
        })
        .catch(err => console.log(err));
}

let count = 0;
const run = async () => {
    await doGet();
    count++;
    if (count == 100) {

    }
    if (count < 100) {
        await run();
    }
}

run();