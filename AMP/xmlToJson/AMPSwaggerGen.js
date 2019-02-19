const fs = require('fs');
const _ = require('lodash');
const R = require('ramda');

var json = JSON.parse(fs.readFileSync(`./prodXSD.json`).toString('utf-8'));
const getObjectName = (object) => {
    try {
        return object['xsd:schema']['xsd:element']['name'];
    } catch (err) {

    }
    return null;
}
const getProperties = (object) => {
    try {
        return object['xsd:schema']['xsd:element']['xsd:complexType']['xsd:sequence']['xsd:element']; //This is an array
    } catch (err) {

    }
    return null;
}

var enumJson = {};
json.forEach(schema => {

    var objectName = getObjectName(schema);
    var properties = getProperties(schema);
    if (objectName === null || properties === null) {
        return;
    }

    if (properties instanceof Array) {
        properties.forEach(p => {
            if (p.hasOwnProperty('ref')) {

            } else if (p.hasOwnProperty('name')) {
                let propName = p['name'];
                if (p.hasOwnProperty('xsd:simpleType')) {
                    let simpleType = p['xsd:simpleType'];
                    if (simpleType.hasOwnProperty('xsd:restriction')) {
                        let restriction = simpleType['xsd:restriction'];
                        if (restriction.hasOwnProperty('xsd:enumeration') && restriction['xsd:enumeration'] instanceof Array) {
                            let enums = restriction['xsd:enumeration'].map(enumItem => enumItem.value);
                            enumJson[propName] = enums;
                        }
                    }
                }

            }
        });
    }
});


console.log(enumJson);



