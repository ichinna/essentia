const _ = require('lodash');
var fs = require('fs');
var staginglbDocs = {};
var locallbDocs = {};
//"hubspot",
// should add sapc4ccrm
const allElementKeys = ["netsuiteerpv2","intacct","netsuitecrmv2","zohocrm","hubspotcrm","pardot","netsuitehcv2","sugarcrmv2","ciscospark","jira","bigcommerce","stripe","twiliov2","zuorav2","netsuitefinancev2","quickbooks","paypalv2","concur","servicecloud","infusionsoftmarketing","acton","sfdcdocuments","sfdclibraries","adobe-esign","docusign","facebooksocial","facebookleadads","shopify","sharepoint","salescloud","salesforcemarketingcloud","zendesk","desk","freshbooks","freshdeskv2","servicemax","sfdcservicecloud","quickbooksonprem"];
 for(var element in allElementKeys) {
    staginglbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/staging/acton.json');// + allElementKeys[element]);
    locallbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/localhost/acton.json');// + allElementKeys[element]);
    
    var smsch = staginglbDocs.ModelSchema;
    var lmsche = locallbDocs.ModelSchema;
    //console.log(smsch);
    smsch.forEach(ssche => {
        var sProps = ssche.properties;
        
        lmsche.forEach(lsche => {
           
            //console.log(lsche.name + '==' +  ssche.name);
            if (lsche.name === ssche.name) {
                var lProps = lsche.properties;
                var lKeys = Object.keys(lProps);
                var sKeys = Object.keys(sProps);
                if(isSubset(sKeys, lKeys)) {
                    console.log("good to go......");
                    sKeys.forEach(key => {
                        sProps['key'].type;
                    });
                }
            } 
        });
    });
    break;
 }

 function goodToGo(sProp, lProp) {
     if(typeof lProp === 'string') {}

     else if(typeof lProp === 'object' && Array.isArray(sProp)) {
         for (var index = 0; sProp.length; index++) {
             if(lProp.includes(sProp[i])) {
                 
             }
         }
     }

     else if(typeof lProp === 'object' && !Array.isArray(sProp)) {

     }
 }


 function isSubset(source, target) {
    return !_.difference(_.flatten(source), _.flatten(target)).length;
}