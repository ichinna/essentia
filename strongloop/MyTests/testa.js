var fs = require('fs'), request = require('request');


var keys = ["acton", "adobe-esign", "bigcommerce", "ciscospark", "concur", "desk", "docusign", "facebookleadads", "facebooksocial", "freshbooks", "freshdeskv2", "hubspot", "hubspotcrm", "infusionsoftmarketing", "intacct", "jira", "netsuitecrmv2", "netsuiteerpv2", "netsuitefinancev2", "netsuitehcv2", "pardot", "paypalv2", "quickbooks", "quickbooksonprem", "salescloud", "salesforcemarketingcloud", "sapc4ccrm", "servicecloud", "servicemax", "sfdcdocuments", "sfdclibraries", "sfdcservicecloud", "sharepoint", "shopify", "stripe", "sugarcrmv2", "twiliov2", "zendesk", "zohocrm", "zuorav2"];
var ids = [];


keys.forEach(key => {
    var obj = {
        method: 'GET',
        url: `https://snapshot.cloud-elements.com/elements/api-v2/elements/${key}`,
        headers: {
            'Authorization': 'User c9/mG8vWV1PpGNAIwRifa1x2zLU19b1x/IQklDn/GNg=, Organization d7a21a490c6e0956af286a4d825cd8c2'
        }
    };
    let req = request(obj, (err, resp, body) => {
        if (err) {
            console.warn(err);
        } else {
            ids.push((JSON.parse(resp.body)).id);
            // if (ids.length === 40) {
                console.log(ids);
            // }

        }
    })
});

