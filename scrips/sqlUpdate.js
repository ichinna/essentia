const fs = require('fs');

let metaData = JSON.parse(fs.readFileSync('./el_meta.json'));

console.log(metaData.length);

for (let i = 0; i < metaData.length; i++) {
    let meta = metaData[i];
    let keys = Object.keys(meta);

    let query = 'UPDATE element_metadata SET ';

    query += `api_type = '${meta.api_type}' `

    query += `, vendor_version = '${meta.vendor_version}' `



    /*
    keep adding
    */


    query += `where element_id = (select element_id from element where element_key = \'${meta.element_key}\' and deleted = false and element_owner_account_id = (select account_id from ce_core_user where email_address = \'system\'));`;
    console.log(query);

}
