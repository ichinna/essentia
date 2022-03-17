var {create} = require("hm-def");
const $ = require('sanctuary-def');
const checkTypes = true;
const env = $.env;
const {Bifunctor} = require('sanctuary-type-classes');
const typeClasses = [Bifunctor];
const {env: flutureEnv} = require('fluture-sanctuary-types');
const {Any, Unknown, env: defaultEnv} = require('sanctuary-def');
const {EitherType} = require('sanctuary');

const allenv = defaultEnv
	.concat([Any, EitherType(Unknown, Unknown)])
	.concat(flutureEnv);

const def = create({$, checkTypes, env, typeClasses});

const sum = def
  ('sum :: Number -> Number -> Number')
  (a => b => a + b);

// console.log(flutureEnv);
console.log(sum(1)(2));

