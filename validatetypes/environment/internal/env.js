'use strict';

const {env: flutureEnv} = require('fluture-sanctuary-types');
const {Any, Unknown, Either, env: defaultEnv} = require('sanctuary-def');

module.exports = defaultEnv
	.concat([Any, Either(Unknown)(Unknown)])
	.concat(flutureEnv);
 