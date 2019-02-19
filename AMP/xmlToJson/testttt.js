const _ = require('lodash');
const R = require('ramda');
const fs = require('fs');

var json = JSON.parse(fs.readFileSync(`./prodXSD.json`).toString('utf-8'));


const safeGet = (object, key) => {
  try {
    let keys = _.split(this, '.');
    let path = '[';
    let depth = _.reduce(keys, (path, n) => {
      return `${path + n}']['`
    }, null)
    return objectdepth;
  } catch (err) {
    console.log(err);
  }

}

console.log(safeGet(json, 'x'));
