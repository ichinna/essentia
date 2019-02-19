/**
 * Licensed Materials - Property of IBM
 *
 * 5725Z44
 * © Copyright IBM Corp. 2017 All Rights Reserved
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

'use strict';

var fs = require('fs');
var http = require('http');
var qs=require('querystring');

var port = (process.env.PORT ||  8888);
var request = require('request');
var equals = require('array-equal');
var random = (Math.floor(Math.random() * 100));
var modelSchema;
var modelDefinition;
var model;
var connectorName;
var authHeader;
var url;
var debug;

var length;

var objWithoutRelations =[];
var objWithRelations =[];
var objWithoutRel =[];
var objWithRel =[];
var objWithoutNative =[];
var property_type =[];
var report;

function createHomePage(req,res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html>");
    res.write("<body style='background-color:lightyellow;'> ");
    res.write("<center>");
    res.write("<form name='DisplayForm' method='POST' >");
    res.write("<legend><center><h1>Loopback ++ Validation Tool </h1></center></legend>");
    res.write("<input type='button' onclick=\"location.href='/ValidateConnector'\" value='Validate Connector' /></br></br>");
    //res.write("<input type='button' onclick=\"location.href='/ValidateAllConnectors'\" value='Validate All Connectors' /></br></br>");
    res.write("<input type='button' onclick=\"location.href='/ValidateConnectorRuntime'\" value='Validate Connector Runtime' /></br></br>");
    //res.write("<input type='button' onclick=\"location.href='/ValidateAllConnectorsRuntime'\" value='Validate All Connectors Runtime' /></br></br>");
    res.write("</form>");
    res.write("</center>");
    res.write("</body>");
    res.write("</html>");
    res.end();


}

function saveToFile(fileName, report) {
    fs.writeFile(fileName+".html", report, function(err) {
        if(err) {
            console.log("Error occurred while saving html report")
            console.log(err);
            return ;
        }
    });
}

function validateConnectorForm(req,res,data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html>");
    res.write("<body style='background-color:lightyellow;'> ");
    res.write("<center>");
    res.write("<form method='POST' >");
    res.write("<legend><h2><center> Validate Connector </center></h2></legend>");
    res.write("<table>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Connector Name                    :</label></td>");
    if ( data && data.cname ){
        res.write("<td><input type='text' id='cname' name='cname' value="+ data.cname +"></td>");
    }
    else{
        res.write("<td><input type='text' id='cname' name='cname' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Connector ID                   :</label></td>");
    if ( data && data.cid ){
        res.write("<td><input type='text' id='cid' name='cid' value="+ data.cid +"></td>");
    }
    else{
        res.write("<td><input type='text' id='cid' name='cid' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Environment                           :</label></td>");
    if ( data && data.env ){
        res.write("<td><input type='text' id='env' name='env' value="+ data.env +"></td>");
    }
    else{
        res.write("<td><input type='text' id='env' name='env' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");

    res.write("<tr>");
    res.write("<td><input type='submit' value='Validate'></td>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td><input type='button' onclick=\"location.href='/'\" value='Go to Homepage' /></td>");
    res.write("</tr>");
    res.write("</table>");

    if (data) {

        authHeader = undefined;
        var connectorId =  data.cid;
        connectorName = data.cname;
        var ce_env = data.env;

        res.write("<table border='1'>");
        res.write("<tr>");
        res.write('<h1>Validating LBDocs for '+connectorName + ' Connector with ID : ' + connectorId + ' in '+ce_env+' environment</h1>');
        res.write("</tr>");


        var lbdocsUrl;
        if (ce_env === 'Production' || ce_env === 'production')
            lbdocsUrl = 'https://console.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
        else if (ce_env === 'Staging' || ce_env === 'staging' )
            lbdocsUrl = 'https://staging.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
        else if (ce_env === 'Localhost' || ce_env === 'localhost' || ce_env == 'local' )
            lbdocsUrl = 'http://localhost:8080/elements/api-v2/elements/'+connectorId+'/lbdocs';
        else
            lbdocsUrl = ce_env;

        invokeCElbdocsAPI(lbdocsUrl, function(err,response){
            if (!err) {

                modelSchema = response.ModelSchema;
                modelDefinition = response.ModelDefinitions;

                // Validate ModelDefinition
                modelDefinitionValidation(res,modelDefinition);
                // Validate ModelSchema
                modelSchemaValidation(res,modelSchema);
            }

        });

    }

}

function validateConnectorRuntimeForm(req,res,data){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<html>");
    res.write("<body style='background-color:lightyellow;'> ");
    res.write("<center>");
    res.write("<form method='POST' >");
    res.write("<legend><h2><center> Validate Connector Runtime</center></h2></legend>");
    res.write("<table>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Connector Name                   </label></td>");
    if ( data && data.cname ){
        res.write("<td><input type='text' id='cname' name='cname' value="+ data.cname +"></td>");
    }
    else{
        res.write("<td><input type='text' id='cname' name='cname' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Connector ID                  </label></td>");
    if ( data && data.cid ){
        res.write("<td><input type='text' id='cid' name='cid' value="+ data.cid +"></td>");
    }
    else{
        res.write("<td><input type='text' id='cid' name='cid' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>Environment                          </label></td>");
    if ( data && data.env ){
        res.write("<td><input type='text' id='env' name='env' value="+ data.env +"></td>");
    }
    else{
        res.write("<td><input type='text' id='env' name='env' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<p><td><label for='value'>User Secret                          </label></td>");
    if ( data && data.userSecret ){
        res.write("<td><input type='text' id='userSecret' name='userSecret' value="+ data.userSecret +"></td>");
    }
    else{
        res.write("<td><input type='text' id='userSecret' name='userSecret' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");

    res.write("<tr>");
    res.write("<p><td><label for='value'>Organization Secret                          </label></td>");
    if ( data && data.orgSecret ){
        res.write("<td><input type='text' id='orgSecret' name='orgSecret' value="+ data.orgSecret +"></td>");
    }
    else{
        res.write("<td><input type='text' id='orgSecret' name='orgSecret' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");

    res.write("<tr>");
    res.write("<p><td><label for='value'>Element Token                          </label></td>");
    if ( data && data.token ){
        res.write("<td><input type='text' id='token' name='token' value="+ data.token +"></td>");
    }
    else{
        res.write("<td><input type='text' id='token' name='token' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");

    res.write("<tr>");
    res.write("<p><td><label for='value'>Domain                          </label></td>");
    if ( data && data.domain ){
        res.write("<td><input type='text' id='domain' name='domain' value="+ data.domain +"></td>");
    }
    else{
        res.write("<td><input type='text' id='domain' name='domain' value=''></td>");
    }
    res.write("</p>");
    res.write("</tr>");


    res.write("<tr>");
    res.write("<td><input type='submit' value='Validate'></td>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td><input type='button' onclick=\"location.href='/'\" value='Go to Homepage' /></td>");
    res.write("</tr>");
    res.write("</table>");

    if (data) {

        var connectorId = data.cid;
        connectorName = data.cname;
        var ce_env = data.env;
        var userSecret = data.userSecret;
        var orgSecret = data.orgSecret;
        var element = data.token;
        var domain = data.domain;
        authHeader = 'User '+userSecret+', Organization '+orgSecret+', Element '+element;

        url = 'https://staging.cloud-elements.com/elements/api-v2/hubs/'+ domain+'/';

        res.write("<table border='1'>");
        res.write("<tr>");
        res.write('<h1>Validating LBDocs for '+connectorName + ' Connector with ID : ' + connectorId + ' in '+ce_env+' environment</h1>');
        res.write("</tr>");


        var lbdocsUrl;
        if (ce_env === 'Production' || ce_env === 'production')
            lbdocsUrl = 'https://console.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
        else if (ce_env === 'Staging' || ce_env === 'staging' )
            lbdocsUrl = 'https://staging.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
        else
            lbdocsUrl = ce_env;

        invokeCElbdocsAPI(lbdocsUrl, function(err,response){
            if (!err) {

                modelSchema = response.ModelSchema;
                modelDefinition = response.ModelDefinitions;

                // Validate ModelDefinition
                modelDefinitionValidation(res,modelDefinition);
                // Validate ModelSchema
                modelSchemaValidation(res,modelSchema);
            }

        });

    }

}

/*if (process.argv.length < 5) {
 res.write('Usage: node ValidateLBDocs.js connectorId connectorName <Staging/Production> <optional: debug>');
 process.exit(-1);
 }

 if ( process.argv[5] === 'debug') {
 var debug = true;
 }else if (process.argv[5] !== undefined )
 {
 var domain = process.argv[5];
 var url = 'https://staging.cloud-elements.com/elements/api-v2/hubs/'+ domain+'/';

 }

 if (process.argv[6] !== undefined )
 {
 var element = process.argv[6];
 }


 var connectorId = process.argv[2];
 var connectorName = process.argv[3];
 var ce_env = process.argv[4];
 var length;

 var objWithoutRelations =[];
 var objWithRelations =[];
 var objWithoutRel =[];
 var objWithRel =[];

 res.write('************************************************************************************');
 res.write('Validating LBDocs for '+connectorName + ' Connector with ID : ' + connectorId + ' in '+ce_env+' environment');
 res.write('************************************************************************************\n');

 var lbdocsUrl;
 if (ce_env === 'Production')
 lbdocsUrl = 'https://console.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
 else if (ce_env === 'Staging')
 lbdocsUrl = 'https://staging.cloud-elements.com/elements/api-v2/elements/'+connectorId+'/lbdocs';
 else {
 console.error('Invalid environment provided');
 res.write('Usage: node ValidateLBDocs.js connectorId connectorName <Staging/Production> <optional: debug>');
 process.exit(-1);

 }


 var ce_cred = process.env.CE_CRED;

 var authHeader;
 if( ce_cred !== null && element !== undefined )
 {
 authHeader = ce_cred+', Element '+element;
 }


 invokeCElbdocsAPI(lbdocsUrl, function(err,response){

 if (!err) {

 modelSchema = response.ModelSchema;
 modelDefinition = response.ModelDefinitions;

 // Validate ModelDefinition
 modelDefinitionValidation(modelDefinition);
 // Validate ModelSchema
 modelSchemaValidation(modelSchema);
 }

 });*/

