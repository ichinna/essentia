const _ = require('lodash');

const getArr = (arr, props) => {
    const addIfEmpty = (arr, key) => {
        if (!arr.includes(key)) {
            // console.log('\t' + key);
            arr.push(key);
        }
    }

    const getPropNames = (props, key) => {
        if (_.isString(props)) {
            addIfEmpty(arr, key);
            return;
        } else if (_.isArray(props)) {
            if (props.length === 1) {
                if (!_.isObjectLike(props[0])) {
                    addIfEmpty(arr, key);
                    return;
                }
                // we're looking at the type props
                key = _.isEmpty(key) ? key : `${key}[*]`;
                return getPropNames(props[0], key);
            }
            return props.map(o => getPropNames(o, key));
        } else if (_.isObjectLike(props)) {
            if (props.hasOwnProperty('type')) {
                return getPropNames(props.type, key);
            } else {
                key = _.isEmpty(key) ? key : `${key}.`;
                Object.keys(props).forEach(k => getPropNames(props[k], `${key}${k}`));
            }
        }
    };
    let k = getPropNames(props, '');
    return arr;
};

exports.isSubset = (source, target) => {
    return !_.difference(_.flatten(source), _.flatten(target)).length;
}

exports.getPropertiesMap = (lbdoc) => {
    // const locallbDocs = require('/Users/chinnababusadam/Documents/JS-projects chinna/strongloop/write/lbdoc/localhost/acton.json');// + allElementKeys[element]);
    let results = {};

    lbdoc.ModelSchema.forEach(msch => {
        let array = [];
        // console.log('checking', msch.name);
        results[msch.name] = getArr(array, [msch.properties]);
        // results.push(tmp);
    });

    return results;
}



