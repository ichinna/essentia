'use strict';

const {complement} = require('ramda');
const isError = require('./isError');

module.exports = complement(isError);
