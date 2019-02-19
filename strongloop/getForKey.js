const request = require('./util/request');
const helper = require('./util/helper');
const _ = require('lodash');
const fs = require('fs');

let getElementKey = (siteAddress, elementKey, genSwagger, genLbDoc, writeFlag) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let elementKeyUrl = `${siteAddress}/elements/api-v2/elements/${elementKey}`;
    let environment = helper.getEnvironment(siteAddress);

    return request.get(elementKeyUrl, query, headers, (error, resp) => {
        console.log(`Calling GET ${elementKeyUrl}`);
        if (error === null) {
            // if (writeFlag && generateSwagger) {
            //     fs.writeFileSync(`${__dirname}/write/element/${environment}/${elementKey}.json`, JSON.stringify(resp), 'utf8');
            // } else {
            //     if (generateSwagger) {
            //         console.log(JSON.stringify(resp));
            //     }
            // }
            if (generateLbDoc) {
                getLbDocForKey(siteAddress, elementKey, resp.id, writeFlag);
            }

            if (generateSwagger) {
                getDocForKey(siteAddress, elementKey, resp.id, writeFlag);
            }
        } else {
            console.warn(`Call to GET ${elementKeyUrl} has failed\nResponse: ${JSON.stringify(resp)}\nRequest Headers: ${JSON.stringify(headers)}`);
            throw new Error(error);
        }
    });
};

let getLbDocForKey = (siteAddress, elementKey, elementId, writeFlag) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = { force: true};
    let headers = helper.getCEHeaders(siteAddress);
    let requestUrl = `${siteAddress}/elements/api-v2/elements/${elementId}/lbdocs`;
    let environment = helper.getEnvironment(siteAddress);
    
    return request.get(requestUrl, query, headers, (error, resp) => {
        console.log(`Calling GET ${requestUrl}`);
        if (error === null) {
            if (writeFlag) {
                var fs = require('fs');
                fs.writeFileSync(`${__dirname}/write/lbdoc/${environment}/${elementKey}.json`, JSON.stringify(resp, null, 4), 'utf8');
            } else {
                console.log(JSON.stringify(resp, null, 4));
            }
        } else {
            console.warn(`Call to GET ${requestUrl} has failed`);
            throw new Error(error);
        }
    });
};

let getDocForKey = (siteAddress, elementKey, elementId, writeFlag) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let requestUrl = `${siteAddress}/elements/api-v2/elements/${elementId}/docs`;
    let environment = helper.getEnvironment(siteAddress);
    
    return request.get(requestUrl, query, headers, (error, resp) => {
        console.log(`Calling GET ${requestUrl}`);
        if (error === null) {
            if (writeFlag) {
                var fs = require('fs');
                fs.writeFileSync(`${__dirname}/write/lbdoc/${environment}/${elementKey}.json`, JSON.stringify(resp, null, 4), 'utf8');
            } else {
                console.log(JSON.stringify(resp, null, 4));
            }
        } else {
            console.warn(`Call to GET ${requestUrl} has failed`);
            throw new Error(error);
        }
    });
};


if (process.argv.length <= 2) {
    console.warn("Please supply environment for ", __filename, ' i.e. staging.cloud-elements.com');
    process.exit(-1);
} else if (process.argv.length <= 3) {
    console.warn("Please supply element key for ", __filename, ' i.e. sfdcservicecloud');
    process.exit(-1);
} 

let siteAddress = helper.getCEUrl(process.argv[2]);
let elementKey = process.argv[3];
let generateLbDoc = process.argv[4] ? process.argv[4] == 'y' ? true : false : false ;
let generateSwagger = process.argv[5] ? process.argv[5] == 'y' ? true : false : false ;
let writeFlag = process.argv[6] ? process.argv[6] == 'y' ? true : false : false ;

console.log(`Making a call to ${siteAddress} for the ${elementKey} element`);
getElementKey(siteAddress, elementKey, generateSwagger, generateLbDoc, writeFlag);
// getElementKey('staging.cloud-elements.com', 'sfdcservicecloud');