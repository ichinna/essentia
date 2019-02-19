const request = require('./util/request');
const helper = require('./util/helper');
const _ = require('lodash');
var ids = [];
let getElementKeyAndGenDocs = (siteAddress, elementKey, writeFlag) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let elementKeyUrl = `${siteAddress}/elements/api-v2/elements/${elementKey}`;
    // let elementKeyUrl = `http://localhost:8080/elements/api-v2/elements/${elementKey}`;

    return request.get(elementKeyUrl, query, headers, (error, resp) => {
        console.log(`Calling GET ${elementKeyUrl}`);
        if (error === null) {
            getLbDocForKey(siteAddress, elementKey, resp.id, writeFlag);
        } else {
            console.warn(`Call to GET ${elementKeyUrl} has failed`);
            throw new Error(error);
        }
    });
}; 

let getLbDocForKey = (siteAddress, elementKey, elementId, writeFlag) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = { force: true }; 
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
                console.log(JSON.stringify(resp));
            }
        } else {
            console.warn(`Call to GET ${requestUrl} has failed\nResponse: ${JSON.stringify(resp)}\nRequest Headers: ${JSON.stringify(headers)}`);
            throw new Error(error);
        }
    });
};


if (process.argv.length <= 2) {
    console.warn("Please supply environment for ", __filename, ' i.e. s for staging.cloud-elements.com');
    process.exit(-1);
} 

let siteAddress = helper.getCEUrl(process.argv[2]);
// let elementKey = process.argv[3];
let writeFlag = process.argv[3] ? true : false;

// Element Keys per Aug 14th escrow deposit
const elementKeys = ['bigcommerce', 'ciscospark', 'hubspot', 'hubspotcrm', 'jira', 'netsuitecrmv2', 'netsuiteerpv2', 'netsuitehcv2', 'pardot', 'stripe', 'sugarcrmv2', 'twiliov2', 'zohocrm'];
//const elementKeys = ['facebooksocial']
// const allElementKeys = ["ciscospark"];
// hubspotcrm, "adobe-esign", 
// const allElementKeys = ["netsuitecrmv2", "zohocrm", "ciscospark", "pardot", "hubspot", "netsuiteerpv2", "netsuitehcv2", "sugarcrmv2", "jira", "bigcommerce", "stripe", "twiliov2", "zuorav2", "netsuitefinancev2", "quickbooks", "paypalv2", "concur", "servicecloud", "infusionsoftmarketing", "acton", "sfdcdocuments", "sfdclibraries", "docusign", "facebooksocial", "facebookleadads", "shopify", "sharepoint", "salescloud", "salesforcemarketingcloud", "zendesk", "desk", "freshbooks", "freshdeskv2", "servicemax", "intacct", "sfdcservicecloud", "quickbooksonprem", "sapc4ccrm"];
const allElementKeys = ["netsuitecrmv2", "zohocrm", "ciscospark", "hubspotcrm", "pardot", "hubspot", "netsuiteerpv2", "netsuitehcv2", "sugarcrmv2", "jira", "bigcommerce", "stripe", "twiliov2", "zuorav2", "netsuitefinancev2", "quickbooks", "paypalv2",  "infusionsoftmarketing", "acton", "sfdcdocuments", "sfdclibraries", "adobe-esign", "docusign", "facebooksocial", "facebookleadads", "shopify", "sharepoint", "salescloud", "salesforcemarketingcloud", "zendesk", "desk", "freshbooks", "freshdeskv2", "servicemax", "intacct", "sfdcservicecloud", "quickbooksonprem", "sapc4ccrm", "concur", "servicecloud"];
// const allElementKeys = ['facebooksocial'];
allElementKeys.forEach(elementKey => {
    console.log(`Making a call to ${siteAddress} for the ${elementKey} element`);
    getElementKeyAndGenDocs(siteAddress, elementKey, writeFlag);
});

// console.log(`Making a call to ${siteAddress} for the ${elementKey} element`);
// getElementKey(siteAddress, elementKey, generateLbDoc, writeFlag);
// getElementKey('staging.cloud-elements.com', 'sfdcservicecloud');