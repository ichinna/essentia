const args = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const rp = require("request-promise");

console.log(args.i);

let configs = {
    "1": {
        "method": "GET",
        "uri": "http://localhost:8080/elements/api-v2/bills",
        "headers": {
            "Authorization": "User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca, Element 7ZFCoRjkphCupimFq975gc3uokN6Lg9gU2KA9C2G6b8=",
            "Accept": "application/json"
        },
        "this": "intacct"
    },
    "2": {
        "method": "GET",
        "uri": "http://localhost:8080/elements/api-v2/accounts",
        "headers": {
            "Authorization": "User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca, Element i0MBtFnc/2ATxRqx7IwosHAR17IIZJfFEIg6176ZK3E=",
            "Accept": "application/json"
        },
        "this": "pipedrive"
    },
    "3": {
        "method": "GET",
        "uri": "http://localhost:8080/elements/api-v2/campaigns",
        "headers": {
            "Authorization": "User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca, Element UqoYW6WSafcMLnfKH5lmlPDJ7RvtZakzS2sEVn36B5U=",
            "Accept": "application/json"
        },
        "this": "connectwisecrmrest"
    },
    "4": {
        "method": "GET",
        "uri": "http://localhost:8080/elements/api-v2/lists",
        "headers": {
            "Authorization": "User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca, Element ALG3wGWqYggtk0hHRhDAO12UIry03+uLj+42bCkPvAw=",
            "Accept": "application/json"
        },
        "this": "sailthru"
    }
};

let count = 0;

const doGet = async () => {
    let options = { resolveWithFullResponse: true, ...configs[args.i] }

    await rp(options)
        .then(r => {
            if (r.statusCode >= 200 || r.statusCode < 300) {
                console.log(chalk.green(`Success @ count: ${count}`));
                count++;
                doGet();
            } else {
                console.log(chalk.red(`Failed with status code ${r.statusCode} @ count : ${count}`));
            }
        })
        .catch(err => console.log(chalk.red(`Failed @ count : ${count} statusCode: ${err.statusCode} message: ${err.message}`)));
}

doGet();