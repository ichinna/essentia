const rp = require('request-promise');

const buildOptions = () => {
    return {
        uri: `https://api.cloud-elements.com/elements/api-v2/employees`,
        qs: {
            'endDate': "Idontcare",
            'fuckyou': 'doit'
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'User nfZ3w2kKV4lBWtQZhXGjTR7KryBFauEdbLsdFN/xpyk=, Organization 96cf0bfbd52e4a53fb3ac28e940dafee, Element UdCOkiQ+nNpniSyzFPn0XFodADDuTHc7UDCXLSUm5u0='
        },
        json: true,
        resolveWithFullResponse: true,
    };
}
var counter = 0;
/**
 * Runs until last page and writes each page into the specified file...
 */
const run = async () => {
    await rp(buildOptions())
        .then((r) => {

            console.log(r.headers['elements-request-id'], r.statusCode, `API call count:${counter++}`);
            if (counter !== 100) {
                run();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}
start = new Date().getTime();
run();
