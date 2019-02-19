const _ = require('lodash');
const R = require('Ramda');

let priceJSON = require(`./assets/price.json`);
let productJson = require(`./assets/product.json`);
let overrideJson = require(`./assets/override.json`);
let imageJson = require(`./assets/image.json`);
let relationShipJson = require(`./assets/relationship.json`);
let inventoryJson = require(`./assets/inventory.json`);
let orderAdjustment = require(`./assets/orderAdjustment.json`);
let ordersAcknowledge = require(`./assets/orderAcknowledge.json`);

const getNestedKeys = items => _.filter(items, item => !_.startsWith(item, '-'));
const getXmlAttributes = items => _.filter(items, item => _.startsWith(item, '-'));
const getAttributeString = (attributes, prefix) => _.reduce(attributes, function (result, value, n) {
    return (result && typeof result === 'string') ? result + `${value.substring(1)}="{${prefix && prefix !== "" ? `${prefix}.${value.substring(1)}` : value.substring(1)}}" ` :
        (`${value.substring(1)}="{${prefix && prefix !== "" ? `${prefix}.${value.substring(1)}` : value.substring(1)}}" `);
}, {});

const getXmlSchema = (json, currentKey, prefix) => {
    var xmlSchmea = '';
    let keys = Object.keys(json);

    keys.forEach(key => {

        if (json[key] === null) return;

        if (json[key] instanceof Object) {
            if (json[key] instanceof Array) {
                xmlSchmea += `<${key}>[${prefix && prefix !== "" ? `${prefix}.${key}` : `${key}`}]</${key}>`
            } else {
                var objectKeys = Object.keys(json[key]);
                var attributes = getXmlAttributes(objectKeys);

                if (attributes.length) {
                    let attrtibuteString = getAttributeString(attributes, (prefix && prefix !== "" ? `${prefix}.${key}` : key));
                    if (R.contains("#text", objectKeys)) {
                        xmlSchmea += `<${key} ${attrtibuteString}>{${prefix && prefix !== "" ? `${prefix}.${key}` : key}.text}</${key}>`;
                    } else {
                        xmlSchmea += `<${key} ${attrtibuteString}>`;
                        var nestedKeys = getNestedKeys(objectKeys);
                        nestedKeys.forEach(nK => {
                            let currentObj = json[key];

                            if (currentObj[key] instanceof Object) {
                                xmlSchmea += getXmlSchema(currentObj[nK], nK, (prefix ? `${prefix}.${key}` : key));
                            } else {
                                xmlSchmea += `<${nK}>{${prefix && prefix !== "" ? `${prefix}.${nK}` : `${nK}`}}</${nK}>`;
                            }
                        })
                        xmlSchmea += `</${key}>`;
                    }
                } else if (objectKeys.includes("#text") && objectKeys.length == 1) {
                    xmlSchmea += `<${key}>{${prefix ? `${prefix}.${key}` : `${key}`}}</${key}>`;
                } else {
                    xmlSchmea += `<${key}>`;
                    xmlSchmea += getXmlSchema(json[key], key, (prefix && prefix !== "" ? `${prefix}.${key}` : key));
                    xmlSchmea += `</${key}>`;
                }
            }
        } else {
            xmlSchmea += `<${key}>{${prefix ? `${prefix}.${key}` : `${key}`}}</${key}>`;
        }
    });
    return xmlSchmea;
}

console.log(getXmlSchema(priceJSON, '', ''))