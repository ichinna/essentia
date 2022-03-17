'use strict';

const {equals, not, pipe} = require('ramda');

module.exports = pipe(equals('production'), not)(process.env.NODE_ENV);
