const fs = require('fs');
const rp = require('request-promise');
var async = require("async");



let records = fs.readFileSync('./data/delete.json');


const buildOptions = id => {
    return {
        uri: `http://localhost:8080/elements/api-v2/accounts/${id}`,
        mehtod: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'User xL7mHku1w7M0o3D9MK3iCPFbQVkMsiGB077/qMmdzEY=, Organization 031726ba894910bb8f7758e4852475ca, Element mIZmVdMTszTd903SJlNQNTXwXux4s/poYfsC+EN6bb0='
        },
        json: true,
        resolveWithFullResponse: true,
    };
}




const del = async (id) => {
    await rp(buildOptions(id))
        .then((r) => {
            coonsole.log(`deleted for ${id}`)
        })
        .catch(function (err) {
            console.log(err);
        });
}


async.each(records, records.length, del)

