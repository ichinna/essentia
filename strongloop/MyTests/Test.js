const _ = require('lodash');
var final = {};
var docs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/MyTests/docs.json');
var props = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/MyTests/props.json');

let localProps = Object.keys(props);
let docProps = docs.map(obj => obj['gsx:field'].split(' ').join(''));
var missing = [];
docProps.forEach(prop => {
    if(!localProps.includes(prop)) {
        missing.push(prop);
        //console.log(prop)
    }
});
docs.map(obj => {
    var propmap = {};
    missing.forEach(prop => {
        if(prop === obj['gsx:field'].split(' ').join('')) {
            var type = obj['gsx:type'];
            if(type === 'int') {
                propmap['type'] = 'integer';
                propmap['format'] = 'int32';
            } else {
                propmap['type'] = type;
            }
            
            final[prop] = propmap;
        }
    });
    
});
console.log(JSON.stringify(final));