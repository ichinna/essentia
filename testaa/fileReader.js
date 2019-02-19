var fs = require('fs');
// var files = fs.readdirSync('/Users/chinnababu/Desktop/elements.json');

// files.forEach(fileName => {
//     console.log(`${fileName}`)
//     // console.log(`/Users/chinnababu/Desktop/AMP/XSD/${fileName}`);
// });
// console.log('fuck');



var all = [];
var text = fs.readFileSync("/Users/chinnababu/Desktop/2.json").toString('utf-8');
var elements = [];
elements = JSON.parse(text);
elements.forEach((e, i) => {
    // if (e.hub === 'crm') {
        all.push(e.id);
    // }
});

console.log(JSON.stringify(all));



// var crmEl = ["Dynamics CRM On Premise","NetSuite CRM","Act! Essentials Basic","Dynamics CRM","Oracle Sales Cloud","SugarCRM","PipelineDeals","Pipedrive","Pipedrive-clone","Autotask CRM","Connectwise CRM REST Beta","Zoho Crm V2","Maximizer","ConnectWise CRM","Salesforce Sales Cloud-clone","HubSpot CRM","Zoho CRM","Act! Premium","Act! Essentials","Infusionsoft CRM","Netsuite CRM 2018 Release 1","SugarCRM","SAP Hybris Cloud for Customer CRM","Sage CRM","Close.io","Base","Salesforce Sales Cloud","Oracle Sales Cloud","Microsoft Dynamics CRM","Bullhorn","Insightly","Infusionsoft REST","SugarCRM-clone","SAP Hybris Cloud for Customer CRM-clone","Oracle Sales Cloud-clone","Connectwise CRM REST-clone Beta"];
// var ele = ["ConnectWise CRM","Zoho Crm V2","Bullhorn","SugarCRM","Infusionsoft CRM","Act! Essentials","Act! Premium","Connectwise CRM REST Beta","Maximizer","Infusionsoft REST","Insightly","Salesforce Sales Cloud-clone","Microsoft Dynamics CRM","Oracle Sales Cloud","HubSpot CRM","Netsuite CRM 2018 Release 1","Salesforce Sales Cloud","Zoho CRM","Base","Pipedrive","Pipedrive-clone","Autotask CRM","Close.io","Sage CRM","SAP Hybris Cloud for Customer CRM"];

var x = [23,44,50,79,80,81,83,93,98,105,106,172,174,183,185,193,198,201,205,222,233,240,331,400,411];
var y = [23,44,50,79,80,81,83,93,98,105,106,172,174,183,185,193,198,201,205,222,233,240,331,400,411];

// var y = 

// crmEl.forEach(e => {
//     if (!ele.includes(e)) {
//         console.log(`\"${e}\",`);
//     }
// })