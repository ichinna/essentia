'use strict';

const $ = require('sanctuary-def');
const {create} = require('hm-def');
const checkTypes = require('./internal/checkTypes');
const env = require('./internal/env');
const typeClasses = require('./internal/typeClasses');

module.exports = create({$, checkTypes, env, typeClasses});
