//import { isEmpty } from 'lodash'
var fs = require('fs');
const util = require('./utils/getProperties');

var staginglbDocs = {};
var locallbDocs = {};
//"hubspot",
// should add sapc4ccrm
const allElementKeys = ["netsuiteerpv2","intacct","netsuitecrmv2","zohocrm","hubspotcrm","pardot","netsuitehcv2","sugarcrmv2","ciscospark","jira","bigcommerce","stripe","twiliov2","zuorav2","netsuitefinancev2","quickbooks","paypalv2","concur","servicecloud","infusionsoftmarketing","acton","sfdcdocuments","sfdclibraries","adobe-esign","docusign","facebooksocial","facebookleadads","shopify","sharepoint","salescloud","salesforcemarketingcloud","zendesk","desk","freshbooks","freshdeskv2","servicemax","sfdcservicecloud","quickbooksonprem","sapc4ccrm"];

const firstPass = ['hubspot', 'sapc4ccrm'];
allElementKeys.forEach(key => {
    let localhost = require(`/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/localhost/${key}`);
    locallbDocs[key] = util.getPropertiesMap(localhost);

    let staging = require(`/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/staging/${key}`);
    staginglbDocs[key] = util.getPropertiesMap(staging);
});

allElementKeys.forEach(key => {
    console.log('Testing element\t', key)
    let localResources = Object.keys(locallbDocs[key]);
    let stagingResources = Object.keys(staginglbDocs[key]);
    stagingResources.forEach(k => {
        if (!util.isSubset(stagingResources[k], localResources[k])) {
            console.log(`Element ${key} is not matching for resource ${k}`);
        } else {
            console.log('\tNow testing resource \t', k);
        }
    });
});

// console.log(JSON.stringify(locallbDocs));

// for(var element in allElementKeys) {
//     // staginglbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/staging/' + allElementKeys[element]);
//     locallbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/localhost/' + allElementKeys[element]);

    
//  }