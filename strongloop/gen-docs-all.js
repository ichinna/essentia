const request = require('./util/request');
const helper = require('./util/helper');
const fs = require('fs');
const _ = require('lodash');
const pageSize = 'pageSize';
const page = 'page';
const nextPage = 'nextPage';
const where = 'where';

let getElementKeyAndGenDocs = (siteAddress, elementKey) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let elementKeyUrl = `${siteAddress}/elements/api-v2/elements/${elementKey}`;

    return request.get(elementKeyUrl, query, headers, (error, resp) => {
        console.log(`Calling GET ${elementKeyUrl}`);
        if (_.isNull(error)) {
            getDocsForKey(siteAddress, elementKey, resp.id);
        } else {
            console.warn(`Call to GET ${elementKeyUrl} has failed`);
            throw new Error(error);
        }
    });
};

let getDocsForKey = (siteAddress, elementKey, elementId) => {
    if (_.isEmpty(siteAddress) || _.isEmpty(elementKey)) {
        console.warn(`Site Address: ${siteAddress} \nElement Key: ${elementKey}`);
        throw(new Error('Missing \"siteAddress\" or  \"elementKey\"'));
    }
    let query = {};
    let headers = helper.getCEHeaders(siteAddress);
    let requestUrl = `${siteAddress}/elements/api-v2/elements/${elementId}/docs`;
    let environment = helper.getEnvironment(siteAddress);
    
    return request.get(requestUrl, query, headers, (error, resp) => {
        let fileString = '';
        console.log(`Calling GET ${requestUrl}`);
        if (_.isNull(error)) {
			fs.writeFileSync(`${__dirname}/write/element/${environment}/${elementKey}.json`, JSON.stringify(resp, null, 4), 'utf8');
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

let elementKey = process.argv[3]; // pass a specific element key if you wish....

// Element Keys per Aug 14th escrow deposit
const elementKeys = ['bigcommerce', 'ciscospark', 'hubspot', 'hubspotcrm', 'jira', 'netsuitecrmv2', 'netsuiteerpv2', 'netsuitehcv2', 'pardot', 'stripe', 'sugarcrmv2', 'twiliov2', 'zohocrm'];
const allKeys = ["gmail","zohocrmv2","outlookemail","magentov20","freshbooksv2","pardot","clover","jira","docusign","cherwell","amazonmarketplace","revel","maximizer","tangocard","cloudelements","successfactors","quickbooksonprem","googlecloudstorage","facebooksocial","infusionsoftmarketing","netsuitecrm","netsuiteerp","netsuitehc","connectwisecrm","freshdesk","sapc4ccrm","ecwid","sdfdsaf","zendesk","sfdc","concur","freshdeskv2","volusion","square","bigcommerce","eloqua","paypalv2","hubspotcrm","sapr3bapi","saps4bapi","xero","facebookleadads","quickbooks","servicecloud","servicemax","dynamicscrm","oraclesalescloud","hireright","dynamicscrmonpremntlm","saps4hanacloud","stripe","zohocrm","sageone","caagilecentral","pipedrive","brighttalk","questback","salescloud","autotaskcrm","stormpath","sapbusinessone","connectwisecrmrest","greatplains","hubspot","acton","marketo","mailjetmarketing","netsuitehcv2","netsuitecrmv2","netsuitefinance","netsuitefinancev2","sugarcrmv2","netsuiteerpv2","autotaskfinance","connectwisehd","adobe-esign","shopify","ciscospark","buffett","bamboohr","intacct","test","humanity","googlephotos","googlesheets","vcloud","mysql","taleobusiness","sfdclibraries","salesforcemarketingcloud","onedrivev2","constantcontact","hootsuite","taxify","mixpanel","flickr","freshbooks","evernote","actoneb","etsy","magento","kissmetrics","slack","nimsoft","sagecrm","githuboauth","authorizenet","onenote","questbackefs","fieldawarev2","smtp","photobucket","paypal","accesscontrol","posable","axxerion","rackspacefile","awscloudformation","closeio","brandfolder","eventmobiv1","servicenow","sendgrid","googlecalendar","onedrive","sharefile","googledrive","base","desk","pipelinedeals","tableaubylaunchbi","microsoftgraph","himsspostgresql","plaid","DocumentManagement","mailchimp3","linkedin","icontact","sapborestbylaunchbi","sapbobylaunchbi","egnyte","facebookoauth","greenhouse","tipalti","docushareflex","instagram","concurold","sfdcmarketingcloud","sapanywhere","mailchimp","sage200","servicenowoauth","helpscout","recurly","expensify","amazonsns-im","campaignmonitor","microsoftcdl","namely","weebly","allbound","bazaarvoice","sharepoint","dryfly","gnip","connectwise","bi","sfdcoauth","mailchimpv3","autopilot","zuora","dropbox","mailjet","googleoauth","taleo","infobip","dropboxoauth","umbraco","sugar","autotask","twilio","actessentials","sailthru","woocommerce","freshservice","box","abbyy","chargebee","fieldlocate","sqlserver","readytalkilluminate","chargify","postgresql","magentosoapv19","actpremium","lithiumlsw","readytalk","typeform","wrike","wufoo","sagelive","twitter","quickbase","epages","himss","dynamicscrmadfs","gotowebinar","messagebus","gooddata","bullhorn","sftp","salesforcebylaunchbi","googlesuite","fortnox","insightly","economic","acuityscheduling","infusionsoftrest","smartrecruiters","zuorav2","googlesheetsv4","sfdcdocuments","sfdcservicecloud","twiliov2","dropboxv2","onedrivebusiness","dropboxbusiness","dropboxbusinessv2","sageoneuk","sageoneus","actpremiumcrm","actessentialsoauth","infusionsoftcrm","infusionsoftecommerce","woocommercerest","amazons3","autotaskhelpdesk","sapc4chd"];

if (elementKey) {
    getElementKeyAndGenDocs(siteAddress, elementKey);
} else {
    allKeys.forEach(elementKey => {
        console.log(`Making a call to ${siteAddress} for the ${elementKey} element`);
        try {
            getElementKeyAndGenDocs(siteAddress, elementKey);
        } catch (e) {
            console.warn('Some request err\'d', e);
        }
        
    });
}


// console.log(`Making a call to ${siteAddress} for the ${elementKey} element`);
// getElementKey(siteAddress, elementKey, generateLbDoc, writeFlag);
// getElementKey('staging.cloud-elements.com', 'sfdcservicecloud');