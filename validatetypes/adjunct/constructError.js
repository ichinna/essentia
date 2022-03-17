'use strict';

const {construct, when} = require('ramda');
const def = require('../environment/def');
const isNotError = require('../logic/isNotError');

const constructError = when(isNotError, construct(Error));

module.exports = def('constructError :: Any -> Error', constructError);
