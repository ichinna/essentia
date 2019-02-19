//import { isEmpty } from 'lodash'
var fs = require('fs');
var staginglbDocs = {};
var y = {};
var result = [];
//
const allElementKeys = ["netsuiteerpv2", "intacct", "netsuitecrmv2", "zohocrm", "hubspotcrm", "pardot", "hubspot", "netsuitehcv2", "sugarcrmv2", "ciscospark", "jira", "bigcommerce", "stripe", "twiliov2", "zuorav2", "netsuitefinancev2", "quickbooks", "paypalv2", "concur", "servicecloud", "infusionsoftmarketing", "acton", "sfdcdocuments", "sfdclibraries", "adobe-esign", "docusign", "facebooksocial", "facebookleadads", "shopify", "sharepoint", "salescloud", "salesforcemarketingcloud", "zendesk", "desk", "freshbooks", "freshdeskv2", "servicemax", "sfdcservicecloud", "quickbooksonprem"];
var finalObj = {};

staginglbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/staging/' + 'facebooksocial');//allElementKeys[element]);
var msch = staginglbDocs.ModelSchema;
var schema = {};
for (var i in msch) {
    schema = msch[i];
    if (schema.name === 'status') {
        console.log(JSON.stringify(schema));
    }
}