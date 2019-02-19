const fs = require('fs');
const request = require('./request');
const _ = require('lodash');
const parseString = require('xml2js').parseString;
const parseNumbers = require('xml2js').processors.parseNumbers;
const parseBooleans = require('xml2js').processors.parseBooleans;



const getSoapForObject = (object, cb) => {
    if (_.isEmpty(object)) {
        cb(null, 'Object not provided');
    }

    let headers = {
        'Content-Type': 'text/xml',
        'Soapaction': 'Describe'
    };
    let body = '<?xml version="1.0" encoding="UTF-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">    <soapenv:Header> 	 <fueloauth xmlns="http://exacttarget.com">{access_token}</fueloauth>    </soapenv:Header>    <soapenv:Body>       <DefinitionRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">          <DescribeRequests>             <ObjectDefinitionRequest>                <ObjectType>{object}</ObjectType>             </ObjectDefinitionRequest>          </DescribeRequests>       </DefinitionRequestMsg>    </soapenv:Body> </soapenv:Envelope>';
    body = body.replace("{access_token}", getToken());
    body = body.replace("{object}", object);
    const url = 'https://webservice.s7.exacttarget.com/Service.asmx';
    // const url = 'https://requestb.in/10tftjd1';
    request.post(url, body, headers, (err, res) => {
        if (err) {
            console.warn(`Call to POST has failed\nResponse: ${JSON.stringify(res)}`);
            cb(null, err);
        } else {
            // console.log(res);
            getJsonFromSoap(res, cb);
        }
    });
};

const getJsonFromSoap = (body, cb) => {
    const options = {
        trim: true,
        ignoreAttrs: false,
        explicitArray: false,
        explicitRoot: true,
        mergeAttrs: true,
        valueProcessors: [parseNumbers, parseBooleans]
    };

    parseString(body, options, (err, result) => {
        if (err) {
            cb(null, err)
        } else {
            // console.log(result);
            cb(result);
        }
    });
};

const getToken = () => 'nP7QwwAi0bTeqIO97NuxaI4V';

module.exports = {
    getJsonFromXml: getJsonFromSoap,
    getSoapForObject: getSoapForObject,
    getToken: getToken
};

const doThing = () => {
    var xml = '{';
    var json = '[';
    var files = ["Amazon.xsd","Arts.xsd","AutoAccessory.xsd","Baby.xsd","Beauty.xsd","Books.xsd","CE.xsd","CameraPhoto.xsd","CartonContentsRequest.xsd","ClothingAccessories.xsd","Coins.xsd","Collectibles.xsd","Computers.xsd","EUCompliance.xsd","EducationSupplies.xsd","EntertainmentCollectibles.xsd","FBA.xsd","FoodAndBeverages.xsd","FoodServiceAndJanSan.xsd","FulfillmentCenter.xsd","FulfillmentOrderCancellationRequest.xsd","FulfillmentOrderRequest.xsd","Furniture.xsd","GiftCards.xsd","Gourmet.xsd","Health.xsd","Home._TTH_.xsd","HomeImprovement.xsd","Industrial.xsd","Inventory.xsd","Jewelry.xsd","LabSupplies.xsd","LargeAppliances.xsd","Lighting.xsd","Listings.xsd","Luggage.xsd","LuxuryBeauty.xsd","MaterialHandling.xsd","MechanicalFasteners.xsd","Miscellaneous.xsd","Motorcycles.xsd","Music.xsd","MusicalInstruments.xsd","Office.xsd","OrderAcknowledgement.xsd","OrderAdjustment.xsd","OrderFulfillment.xsd","OrderReport.xsd","Outdoors.xsd","Override.xsd","PetSupplies.xsd","PowerTransmission.xsd","Price.xsd","ProcessingReport.xsd","Product.xsd","ProductClothing.xsd","ProductImage.xsd","ProfessionalHealthCare.xsd","RawMaterials.xsd","Relationship.xsd","SWVG.xsd","SettlementReport.xsd","Shoes.xsd","Sports.xsd","SportsMemorabilia.xsd","ThreeDPrinting.xsd","TiresAndWheels.xsd","Tools.xsd","Toys.xsd","ToysBaby._TTH_.xsd","Video.xsd","WineAndAlcohol.xsd","Wireless.xsd","amzn-base.xsd","amzn-envelope.xsd","amzn-header.xsd"];
    files.forEach(file => {
        xml = fs.readFileSync(`/Users/chinnababu/MyWorkSpace/eclipse/qb/Passtine/XSD_original/${file}`).toString('utf-8');
        getJsonFromSoap(xml, (result, err) => {
            if (result) {
                json += `${JSON.stringify(result)},`;
            } else {
                console.log('err', err);
            }
        });
    });
    
    json += ']';


    console.log(json);
    
};

doThing();