const allElementKeys = ["netsuiteerpv2", "hubspot", "intacct", "netsuitecrmv2", "zohocrm", "hubspotcrm", "pardot", "netsuitehcv2", "sugarcrmv2", "ciscospark", "jira", "bigcommerce", "stripe", "twiliov2", "zuorav2", "netsuitefinancev2", "quickbooks", "paypalv2", "concur", "servicecloud", "infusionsoftmarketing", "acton", "sfdcdocuments", "sfdclibraries", "adobe-esign", "docusign", "facebooksocial", "facebookleadads", "shopify", "sharepoint", "salescloud", "salesforcemarketingcloud", "zendesk", "desk", "freshbooks", "freshdeskv2", "servicemax", "sfdcservicecloud", "quickbooksonprem", "sapc4ccrm"];
allElementKeys.forEach(element => {
    // let staginglbDocs = require(`/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/staging/${element}`);
    let locallbDocs = require(`/Users/chinnababusadam/MyWorkSpace/JS-projects chinna/strongloop/write/lbdoc/localhost/${element}.json`);
    // let stagingNames = staginglbDocs.ModelSchema.map(obj => obj.name);
    // let localNames = locallbDocs.ModelSchema.map(obj => obj.name);
    // console.log(`__________________________________${element}____________________________`);
    // if (stagingNames.length !== localNames.length) {
    //     console.log('Missing', stagingNames.filter(name => !localNames.includes(name)).join('\n'));
    //     // console.log(`\nStaging: ${stagingNames.length} - ${stagingNames.join('\n\t')}`);
    //     // console.log(`Local: ${localNames.length} - ${localNames.join('\n\t')}`);
    // }
    // locallbDocs.ModelSchema.filter(obj => !stagingNames.includes(obj.name)).forEach(obj => console.warn('\nFailure ', obj.name));

    let schemaNames = [];
    let ms = locallbDocs.ModelSchema;
    // ms.forEach(s => {
    //     schemaNames.push(s.name);
    // });


    // ms.forEach(s => {
    //     let relations = s.relations;
    //     if (relations) {
    //         let relKeys = Object.keys(relations);
    //         relKeys.forEach(relKey => {
    //             let rel = relations[relKey];
    //             if (rel.model && rel.type && rel.type === 'referencesMany') {
    //                 if (!schemaNames.includes(rel.model)) {
    //                     console.log(element, ' => ', s.name, '=> ', rel.model);
    //                 } else {
    //                     console.log(element, ' => ', s.name, '=> ', rel.model);
    //                 }
    //             }
    //         })
    //     }
    // })


    const findDupes = (properties, element, name) => {
        let porpKeys = Object.keys(properties);
        porpKeys.forEach(pKey => {
            let propValue = properties[pKey];
            if (propValue.type instanceof Array) {
                if (propValue.type.length === 1) {
                    // console.log('Good fcu??: ', element, '=> ', name, '=> ', pKey);
                    findDupes(propValue.type[0], element, name);
                } else {
                    console.log(element, '=> ', name, '=> ', pKey);
                }
            }
        })
    }

    ms.forEach(s => {
        let properties = s.properties;

        findDupes(properties, element, s.name);
    });


});
