//var Swagger = require('swagger-client') ;
// var fs = require("fs");
//
//
// const myPetImage = fs.createReadStream(__dirname + '/cbnew.js')
//
// console.log(myPetImage);

// var client = new Swagger({
//     url: "http://localhost:8080/elements/api-v2/elements/88/docs",
//     success: function () {
//
//         client.apis.files.createFile(
//             {
//                 file: myPetImage,
//                 path: "/out1.jpg",
//                 'Authorization': 'User j87bvyIMUIHSXw8BHBeRLZ3RvbRUb3WmdX0rGsoIRow=, Organization a11d0953e555163e0b5a892f450b8585, Element OcMRzi+n2NvdDBpRc26ktXQaAuvXqYRRh2OujGpjdTY='
//             },
//
//             function (apiResponse) {
//                 console.log('1st time create response', apiResponse);
//             },
//             function (error) {
//                 console.log('1st time create failed with the following' + error.statusText);
//             });
//     },
//     failure: function (err) {
//         console.error("message:Error initialising swagger client", err);
//         done(new Error("Test Failed - Error initialising swagger client"));
//     }
// });
//
//
/* File System Object */
// var fs = require('fs');
//
// /* Read File */
// fs.readFile('x.json', bar)
//
// function bar (err, data)
//   {
//   /* If an error exists, show it, otherwise show the file */
//   err ? Function("error","throw error")(err) : console.log(JSON.stringify(data) );
//   };
var fs = require('fs');

fs.readFile('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/localhost/jira.json', 'utf8', function(err, data) {
    if (err) throw err;
    var myDef = JSON.parse(data); //JSON.stringify(eval('('+data+')'));
    console.log(myDef);
});
