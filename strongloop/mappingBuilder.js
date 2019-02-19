let request = require('request');
let id = process.argv[2];
let options = {
	url: 'http://localhost:8080/elements/api-v2/elements/' + id + '/lbdocs',
	headers: {
		'User-Agent': 'request',
    		'Authorization': 'User vr6iRY9X0EJgtkDc/DTDcuL7pwZAS7oYc2MSmgvAiqc=, Organization 672aa88bb4e3235091de77900e3e299b',
		'Accept': 'application/json',
		'Content-Type': 'application/json'
  	}
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    countResources(info.ModelDefinitions);
  }else {
	console.error("Error occurred");
	}
}

function countResources(modelDefinitions) {
    let resourceCount = 0;
    let resourcesList = {};

    modelDefinitions.forEach(function(value) {
        resourceCount++;
        let pathName = value.resourcePath;
        let interactions = {}
        if (value.interactions.DELETE) {
            interactions['DELETE'] = "";
        }
        if (value.interactions.CREATE) {
            interactions['CREATE'] = "";
        }
        if (value.interactions.RETRIEVEALL) {
            interactions['RETRIEVEALL'] = "";
        }
        if (value.interactions.RETRIEVE) {
            interactions['RETRIEVE'] = "";
        }
        if (value.interactions.UPDATE) {
            interactions['UPDATE'] = "";
        }
        if (value.interactions.UPDATEALL) {
            interactions['UPDATEALL'] = "";
        }
        if (value.interactions.REPLACE) {
            interactions['REPLACE'] = "";
        }
        if (value.interactions.DELETEALL) {
            interactions['DELETEALL'] = "";
        }
        resourcesList[pathName] = interactions;
    });
    console.log("Total Resource Count: " + resourceCount + "\n");
    console.log(JSON.stringify(resourcesList));
};

if (id) {
    request(options, callback);
} else {
    console.log("ID is missing");
}