function invokeCElbdocsAPI(lbdocsUrl, callback) {

    var options = {
        method: 'GET',
        url: lbdocsUrl,
        json: true
    };
    request(options, function (err, response, body) {

        if (err || response.statusCode !== 200) {
            console.error('Failed to GET lbdocs for Cloud Elements connector '+ connectorName);
            return callback('Unable to get lbdocs for connector '+ err);
        }
        return callback(null, body);
    });
}

function createObject(res,url,jsonObj,modelname, callback) {

    var jsonobject= JSON.parse(jsonObj);
    var objectUrl = url+modelname;
    res.write('</br>Input JSON :'+jsonObj+'</br>');
    res.write('Model :'+modelname+'</br>');
    res.write('Object URL :'+objectUrl+'</br>');
    request.post({
        uri: url+modelname,
        headers: {'Authorization': authHeader, "Content-Type": "application/json"},
        json: jsonobject }, function (err, response, body) {

        if (err || response.statusCode !== 200) {
            return callback('\n'+ modelname +'  '+ JSON.stringify(response));
        }
        else
        {
        	res.write("<tr>");
            res.write('<td>Object '+modelname+' created successfully</td>');
            res.write('<td>'+ JSON.stringify(response.body)+'</td>');
            res.write("</tr>");
        }
        return callback(null, body);
    });
}

