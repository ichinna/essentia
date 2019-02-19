//import { isEmpty } from 'lodash'
var fs = require('fs');
var stagingDocs = {};
var y = {};
var result = [];
//
const allElementKeys = ["netsuiteerpv2","intacct","netsuitecrmv2","zohocrm","hubspotcrm","pardot","hubspot","netsuitehcv2","sugarcrmv2","ciscospark","jira","bigcommerce","stripe","twiliov2","zuorav2","netsuitefinancev2","quickbooks","paypalv2","concur","servicecloud","infusionsoftmarketing","acton","sfdcdocuments","sfdclibraries","adobe-esign","docusign","facebooksocial","facebookleadads","shopify","sharepoint","salescloud","salesforcemarketingcloud","zendesk","desk","freshbooks","freshdeskv2","servicemax","sfdcservicecloud","quickbooksonprem"];
var finalObj = {};
 for(var element in allElementKeys) {
    stagingDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/element/staging/' + allElementKeys[element]);
    var paths = stagingDocs.paths;
    var forResource = {};
   Object.keys(paths).forEach(function(eachPath) {
       if(!eachPath.includes('/bulk') && !eachPath.includes('objectName')) {
           var methods = paths[eachPath];
           var forMethod = {};
           Object.keys(methods).forEach(function(eachMeth) {
               var meth = methods[eachMeth];
               var parameters = meth['parameters'];
               var listOfParams = [];
               parameters.forEach(param => {
                   if("in" in param && param['in'] === 'query' && !(['where', 'pageSize', 'nextPage', 'page'].indexOf(param['name']) >= 0) ) {
                       var resultQuery = {};
                       resultQuery.name = param['name'];
                       resultQuery.required = param['required'];
                       listOfParams.push(resultQuery);
                       //console.log(eachMeth);
                   }
               });
               if(listOfParams.length > 0) {
                forMethod[eachMeth] = listOfParams;
               }
           });

           if(Object.keys(forMethod).length !== 0) {
               forResource[eachPath] = forMethod; //console.log(methods);
           }
           
       }
       if(Object.keys(forResource).length !== 0) {
           finalObj[allElementKeys[element]] = forResource;
       }
   });
 }
 console.log(JSON.stringify(finalObj));
 