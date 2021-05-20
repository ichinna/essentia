'use strict';

const {assoc, curry, over} = require('ramda');

module.exports = curry((lens, name, value, data) => over(lens, assoc(name, value))(data));
