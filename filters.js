const rp = require('request-promise');
const _ = require('lodash');

let docs = {};
let filters = {};

const args = require('minimist')(process.argv.slice(2));

if (!args.id) {
    console.warn("pass element id as an argument: ex: --id 23");
}

const getDocs = async () => {
    const options = {
        mehtod: 'GET',
        uri: `http://localhost:8080/elements/api-v2/elements/${args.id}/docs?version=-1`,
        json: true
    } 

    await rp(options)
        .then(r => docs = r)
        .catch(err => console.warn(err));
}

const isSearchPath = path => {
    return !_.endsWith(path, '}');
}

const getResponseReference = method => {

    try {
        const ref = method.responses['200'].schema.items['$ref'];
        return ref.substring(ref.lastIndexOf('/') + 1);
    } catch (err) {
        try {
            const ref = method.responses['200'].schema['$ref'];
            return ref.substring(ref.lastIndexOf('/') + 1);
        } catch (err2) {
            //Ignore
        }
        return null;
    }
}
const findFilters = async () => {
    //First fetch swagger;
    await getDocs();

    const paths = docs.paths;
    const definitions = docs.definitions;
    if (!paths)
        console.warn("No paths found in swagger");
    if (!definitions)
        console.warn("No definitions found in swagger");


    const pathKeys = Object.keys(paths);

    for (let i = 0; i < pathKeys.length; i++) {
        const pathKey = pathKeys[i];
        if (!isSearchPath(pathKey))
            continue;

        const methods = paths[pathKey];

        const searchMehtod = methods['get'];
        if (!searchMehtod)
            continue;

        const ref = getResponseReference(searchMehtod);

        const definition = definitions[ref];
        if (!definition)
            continue;

        const properties = definition.properties;

        if (!properties)
            continue;

        let pathFilters = [];

        const props = Object.keys(properties);

        for (let j = 0; j < props.length; j++) {
            const propVal = properties[props[j]];
            if (!propVal['x-searchable'])
                continue;

            pathFilters.push(props[j]);
        }
        filters[pathKey] = pathFilters;
    }

    console.log(JSON.stringify(filters));
}

findFilters();