function modelSchemaValidation(res,modelSchema,callback) {

    var a = 0;
    var b = 0;
    var j = 0;
    var r = 0;
    var s = 0;
    var t = 0;
    var u = 0;
    var v = 0;
    var w = 0;
    var complex_model = [];
    var array_model = [];
    var relations_model = [];
    var simple_relations = [];
    var polymorphic_relations = [];
    var primary_model = [];
    var mandatory_missing = [];
    var mandatory_available = [];
    var create =[];
    var update =[];
    var replace =[];
    var retrieve =[];
    var retrieveAll =[];
    var del = [];
    var updateAll =[];
    var arr = [];
    var primary;
    var primary_field = false;
    var primaryId = [];
    var complex_type = false;
    var relationExists = false;
    var man_exists = false;
    var man_missing = false;
    objWithoutRelations=[];
    objWithRelations=[];

    res.write("<table>");
    res.write("<tr>");
    res.write('<td><center><h2>Model Schema Validation</h2></center></td>');
    res.write("</tr>");
    res.write("</table>");
    for (var n = 0, length = modelSchema.length; n < length; ++n) {
        var p = 0;
        var propertyNames = [];
        var complex_fields = [];
        var complexField = false;
        var array_fields = [];
        var q = 0;
        var array = false;


        primary = false;
        primary_field = false;
        res.write("<table style='width:1000px;table-layout:fixed;border-style:solid' >");
        res.write("<tr>");
        res.write("<td>Model Name</td>");
        res.write("<td><b style='color:blue'>"+modelSchema[n].name+"</b></td>");
        res.write("</tr>");

        model = modelSchema[n];
        // validate model name
        if(!model.name)
            throw new Error('name property not defined for model :'+model);

        //negative validation for display
        if(model.display)
            throw new Error('display section should not be defined for model :'+model);

        //validate properties section
        if(!model.properties)
            throw new Error('properties section not defined for model :'+model);

        //modelPropertyValidation(res,model);
        //validate individual properties
        var property_name = Object.keys(model.properties);


        var noOfProperties = property_name.length;
        if ( debug === true) {
            res.write('\nNo of properties : ', noOfProperties);
        }
        res.write("<tr>");
        for(var i=0; i< property_name.length; i++){

            if ( model.properties[property_name[i]].id === 1 ) {
                primary = true;
                primary_model[u] = model.name;
                u++;
                res.write("<td>PRIMARY ID</td>");
                res.write("<td>"+property_name[i] +"</td>");

            }

            propertyNames[i] = property_name[i];
            property_type.push({name:property_name[i], type: model.properties[property_name[i]].type});
            //if ( property_name[i] === 'id')
            if ((property_name[i].toLowerCase()).indexOf('id') !== -1 )
            {
                primary_field = true;
            }
            // validate display object for each property
            if(!model.properties[property_name[i]].display ||
                !model.properties[property_name[i]].display.name ||
                !model.properties[property_name[i]].display.description ||
                !model.properties[property_name[i]].display.order ||
                !model.properties[property_name[i]].display.tags ||
                typeof model.properties[property_name[i]].display.visible === 'undefined')
            {
                res.write("<tr>");
                res.write('<td><b style="color:red">ERROR</b></td>');
                res.write('<td>display object- name/description/order/tags/visible not defined correctly for property  :'+property_name[i]+'</td>');
                res.write("</tr>");
            }
                //throw new Error('(display object- name/description/order/tags/visible) not defined correctly for property  :'+property_name[i]+' under the model :'+model);


            if (model.properties[property_name[i]].type === 'integer' || model.properties[property_name[i]].type === 'Integer')
            {
                console.error(new Error('Integer datatype is not supported '));
            }
            if(model.properties[property_name[i]].type !== 'string' &&
                model.properties[property_name[i]].type !== 'boolean' &&
                model.properties[property_name[i]].type !== 'number' &&
                model.properties[property_name[i]].type !== 'array' ){

                complex_type = true;
                complex_fields[p] = property_name[i];
                p++;

                if (complex_model[r-1] !== model.name) {
                    complex_model[r] = model.name;
                    r++;
                }

                if(debug)
                    res.write('Property '+ property_name[i]+' is of complex type');
            }else if (model.properties[property_name[i]].type === 'array')
            {
                array = true;
                array_fields[q] = property_name[i];
                q++;

                if (array_model[s-1] !== model.name) {
                    array_model[s] = model.name;
                    s++;
                }

                if(debug)
                    res.write('Property '+ property_name[i]+' is of type array');
            }
        }
        res.write("</tr>");


        //validate interactions section
        if(!model.interactions)
            throw new Error('interactions section not defined for model :'+model);

        //validate individual interactions
        var interaction_key = Object.keys(model.interactions);

        res.write("<tr>");
        res.write('<td>Interactions Supported</td>');
        res.write('<td>');
        for(var k=0; k< interaction_key.length; k++) {

            //validating interaction name
            if (interaction_key[k] != 'CREATE' &&
                interaction_key[k] != 'RETRIEVE' &&
                interaction_key[k] != 'UPDATE' &&
                interaction_key[k] != 'DELETE' &&
                interaction_key[k] != 'UPSERT' &&
                interaction_key[k] != 'UPSERTWITHWHERE' &&
                interaction_key[k] != 'RETRIEVEALL' &&
                interaction_key[k] != 'UPDATEALL' &&
                interaction_key[k] != 'DELETEALL' &&
                interaction_key[k] != 'REPLACE' &&
                interaction_key[k] != 'REPLACEALL' &&
                interaction_key[k] != 'EXECUTE' &&
                interaction_key[k] != 'CREATED' &&
                interaction_key[k] != 'UPDATED' &&
                interaction_key[k] != 'DELETED' )
                    res.write('<b style="color:red">ERROR: <b>'+ interaction_key[k] + ' not a valid interaction ');

            res.write(interaction_key[k]+'</br>');
            if (interaction_key[k] === 'CREATE'){
                create.push(model.name);
            }else if (interaction_key[k] === 'RETRIEVE'){
                retrieve.push(model.name);
            }else if (interaction_key[k] === 'UPDATE'){
                update.push(model.name);
            }else if (interaction_key[k] === 'RETRIEVEALL'){
                retrieveAll.push(model.name);
            }else if (interaction_key[k] === 'UPDATEALL'){
                updateAll.push(model.name);
            }else if (interaction_key[k] === 'DELETE'){
                del.push(model.name);
            }else if (interaction_key[k] === 'REPLACE'){
                replace.push(model.name);
            }

            //negative validation for spelling checks - type,requestProperties,responseProperties,basic
            var inter_keys = Object.keys(model.interactions[interaction_key[k]]);
            for(var i=0; i<inter_keys.length; i++){
                if(inter_keys[i] != 'type' && inter_keys[i] != 'requestProperties' && inter_keys[i] != 'responseProperties' && inter_keys[i] != 'basic' && inter_keys[i] != 'swaggerPaths' ){
                    throw new Error('Wrong spelling :'+inter_keys[i]+' for interaction :'+interaction_key[k]+' for model :'+model);
                }
            }

            //validating interaction type
            if (!model.interactions[interaction_key[k]].type)
                throw new Error('interaction type not defined for interaction :' + model.interactions[interaction_key[k]]+' for model :' + model);

            //validating interaction type value
            if (model.interactions[interaction_key[k]].type != 'actions' &&
                model.interactions[interaction_key[k]].type != 'triggers' )
                throw new Error('interaction type :'+model.interactions[interaction_key[k]].type+' not correct value for interaction :' + interaction_key[k]+' .Valid values are -actions/triggers for model :' + model);

            //negative validation for interaction display
            if(model.interactions[interaction_key[k]].display)
                throw new Error('display section should not be defined at interaction :'+interaction_key[k]+' for model :'+model);

            //negative validation for request properties ( not applicable for triggers)
            if(model.interactions[interaction_key[k]].type == 'triggers' &&
                model.interactions[interaction_key[k]].requestProperties)
                throw new Error('requestProperties are not applicable for triggers related interaction :'+interaction_key[k]+' for model :'+model);

            //validation for request properties
            if(model.interactions[interaction_key[k]].requestProperties){


                //negative validation for spelling checks - included,excluded and mandatory
                var property_keys = Object.keys(model.interactions[interaction_key[k]].requestProperties);
                for(var i=0; i<property_keys.length; i++){
                    if(property_keys[i] != 'included' && property_keys[i] != 'excluded' && property_keys[i] != 'mandatory' ){
                        throw new Error('requestProperties having wrong spelling :'+property_keys[i]+' for interaction :'+interaction_key[k]+' for model :'+model);
                    }
                }


                //negative validation if both excluded and included are present
                if(model.interactions[interaction_key[k]].requestProperties.included &&
                    model.interactions[interaction_key[k]].requestProperties.excluded)
                    throw new Error('requestProperties should not include both include and exclude for interaction :'+interaction_key[k]+' for model :'+model);

                //validation of included properties
                if(model.interactions[interaction_key[k]].requestProperties.included){
                    var included_fields = model.interactions[interaction_key[k]].requestProperties.included;
                    var property_names = Object.keys(model.properties);
                    included_fields.forEach(function (field) {
                        if(property_names.indexOf(field) == -1)
                            throw new Error('included field :'+field+' is not part of model properties for requestProperties in interaction :'+interaction_key[k]+' for model :'+model);

                    })
                }

                //validation of excluded properties
                if(model.interactions[interaction_key[k]].requestProperties.excluded){
                    var excluded_fields = model.interactions[interaction_key[k]].requestProperties.excluded;
                    var property_names = Object.keys(model.properties);
                    excluded_fields.forEach(function (field) {
                        if(property_names.indexOf(field) == -1)
                            throw new Error('excluded field :'+field+' is not part of model properties for requestProperties in interaction :'+interaction_key[k]+' for model :'+model);

                    })
                }

                //validation of mandatory properties if included is used
                if(model.interactions[interaction_key[k]].requestProperties.included &&
                    model.interactions[interaction_key[k]].requestProperties.mandatory){

                    var mandatory_fields = model.interactions[interaction_key[k]].requestProperties.mandatory;
                    var included_fields = model.interactions[interaction_key[k]].requestProperties.included;

                    if ((interaction_key[k] === 'CREATE' || interaction_key[k] === 'UPDATE' || interaction_key[k] === 'UPDATEALL') && mandatory_fields.length === 0)
                    {
                        if ( primary !== true && (interaction_key[k] === 'CREATE' || interaction_key[k] === 'UPDATE')) {
                            console.error(new Error(connectorName+': Missing: Primary id field not defined in the model ' + model.name));
                            res.write("<tr>");
                            res.write("<td> Primary ID </td>")
                            res.write('<td><b style="color:red">ERROR: Not defined </b></td>');
                            res.write("</tr>");


                            if (primary_field === true) {
                                primaryId[j] = model.name;
                                j++ ;
                                res.write("<tr>");
                                res.write('<td>ID field</td>');
                                res.write('<td><b style="color:green">Exists</b></td>');
                                res.write("</tr>");
                            }
                        }

                        if ( authHeader !== undefined && interaction_key[k] === 'CREATE' ) {
                            var obj = [];
                            var jsonObject = "{}";

                            var modelname = model.name;
                            createObject(res,url, jsonObject,modelname, function (err, response) {
                                if (err) {
                                    console.error(err+'\n');
                                    console.warn(new Error(connectorName + ': Missing: Mandatory property information in the model'));
                                    res.write('Missing: Mandatory property information');
                                    man_missing = true;
                                    if ( mandatory_missing[a-1] !== model.name) {
                                        mandatory_missing[a] = model.name;
                                        a++;
                                    }
                                }
                            });

                        }else if ( interaction_key[k] === 'CREATE' ){
                            console.warn(new Error(connectorName + ': Missing: Mandatory property information in the model'));
                            res.write('<b style="color:red">Missing: Mandatory property information</b></br>');
                            man_missing = true;
                            if ( mandatory_missing[a-1] !== model.name) {
                                mandatory_missing[a] = model.name;
                                a++;
                            }
                        }


                    }
                    else if (interaction_key[k] === 'CREATE' || interaction_key[k] === 'UPDATE' || interaction_key[k] === 'UPDATEALL'){
                        res.write('Mandatory Properties:'+'<b style="color:green">'+mandatory_fields+'</b></br>');

                        if ( authHeader !== undefined && interaction_key[k] === 'CREATE' ) {

                            var obj = [];
                            var type;

                            var jsonObject = "{";
                            for (var c = 0; c < mandatory_fields.length; c++) {
                                for ( var j = 0; j < property_type.length ; j++)
                                {
                                    //res.write('Property Name:'+property_type[j].name+'\n  Mandatory Fields:'+mandatory_fields[c]);
                                    if (property_type[j].name === mandatory_fields[c])
                                    {
                                       // res.write('Property Name:'+property_type[j].name+'\n  Mandatory Fields:'+mandatory_fields[c]);
                                        type = property_type[j].type;
                                       // res.write('Property Name:'+property_type[j].name+'  Property Type:'+type);
                                    }
                                }
                                obj[c] = "\"" + mandatory_fields[c] + "\"" + ":" + "\"Test" + random + "\"";
                                if ((mandatory_fields[c]).toLowerCase().indexOf('email') != -1)
                                {
                                    obj[c] = "\"" + mandatory_fields[c] + "\"" + ":" + "\"test"+random+"@gmail.com\"";
                                }
                            }
                            jsonObject = jsonObject + obj + "}";

                            var modelname = model.name;
                            createObject(res,url, jsonObject,modelname, function (err, response) {
                                if (err) {
                                    res.write("<tr>");
                                    res.write("<td>Failed to create object </td>")
                                    res.write('<td><b style="color:red">'+err+'</b></td>');
                                    res.write("</tr>");
                                }
                            });

                        }
                        man_exists = true;
                        if ( mandatory_available[b-1] !== model.name) {
                            mandatory_available[b] = model.name;
                            b++;
                        }
                    }

                    mandatory_fields.forEach(function (field) {
                        if(included_fields.indexOf(field) == -1)
                            throw new Error('mandatory field :'+field+' should be part of included property for requestProperties in interaction :'+interaction_key[k]+' for model :'+model);
                    })
                }
            }

            //validation for response properties
            if(model.interactions[interaction_key[k]].responseProperties){

                //negative validation for spelling checks - included,excluded and mandatory
                var property_keys = Object.keys(model.interactions[interaction_key[k]].responseProperties);
                for(var i=0; i<property_keys.length; i++){
                    if(property_keys[i] != 'included' && property_keys[i] != 'excluded' && property_keys[i] != 'mandatory' ){
                        throw new Error('responseProperties having wrong spelling :'+property_keys[i]+' for interaction :'+interaction_key[k]+' for model :'+model);
                    }
                }

                //negative validation if both excluded and included are present
                if(model.interactions[interaction_key[k]].responseProperties.included &&
                    model.interactions[interaction_key[k]].responseProperties.excluded)
                    throw new Error('requestProperties should not include both include and exclude for interaction :'+interaction_key[k]+'for model :'+model);

                //validation of included properties
                if(model.interactions[interaction_key[k]].responseProperties.included){
                    var included_fields = model.interactions[interaction_key[k]].responseProperties.included;
                    var property_names = Object.keys(model.properties);
                    included_fields.forEach(function (field) {
                        if(property_names.indexOf(field) == -1)
                            throw new Error('included field :'+field+' is not part of model properties for responseProperties in interaction :'+interaction_key[k]+' for model :'+model);

                    })
                }

                //validation of excluded properties
                if(model.interactions[interaction_key[k]].responseProperties.excluded){
                    var excluded_fields = model.interactions[interaction_key[k]].responseProperties.excluded;
                    var property_names = Object.keys(model.properties);
                    excluded_fields.forEach(function (field) {
                        if(property_names.indexOf(field) == -1)
                            throw new Error('excluded field :'+field+' is not part of model properties for responseProperties in interaction :'+interaction_key[k]+' for model :'+model);

                    })
                }

                //validation of mandatory properties if included is used
                if(model.interactions[interaction_key[k]].responseProperties.included &&
                    model.interactions[interaction_key[k]].responseProperties.mandatory){

                    var mandatory_fields = model.interactions[interaction_key[k]].responseProperties.mandatory;
                    var included_fields = model.interactions[interaction_key[k]].responseProperties.included;

                    mandatory_fields.forEach(function (field) {
                        if(included_fields.indexOf(field) == -1)
                            throw new Error('mandatory field :'+field+' should be part of included property for responseProperties in interaction :'+interaction_key[k]+' for model :'+model);
                    })
                }
            }

            //validation for basic properties
            if(model.interactions[interaction_key[k]].basic){

                var basic_fields = model.interactions[interaction_key[k]].basic;
                var property_names = Object.keys(model.properties);
                basic_fields.forEach(function (field) {
                    if(property_names.indexOf(field) == -1)
                        throw new Error('basic field :'+field+' should be part of model properties in interaction :'+interaction_key[k]+' for model :'+model);
                })
            }
        }
        res.write('</td>');
        res.write("</tr>");

        //validate properties section
        if(!model.properties)
            throw new Error('properties section not defined for model :'+model);

      /*  //validate individual properties
        var property_name = Object.keys(model.properties);
        var noOfProperties = property_name.length;
        if ( debug === true) {
            res.write('\nNo of properties : ', noOfProperties);
        }
        res.write("<tr>");
        for(var i=0; i< property_name.length; i++){

            if ( model.properties[property_name[i]].id === 1 ) {
                primary = true;
                primary_model[u] = model.name;
                u++;
                res.write("<td>PRIMARY ID</td>");
                res.write("<td>"+property_name[i] +"</td>");

            }

            propertyNames[i] = property_name[i];
            //if ( property_name[i] === 'id')
            if ((property_name[i].toLowerCase()).indexOf('id') !== -1 )
            {
                primary_field = true;
            }
            // validate display object for each property
            if(!model.properties[property_name[i]].display ||
                !model.properties[property_name[i]].display.name ||
                !model.properties[property_name[i]].display.description ||
                !model.properties[property_name[i]].display.order ||
                !model.properties[property_name[i]].display.tags ||
                typeof model.properties[property_name[i]].display.visible === 'undefined')
                {
                }
                throw new Error('(display object- name/description/order/tags/visible) not defined correctly for property  :'+property_name[i]+' under the model :'+model);


            if (model.properties[property_name[i]].type === 'integer' || model.properties[property_name[i]].type === 'Integer')
            {
                console.error(new Error('Integer datatype is not supported '));
            }
            if(model.properties[property_name[i]].type !== 'string' &&
                model.properties[property_name[i]].type !== 'boolean' &&
                model.properties[property_name[i]].type !== 'number' &&
                model.properties[property_name[i]].type !== 'array' ){

                complex_type = true;
                complex_fields[p] = property_name[i];
                p++;

                if (complex_model[r-1] !== model.name) {
                    complex_model[r] = model.name;
                    r++;
                }

                if(debug)
                    res.write('Property '+ property_name[i]+' is of complex type');
            }else if (model.properties[property_name[i]].type === 'array')
            {
                array = true;
                array_fields[q] = property_name[i];
                q++;

                if (array_model[s-1] !== model.name) {
                    array_model[s] = model.name;
                    s++;
                }

                if(debug)
                    res.write('Property '+ property_name[i]+' is of type array');
            }
        }
        res.write("</tr>");

        if ( primary !== true) {
            console.error(new Error(connectorName+': Missing: Primary id field not defined in the model ' + model.name));
            res.write("<tr>");
            res.write("<td> Primary ID </td>");
            res.write('<td><b style="color:red">ERROR: Not defined </b></td>');
            res.write("</tr>");


            if (primary_field === true) {
                primaryId[j] = model.name;
                j++ ;
                res.write("<tr>");
                res.write('<td>ID field</td>');
                res.write('<td><b style="color:green">Exists</b></td>');
                res.write("</tr>");
            }
        } */

        var relations = Object.keys(model.relations);


        if ( relations.length > 0) {
            relationExists = true;
            relations_model[t] = model.name;
            t++;
            res.write("<tr>");
            res.write('<td>Has Relation</td>');
            res.write('<td>'+relationExists+'</td>');
            res.write("</tr>");
            res.write("<tr>");
            res.write('<td>No of parents</td>');
            res.write('<td>'+relations.length+'</td>');
            res.write("</tr>");

        }


        for (var k = 0; k < relations.length; k++) {

            res.write("<tr>");
            res.write('<td>Parent</td>');
            res.write('<td>'+relations[k]+'</td>');
            res.write("</tr>");

            if (model.relations[relations[k]].polymorphic) {
                res.write("<tr>");
                res.write('<td>Type</td>');
                res.write('<td>'+model.relations[relations[k]].type+'</td>');
                res.write("</tr>");
                res.write("<tr>");
                res.write('<td>Discriminator</td>');
                res.write('<td>'+model.relations[relations[k]].polymorphic.discriminator+'</td>');
                res.write("</tr>");
                res.write("<tr>");
                res.write('<td>ForeignKey</td>');
                res.write('<td>'+model.relations[relations[k]].polymorphic.foreignKey+'</td>');
                res.write("</tr>");
                res.write("<tr>");
                res.write('<td>Parents</td>');
                res.write('<td>'+model.properties[model.relations[relations[k]].polymorphic.discriminator].enum+'</td>');
                res.write("</tr>");
            }else if (model.relations[relations[k]].model) {
                res.write("<tr>");
                res.write('<td>Type</td>');
                res.write('<td>'+model.relations[relations[k]].type+'</td>');
                res.write("</tr>");
                res.write("<tr>");
                res.write('<td>ForeignKey</td>');
                res.write('<td>'+model.relations[relations[k]].foreignKey+'</td>');
                res.write("</tr>");
            }

            if (model.relations[relations[k]].polymorphic) {
                polymorphic_relations[v] = model.name;
                v++;
                if (!model.relations[relations[k]].type || !model.relations[relations[k]].polymorphic.foreignKey || !model.relations[relations[k]].polymorphic.discriminator) {
                    console.error(new Error(connectorName+': Relations should have type/foreignKey/discriminator defined '+model.name));
                    res.write("<tr>");
                    res.write('<td><b style="color:red">ERROR</b></td>');
                    res.write('<td>Relations should have type/foreignKey/discriminator defined</td>');
                    res.write("</tr>");

                }
            }else if (model.relations[relations[k]].model) {
                simple_relations[w] = model.name;
                w++;
                if (!model.relations[relations[k]].type || !model.relations[relations[k]].foreignKey) {
                console.error(new Error(connectorName+': Relations should have type/foreignKey defined '+model.name));
                res.write("<tr>");
                res.write('<td><b style="color:red">ERROR</b></td>');
                res.write('<td>Relations should have type/foreignKey defined</td>');
                res.write("</tr>");
                }
            }else{
                if (!model.relations[relations[k]].model || !model.relations[relations[k]].polymorphic || !model.relations[relations[k]].type || !model.relations[relations[k]].foreignKey) {
                    console.error(new Error(connectorName + ': Relations should have model or polymorpic /type/foreignKey defined ' + model.name));
                    res.write("<tr>");
                    res.write('<td><b style="color:red">ERROR</b></td>');
                    res.write('<td>Relations should have model or polymorpic/type/foreignKey defined</td>');
                    res.write("</tr>");
                }
            }
        }

        if ((model.name).indexOf('-') === -1 ) {
            objWithoutRelations.push({name: model.name, no_of_properties:noOfProperties , properties: propertyNames, interactions: interaction_key, relations: relationExists });
        }else
        {
            arr = (model.name).split('-');

            if(arr.length < 3 && (arr[1].toLowerCase()).indexOf('id') === -1)
            {
                objWithoutRelations.push({name: model.name, no_of_properties:noOfProperties , properties: propertyNames, interactions: interaction_key, relations: relationExists});
            }
            else
            {
                if ( arr.length > 3 && (arr[2].toLowerCase()).indexOf('id') !== -1 )
                    objWithRelations.push({name:  model.name, parent: arr[0], child: arr[3], no_of_properties:noOfProperties , properties: propertyNames, interactions: interaction_key, relations: relationExists});
                else
                    objWithRelations.push({name:  model.name, parent: arr[0], child: arr[2], no_of_properties:noOfProperties , properties: propertyNames, interactions: interaction_key, relations: relationExists});
            }

        }

        res.write("</table>");
        res.write("</br>");

    }


    if ( debug === true) {
        res.write('\nObjects without Relations', objWithoutRelations);
        res.write('\nObjects with names indicating relations', objWithRelations);
    }

    res.write("<table>");
    res.write("<tr>");
    res.write('<td><center><h3>Validating Relations</h3></center></td>');
    res.write("</tr>");
    res.write("</table>");
    res.write("</br>");

    res.write("<table border='1'>");
    res.write("<tr>");

    for ( var x = 0 ; x < objWithoutRelations.length ; x++ ) {
        for (var y = 0; y < objWithRelations.length; y++) {
            if (objWithRelations[y].child === objWithoutRelations[x].name) {
                if (objWithRelations[y].no_of_properties === objWithoutRelations[x].no_of_properties) {

                    var check = equals(objWithRelations[y].properties,objWithoutRelations[x].properties);
                    var check_in = equals(objWithRelations[y].interactions ,objWithRelations[x].interactions);
                    if (check === true && check_in === true ) {
                        res.write("<tr>");
                        res.write('<td>Objects that can be merged</td>')
                        res.write('<td><b style="color:green">'+objWithRelations[y].name + ' and ' + objWithoutRelations[x].name +'</b></td>');
                        res.write("</tr>");
                    }
                    else {
                        res.write("<tr>");
                        res.write('<td>Objects with different properties</td>')
                        res.write('<td><b style="color:purple">'+objWithRelations[y].name + ' and ' + objWithoutRelations[x].name + '</b></td>');
                        res.write("</tr>");
                    }
                }
                else {
                    res.write("<tr>");
                    res.write('<td>Objects are different</td>')
                    res.write('<td><b style="color:orange">'+objWithRelations[y].name + ' and ' + objWithoutRelations[x].name + '</b></td>');
                    res.write("</tr>");
                }
            }
        }
    }

    for ( var x = 0 ; x < objWithRelations.length ; x++ ) {
        for (var y = 0; y < objWithRelations.length; y++) {
            if (objWithRelations[y].name !== objWithRelations[x].name) {
                if (objWithRelations[y].child === objWithRelations[x].child) {
                    if (objWithRelations[y].no_of_properties === objWithRelations[x].no_of_properties) {
                        var check = equals(objWithRelations[y].properties,objWithRelations[x].properties);
                        var check_in = equals(objWithRelations[y].interactions,objWithRelations[x].interactions);
                        if (check === true && check_in === true ) {
                            res.write("<tr>");
                            res.write('<td>Objects that can be merged</td>')
                            res.write('<td><b style="color:green">'+objWithRelations[y].name + ' and ' + objWithRelations[x].name + '</b></td>');
                            res.write("</tr>");
                        }
                        else {
                            res.write("<tr>");
                            res.write('<td>Objects with different properties</td>')
                            res.write('<td><b style="color:purple">'+objWithRelations[y].name + ' and ' + objWithRelations[x].name + '</b></td>');
                            res.write("</tr>");
                        }
                    }else {
                        res.write("<tr>");
                        res.write('<td>Objects are different</td>')
                        res.write('<td><b style="color:orange">'+objWithRelations[y].name + ' and ' + objWithRelations[x].name + '</b></td>');
                        res.write("</tr>");
                    }
                }
            }
        }
    }

    res.write('</table>');
    res.write('</br>');

    res.write("<table>");
    res.write("<tr>");
    res.write('<td><center><h2>Schema Validation report for Connector '+connectorName+'</h2></center></td>');
    res.write("</tr>");
    res.write("</table>");
    res.write("</br>");

    res.write("<table border='1'>");
    res.write("<tr>");
    res.write("<tr>");
    res.write('<td>Validation Criteria</td>');
    res.write('<td>No of Objects</td>');
    res.write('<td>Objects</td>');
    res.write("</tr>");

    if ( primary === true )
    {
        res.write("<tr>");
        res.write('<td>Primary id set</td>');
        res.write('<td>'+primary_model.length+'</td>');
        res.write('<td><b style="color:green">'+primary_model+'</b></td>');
        res.write("</tr>");
    }

    if( primary !== true && primary_field === true) {
        res.write("<tr>");
        res.write('<td>ID field Exists</td>');
        res.write('<td>'+primaryId.length+'</td>');
        res.write('<td><b style="color:green">'+primaryId+'</b></td>');
        res.write("</tr>");
    }

    if ( man_exists === true )
    {
        res.write("<tr>");
        res.write('<td>Mandatory fields defined</td>');
        res.write('<td>'+mandatory_available.length+'</td>');
        res.write('<td><b style="color:green">'+mandatory_available+'</b></td>');
        res.write("</tr>");
    }

    if (man_missing === true)
    {
        res.write("<tr>");
        res.write('<td>Mandatory fields not defined</td>');
        res.write('<td>'+mandatory_missing.length+'</td>');
        res.write('<td><b style="color:red">'+mandatory_missing+'</b></td>');
        res.write("</tr>");
    }


    if ( complex_type === true )
    {
        res.write("<tr>");
        res.write('<td>Complex datatype</td>');
        res.write('<td>'+complex_model.length+'</td>');
        res.write('<td>'+complex_model+'</td>');
        res.write("</tr>");
    }

    if ( array === true){

        res.write("<tr>");
        res.write('<td>Array datatype</td>');
        res.write('<td>'+array_model.length+'</td>');
        res.write('<td>'+array_model+'</td>');
        res.write("</tr>");
    }

    if ( relationExists === true)
    {
        res.write("<tr>");
        res.write('<td>Relations</td>');
        res.write('<td>'+relations_model.length+'</td>')
        res.write('<td>'+relations_model+'</td>')
        res.write("</tr>");
    }

    if (simple_relations.length > 0)
    {
        res.write("<tr>");
        res.write('<td>Simple Relations</td>');
        res.write('<td>'+simple_relations.length+'</td>')
        res.write('<td>'+simple_relations+'</td>');
        res.write("</tr>");
    }

    if (polymorphic_relations.length > 0)
    {
        res.write("<tr>");
        res.write('<td>Polymorphic Relations</td>');
        res.write('<td>'+polymorphic_relations.length+'</td>')
        res.write('<td>'+polymorphic_relations+'</td>');
        res.write("</tr>");
    }


    if ( create.length > 0){
        res.write("<tr>");
        res.write('<td>CREATE</td>');
        res.write('<td>'+create.length+'</td>')
        res.write('<td>'+create+'</td>');
        res.write("</tr>");
    }

    if ( update.length > 0){
        res.write("<tr>");
        res.write('<td>UPDATE</td>');
        res.write('<td>'+update.length+'</td>')
        res.write('<td>'+update+'</td>');
        res.write("</tr>");
    }
    if ( retrieve.length > 0){
        res.write("<tr>");
        res.write('<td>RETRIEVE</td>');
        res.write('<td>'+retrieve.length+'</td>')
        res.write('<td>'+retrieve+'</td>');
        res.write("</tr>");
    }
    if ( retrieveAll.length > 0){
        res.write("<tr>");
        res.write('<td>RETRIEVEALL</td>');
        res.write('<td>'+retrieveAll.length+'</td>');
        res.write('<td>'+retrieveAll+'</td>');
        res.write("</tr>");
    }
    if ( updateAll.length > 0){
        res.write("<tr>");
        res.write('<td>UPDATEALL</td>');
        res.write('<td>'+updateAll.length+'</td>');
        res.write('<td>'+updateAll+'</td>');
        res.write("</tr>");
    }
    if ( del.length > 0){
        res.write("<tr>");
        res.write('<td>DELETE</td>');
        res.write('<td>'+del.length+'</td>');
        res.write('<td>'+del+'</td>');
        res.write("</tr>");
    }
    if ( replace.length > 0){
        res.write("<tr>");
        res.write('<td>REPLACE</td>');
        res.write('<td>'+replace.length+'</td>');
        res.write('<td>'+replace+'</td>');
        res.write("</tr>");
    }


}

