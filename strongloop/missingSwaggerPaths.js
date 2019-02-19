const fs = require('fs');
const helper = require('./util/helper');
const _ = require('lodash');

let validateInteractions = (model) => {
    let missingMap = {};
    model.forEach(obj => {
        let interactions = obj.interactions;
        let keys = Object.keys(interactions);
        keys.forEach(key => {
            let tmp = interactions[key];
            if (_.isEmpty(tmp.swaggerPaths)) {
                let name = obj.name;
                if (_.isEmpty(missingMap) || _.isEmpty(missingMap[name])) {
                    missingMap[name] = [ key ];
                } else {
                    let array = missingMap[name];
                    array.push(key);
                    missingMap[name] = array;
                }
            }
        });
    });
    return missingMap;
};

if (process.argv.length <= 2) {
    console.warn("Please supply environment for ", __filename, ',i.e. s for staging, etc.');
    process.exit(-1);
} 

if (process.argv.length <= 3) {
    console.warn("Please supply element key for ", __filename);
    // process.exit(-1);
} 
const siteAddress = helper.getEnvironment(helper.getCEUrl(process.argv[2]));
const elementKey = process.argv[3];

if (elementKey) {
    let element = JSON.parse(fs.readFileSync(`${__dirname}/write/lbdoc/${siteAddress}/${elementKey}.json`, 'utf8'));
    
    let modelSchema = element.ModelSchema;
    let modelDefinitions = element.ModelDefinitions;
    
    console.log(`Missing schema ${JSON.stringify(validateInteractions(modelSchema))}`);
    console.log(`Missing defs ${JSON.stringify(validateInteractions(modelDefinitions))}`);    
} else {
    // Element Keys per Aug 14th escrow deposit
    const elementKeys = ['bigcommerce', 'ciscospark', 'hubspot', 'hubspotcrm', 'jira', 'netsuitecrmv2', 'netsuiteerpv2', 'netsuitehcv2', 'pardot', 'stripe', 'sugarcrmv2', 'twiliov2', 'zohocrm'];
    elementKeys.forEach(element => {
        let elementJson = JSON.parse(fs.readFileSync(`${__dirname}/write/lbdoc/${siteAddress}/${element}.json`, 'utf8'));
        let modelSchema = elementJson.ModelSchema;
        let modelDefinitions = elementJson.ModelDefinitions;
        console.log(`\n--------------${element}--------------`);
        console.log(`Missing schema ${JSON.stringify(validateInteractions(modelSchema))}`);
        console.log(`Missing defs ${JSON.stringify(validateInteractions(modelDefinitions))}`);
        console.log(`--------------------------------------\n`);
    });
}
