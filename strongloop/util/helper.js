const PROD_USER_ORG = 'User Dj5946r+VhSfqWkvlg1HId1/IUXS/U3GOmFT2qEf/Y0=, Organization 47c7522483465078c1281e346550449e';
const STAGING_USER_ORG = 'User 4KQEhb6b8XQWJylE1Rt7eQ44WVppZWXOwD55Mf1Nmaw=, Organization 3f8c8a655370863ec1848d7d34c9aed4';
const LOCAL_USER_ORG = 'User DiSkNIlArAAgfMprsChl/TsQSzKndqlVIZls1yiP2VQ=, Organization 6c22e13fd3f68ccea9c6fada7f88d7b8';
const SNAPSHOT_USER_ORG = 'User c9/mG8vWV1PpGNAIwRifa1x2zLU19b1x/IQklDn/GNg=, Organization d7a21a490c6e0956af286a4d825cd8c2'
//const LOCAL_USER_ORG = 'User j87bvyIMUIHSXw8BHBeRLZ3RvbRUb3WmdX0rGsoIRow=, Organization a11d0953e555163e0b5a892f450b8585, Element YIopL3MccT51PJCrK0n5j1dkW45VT9M9bRmNRmYJj9k=';
// const headers = {
//     'Authorization': STAGING_USER_ORG,
//     'Accept': 'application/json'
// };
// const requestUrl = `https://${siteAddress}/elements/api-v2/elements/${elementId}/lbdocs`;

let getHeadersForEnv = (siteAddress) => {
    let environment = getEnvironment(siteAddress);
    let userOrgAuth = environment == 'snapshot' ? SNAPSHOT_USER_ORG : environment == 'console' ? PROD_USER_ORG : environment == 'staging' ? STAGING_USER_ORG : environment == 'localhost' ? LOCAL_USER_ORG : '';
    return {
        'Authorization': userOrgAuth,
        'Accept': 'application/json'
    };
};

let getEnvironment = (siteAddress) => {
    let environment = siteAddress.indexOf(".") > -1 ? siteAddress.split(".")[0] : siteAddress.indexOf(":") > -1 ? siteAddress.split(':8080')[0] : siteAddress;
    environment = environment.indexOf("//") > -1 ? environment.split("//").pop() : environment;
    return environment;
}

let getSiteAddress = (siteAddress) => {
    switch (siteAddress) {

        case 'd':
            siteAddress = 'https://snapshot.cloud-elements.com';
            break;
        case 'l':
            siteAddress = 'http://localhost:7070';
            break;
        case 's':
            siteAddress = 'https://staging.cloud-elements.com';
            break;
        case 'p':
        case 'c':
            siteAddress = 'https://console.cloud-elements.com';
            break;
        case 'ls':
            siteAddress = 'http://localhost:8080';
        default:
            break;

    }
    return siteAddress;
}

module.exports = {
    getCEHeaders: getHeadersForEnv,
    getCEUrl: getSiteAddress,
    getEnvironment: getEnvironment
};