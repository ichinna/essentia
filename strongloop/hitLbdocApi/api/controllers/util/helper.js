const PROD_USER_ORG = 'User Dj5946r+VhSfqWkvlg1HId1/IUXS/U3GOmFT2qEf/Y0=, Organization 47c7522483465078c1281e346550449e';
const STAGING_USER_ORG = 'User 4KQEhb6b8XQWJylE1Rt7eQ44WVppZWXOwD55Mf1Nmaw=, Organization 3f8c8a655370863ec1848d7d34c9aed4';
const LOCAL_USER_ORG = 'User stRiFjlMO9uq5GlScHZ0bfyJw6M7zBMs1MYjLYXLRgs=, Organization 188b228ebfb42861b44996eb230d1100';
// const headers = {
//     'Authorization': STAGING_USER_ORG,
//     'Accept': 'application/json'
// };
// const requestUrl = `https://${siteAddress}/elements/api-v2/elements/${elementId}/lbdocs`;

let getHeadersForEnv = (siteAddress) => {
    let environment = getEnvironment(siteAddress);
    let userOrgAuth = LOCAL_USER_ORG;
    //environment == 'console' ? PROD_USER_ORG : environment == 'staging' ? STAGING_USER_ORG : environment == 'localhost' ? LOCAL_USER_ORG : '';
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
        case 'l':
            siteAddress = 'http://localhost:8080';
            break;
        case 's':
            siteAddress = 'https://staging.cloud-elements.com';
            break;
        case 'p': 
        case 'c': 
            siteAddress = 'https://console.cloud-elements.com';
            break;
        default:
            break;

    }
    return siteAddress;
}

module.exports = {
    getCEHeaders: getHeadersForEnv,
    getCEUrl : getSiteAddress,
    getEnvironment: getEnvironment
};