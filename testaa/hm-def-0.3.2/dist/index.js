'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _sanctuaryDef = require('sanctuary-def');

var _sanctuaryDef2 = _interopRequireDefault(_sanctuaryDef);

var _signature = require('./signature');

var Sig = _interopRequireWildcard(_signature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function create(_ref) {
  var checkTypes = _ref.checkTypes,
      env = _ref.env,
      _ref$typeClasses = _ref.typeClasses,
      typeClasses = _ref$typeClasses === undefined ? [] : _ref$typeClasses;

  var $def = _sanctuaryDef2.default.create({ checkTypes: checkTypes, env: env });

  function def(signature, func) {
    var params = Sig.resolve(typeClasses, env, signature);
    return $def(params.name, params.constraints, params.types, func);
  }

  def.curried = function defUncurried(signature, func) {
    var params = Sig.resolve(typeClasses, env, signature);
    var ufunc = R.uncurryN(params.types.length - 1, func);
    return $def(params.name, params.constraints, params.types, ufunc);
  };

  return def;
}

exports.default = {
  create: create
};