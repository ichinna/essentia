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

console.log(options.url);
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
    let resourcesList = [];

    modelDefinitions.forEach(function(value) {
        resourceCount++;
        let resourceInfo = {'path': value.resourcePath.toString(), 'interactions': []};
        if (value.interactions.DELETE) {
            let interaction = {'name': 'DELETE', "empty": false};
            if (value.interactions.DELETE.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.CREATE) {
            let interaction = {'name': 'CREATE', "empty": false};
            if (value.interactions.CREATE.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.RETRIEVEALL) {
            let interaction = {'name': 'RETRIEVEALL', "empty": false};
            if (value.interactions.RETRIEVEALL.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.RETRIEVE) {
            let interaction = {'name': 'RETRIEVE', "empty": false};
            if (value.interactions.RETRIEVE.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.UPDATE) {
            let interaction = {'name': 'UPDATE', "empty": false};
            if (value.interactions.UPDATE.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.UPDATEALL) {
            let interaction = {'name': 'UPDATEALL', "empty": false};
            if (value.interactions.UPDATEALL.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.REPLACE) {
            let interaction = {'name': 'REPLACE', "empty": false};
            if (value.interactions.REPLACE.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        if (value.interactions.DELETEALL) {
            let interaction = {'name': 'DELETEALL', "empty": false};
            if (value.interactions.DELETEALL.display.tags.length === 0) {
                interaction.empty = true;
                resourceInfo.emptyTags++;
            }
            resourceInfo.interactions.push(interaction);
        }
        resourcesList.push(resourceInfo);
    });
    console.log("Total Resource Count: " + resourceCount + "\n");
    resourcesList.forEach(function(value) {
        console.log("Path: " + value.path);
        let missing = "";
        value.interactions.forEach(function(i) {
            if (i.empty) {
                if (missing.length === 0) {
                    missing += "  Missing Tags: " + i.name;
                } else {
                    missing = missing + ", " + i.name;
                }
            }
        });
        if (missing.length > 0) {
            console.log(missing);
        }
    });
};

if (id) {
    request(options, callback);
} else {
    console.log("ID is missing");
}