function modelDefinitionValidation(res,modelDefinition,callback) {

    var l = 0;
    var j = 0;
    var arr = [];
    objWithoutRel =[];
    objWithRel =[];
    objWithoutNative =[];

    res.write("<table>");
    res.write("<tr>");
    res.write('<td><center><h2>Model Definition Validation</h2></center></td>');
    res.write("</tr>");
    res.write("</table>");

    res.write("<table border='1'>");
    res.write("<tr>");
    res.write("<td>Criteria</td>");
    res.write('<td>No of Objects</td>');
    res.write("<td>Objects</td>");
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td>Objects Supported</td>");
    res.write('<td>'+ modelDefinition.length+'</td>');
    res.write("<td>");
    for (var i = 0, length = modelDefinition.length; i < length; ++i){

        // validate model name
        if (!modelDefinition[i].name)
            throw new Error('name property not defined for object index:' + (++i));

        res.write(modelDefinition[i].name+'</br>');

        if ((modelDefinition[i].name).indexOf('-') === -1 ) {
            objWithoutRel.push({ name: modelDefinition[i].name , resourcePath: modelDefinition[i].resourcePath});
        }else
        {
            arr = (modelDefinition[i].name).split('-');

            if(arr.length < 3 && (arr[1].toLowerCase()).indexOf('id') === -1)
            {
                objWithoutRel.push({ name: modelDefinition[i].name , resourcePath: modelDefinition[i].resourcePath});
            }
            else {
                objWithRel.push({ name: modelDefinition[i].name , resourcePath: modelDefinition[i].resourcePath});
            }


        }

        // validate model resourcePath
        if (!modelDefinition[i].resourcePath)
            throw new Error('resourcePath property not defined for object :' + modelDefinition[i].name);

        // validate interactions
        if (!modelDefinition[i].interactions)
            throw new Error('interactions property not defined for object :' + modelDefinition[i].name);


        //validate individual interactions
        var interaction_key = Object.keys(modelDefinition[i].interactions);
        for (var k = 0; k < interaction_key.length; k++) {

        /*    //validating interaction name
            if (interaction_key[k] != 'CREATE' &&
                interaction_key[k] != 'RETRIEVE' &&
                interaction_key[k] != 'UPDATE' &&
                interaction_key[k] != 'DELETE' &&
                interaction_key[k] != 'UPSERT' &&
                interaction_key[k] != 'UPSERTWITHWHERE' &&
                interaction_key[k] != 'RETRIEVEALL' &&
                interaction_key[k] != 'UPDATEALL' &&
                interaction_key[k] != 'DELETEALL' &&
                interaction_key[k] != 'EXECUTE' &&
                interaction_key[k] != 'CREATED' &&
                interaction_key[k] != 'UPDATED' &&
                interaction_key[k] != 'DELETED' ){
                console.error(new Error('interaction name :' + interaction_key[k] + ' not valid for object :' + modelDefinition[i].name));
                res.write('<b style="color:red">ERROR</b>');
                res.write('interaction name :' + interaction_key[k] + ' not valid for object :' + modelDefinition[i].name);

            }
                //throw new Error('interaction name :' + interaction_key[k] + ' not valid for object :' + modelDefinition[i].name);

            //validating interaction type
            if (!modelDefinition[i].interactions[interaction_key[k]].type)
                throw new Error('interaction type not defined for interaction :' + modelDefinition[i].interactions[interaction_key[k]] + ' for object :' + modelDefinition[i].name);

            //validating interaction type value
            if (modelDefinition[i].interactions[interaction_key[k]].type != 'actions' &&
                modelDefinition[i].interactions[interaction_key[k]].type != 'triggers' )
                throw new Error('interaction type :' + modelDefinition[i].interactions[interaction_key[k]].type + ' not correct value for interaction :' + interaction_key[k] + ' for object :' + modelDefinition[i].name + ' .Valid values are -actions/triggers');

            // validating interaction display object
            if (!modelDefinition[i].interactions[interaction_key[k]].display ||
                !modelDefinition[i].interactions[interaction_key[k]].display.name ||
                !modelDefinition[i].interactions[interaction_key[k]].display.description ||
                !modelDefinition[i].interactions[interaction_key[k]].display.order ||
                !modelDefinition[i].interactions[interaction_key[k]].display.tags ||
                typeof modelDefinition[i].interactions[interaction_key[k]].display.visible === 'undefined'
            )
                throw new Error('(display object- name/description/order/tags/visible) not defined correctly for interaction :' + interaction_key[k] + ' for object :' + modelDefinition[i].name); */

         var tags_key = Object.keys(modelDefinition[i].interactions[interaction_key[k]].display.tags);
         if (tags_key.length === 0) {
             objWithoutNative.push({ name: modelDefinition[i].name , interaction : interaction_key[k]})
         }

        }


    }
    res.write("</td>");
    res.write("</tr>");
    res.write("</table>");
    res.write("</br></br>");
    res.write("<table border='1'>");
    res.write("<tr>");
    res.write('<td><b>List of simple objects</b></td>');
    res.write('<td>'+objWithoutRel.length+'</td>');
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td><b>Object Name</b></td>");
    res.write("<td><b>Resource Path</b></td>");
    res.write("</tr>");
    for ( var i = 0; i < objWithoutRel.length ; i++)
    {
        res.write("<tr>");
        res.write('<td>'+objWithoutRel[i].name+'</td>');
        res.write('<td>'+objWithoutRel[i].resourcePath+'</td>');
        res.write("</tr>");
    }
    res.write("</tr>");
    res.write("</table>");
    res.write("</br></br>");
    res.write("<table border='1'>");
    res.write("<tr>");
    res.write('<td><b>List of Objects with names indicating relations</b></td>');
    res.write('<td>'+objWithRel.length+'</td>');
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td><b>Object Name</b></td>");
    res.write("<td><b>Resource Path</b></td>");
    res.write("<tr>");
    for ( var i = 0; i < objWithRel.length ; i++)
    {
        res.write("<tr>");
        res.write('<td>'+objWithRel[i].name+'</td>');
        res.write('<td>'+objWithRel[i].resourcePath+'</td>');
        res.write("</tr>");
    }
    res.write("</tr>");
    res.write("</table>");
    res.write("</br></br>");
    res.write("<table border='1'>");
    res.write("<tr>");
    res.write('<td><b style="color:RED">List of Objects without native mapping </b></td>');
    res.write('<td>'+objWithoutNative.length+'</td>');
    res.write("</tr>");
    res.write("<tr>");
    res.write("<td><b>Object Name</b></td>");
    res.write("<td><b>Interaction</b></td>");
    res.write("<tr>");
    for ( var i = 0; i < objWithoutNative.length ; i++)
    {
        res.write("<tr>");
        res.write('<td><b style="color:RED">'+objWithoutNative[i].name+'</b></td>');
        res.write('<td><b style="color:RED">'+objWithoutNative[i].interaction+'</b></td>');
        res.write("</tr>");
    }
    res.write("</tr>");
    res.write("</table>");
    res.write("</br></br>");
}

