var sample  = {
    "address1_city": "Austin",
    "msdyn_taxexempt": false,
    "openrevenue": 0,
    "owninguser": "11411afe-2b69-e611-80dd-c4346bb5ebe0",
    "participatesinworkflow": false,
    "telephone1": "+86-23-4444-0100",
    "ownershipcode": 4,
    "emailaddress1": "vlauriant@adatum.com",
    "statuscode": 1,
    "accountid": "375b158c-541c-e511-80d3-3863bb347ba8",
    "donotemail": false,
    "address1_country": "United States",
    "opendeals_date": 1538612140000,
    "createdby": "11411afe-2b69-e611-80dd-c4346bb5ebe0",
    "address1_composite": "Austin\r\nUnited States",
    "opendeals": 0,
    "shippingmethodcode": 1,
    "donotsendmm": false,
    "openrevenue_base": 0,
    "donotbulkemail": false,
    "ownerid": "11411afe-2b69-e611-80dd-c4346bb5ebe0",
    "donotpostalmail": false,
    "address1_addressid": "970bd883-dc3f-47b4-9b11-8f9c4792edda",
    "preferredcontactmethodcode": 1,
    "modifiedon": 1533628440000,
    "donotphone": false,
    "modifiedby": "11411afe-2b69-e611-80dd-c4346bb5ebe0",
    "accountratingcode": 1,
    "owningbusinessunit": "1d547b3c-125a-e611-80d8-c4346bac3af4",
    "donotbulkpostalmail": false,
    "creditonhold": false,
    "customersizecode": 1,
    "openrevenue_date": 1538612140000,
    "exchangerate": 1,
    "accountclassificationcode": 1,
    "address2_addressid": "fbc179d4-73ca-4b59-b4b5-0f49912bec1b",
    "territorycode": 1,
    "statecode": 0,
    "opendeals_state": 1,
    "openrevenue_state": 1,
    "address2_addresstypecode": 1,
    "address2_shippingmethodcode": 1,
    "accountnumber": "AF3HN2S4",
    "address2_freighttermscode": 1,
    "donotfax": false,
    "businesstypecode": 1,
    "merged": false,
    "createdon": 1533628440000,
    "transactioncurrencyid": "be7046f1-2669-e611-80dd-c4346bb5ebe0",
    "followemail": true,
    "websiteurl": "http://www.adatum.com",
    "marketingonly": false
  };



let props = Object.keys(sample);

const requestPromise = require('request-promise-native');
const fs = require('fs');
const uuid = require('uuid');

props.keys(key => {
    let query = `${key}=${sample[key]}`;
    const options =
    {
      'method': 'GET',
      'headers': {
        'Authorization': 'User DiSkNIlArAAgfMprsChl/TsQSzKndqlVIZls1yiP2VQ=, Organization 6c22e13fd3f68ccea9c6fada7f88d7b8, Element avUy5R3Qkeo9XNN3335wrc9YXi6tgsmPqP1jgYqj+hI=',
        'Accept': "application/json"
      },
      'url': `http://localhost:8080/elements/api-v2/accounts${query}`
    };


    requestPromise(options)
    .then(function (repos) {
      //Todo perform validation againest your query if you get 200
      // Validation means, just verify the query prop value and your response has the smae value

      //If they match together just confirm it as a quereyable fiels otherwise continue with next prop
    })
    .catch(function (err) {

        //Skrew this error
      console.log(`ERROR ${err}`);
    });
});
