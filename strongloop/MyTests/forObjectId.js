//import { isEmpty } from 'lodash'
var fs = require('fs');
var stagingDocs = {};
var y = {};
var result = [];
//
const allElementKeys = ["netsuiteerpv2","intacct","netsuitecrmv2","zohocrm","hubspotcrm","pardot","hubspot","netsuitehcv2","sugarcrmv2","ciscospark","jira","bigcommerce","stripe","twiliov2","zuorav2","netsuitefinancev2","quickbooks","paypalv2","concur","servicecloud","infusionsoftmarketing","acton","sfdcdocuments","sfdclibraries","adobe-esign","docusign","facebooksocial","facebookleadads","shopify","sharepoint","salescloud","salesforcemarketingcloud","zendesk","desk","freshbooks","freshdeskv2","servicemax","sfdcservicecloud","quickbooksonprem"];
var finalObj = {};
 for(var element in allElementKeys) {
    stagingDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/element/localhost/' + allElementKeys[element]);
    //console.log(JSON.stringify(stagingDocs));
    var defs = stagingDocs['definitions'];
    var forResource = {};
   Object.keys(defs).forEach(eachDef => {
       var def = defs[eachDef];
       if (def.hasOwnProperty('properties')) {
           
        var props = def['properties'];
        //console.log(props);
        if (props !== null || props !== undefined || props.length !== 0) {
            Object.keys(props).forEach(eachProp => {
                var propVal = props[eachProp];
                //console.log('-------------------------------------');
             //   console.log(propVal);
                if (propVal.hasOwnProperty('x-searchable-names')) {
                    //console.log('it has');
                    var sNames = propVal['x-searchable-names'];
                    //console.log(sNames);
                    if (sNames.indexOf('orderId') > -1 || sNames.indexOf('OrderId') > -1 || sNames.indexOf('orderID') > -1 || sNames.indexOf('OrderID') > -1) {
                        console.log('yes');
                    }
 
                }
            });
        }
       }
       

       
   });
}
 