http.createServer(function (req, res) {

    switch(req.method){
        case 'GET':
            if ( req.url === '/' ){
                createHomePage(req,res);
                res.end();
            }else if ( req.url === '/ValidateConnector' ){
                validateConnectorForm(req,res);
                res.end();
            }else if ( req.url === '/ValidateAllConnectors' ){
                validateAllConnectorsForm(req,res);
                res.end();
            }else if ( req.url === '/ValidateConnectorRuntime' ){
                validateConnectorRuntimeForm(req,res);
                res.end();
            }else if ( req.url === '/ValidateAllConnectorsRuntime' ){
                validateAllConnectorsRuntimeForm(req,res);
                res.end();
            }

            break;
        case 'POST':
            if ( req.url === '/ValidateConnector'){
                var body = '';
                req.on('data',function(data){
                    body += data;
                    if ( body.length > 1e7 ){
                        res.end();
                    }
                });
                req.on('end',function(data){
                    var formData=qs.parse(body);
                    //res.write(formData);
                    validateConnectorForm(req,res,formData);
                });

            }else if ( req.url === '/ValidateAllConnectors'){
                var body = '';
                req.on('data',function(data){
                    body += data;
                    if ( body.length > 1e7 ){
                        res.end();
                    }
                })
                req.on('end',function(data){
                    var formData=qs.parse(body)
                    validateAllConnectorsForm(req,res,formData);
                })
            }else if ( req.url === '/ValidateConnectorRuntime'){
                var body = '';
                req.on('data',function(data){
                    body += data;
                    if ( body.length > 1e7 ){
                        res.end();
                    }
                })
                req.on('end',function(data){
                    var formData=qs.parse(body)
                    validateConnectorRuntimeForm(req,res,formData);
                })
            }else if ( req.url === '/ValidateAllConnectorsRuntime'){
                var body = '';
                req.on('data',function(data){
                    body += data;
                    if ( body.length > 1e7 ){
                        res.end();
                    }
                })
                req.on('end',function(data){
                    var formData=qs.parse(body)
                    validateAllConnectorsRuntimeForm(req,res,formData);
                })
            }
            break;
        default:
            break;

    }

}).listen(port);

console.log('Server running at http://127.0.0.1:'+port);