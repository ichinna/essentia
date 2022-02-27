"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var _sanctuaryDef = _interopRequireDefault(require("sanctuary-def"));

var Sig = _interopRequireWildcard(require("./signature"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var def = _sanctuaryDef.default.create({
  checkTypes: true,
  env: _sanctuaryDef.default.env
});

var Parameters = _sanctuaryDef.default.RecordType({
  $: _sanctuaryDef.default.Object,
  checkTypes: _sanctuaryDef.default.Boolean,
  env: _sanctuaryDef.default.Array(_sanctuaryDef.default.Type),
  typeClasses: _sanctuaryDef.default.Array(_sanctuaryDef.default.TypeClass)
});

var create = def('create')({})([Parameters, _sanctuaryDef.default.String, _sanctuaryDef.default.AnyFunction, _sanctuaryDef.default.AnyFunction])(function (_ref) {
  var $ = _ref.$,
      checkTypes = _ref.checkTypes,
      env = _ref.env,
      typeClasses = _ref.typeClasses;
  var $def = $.create({
    checkTypes: checkTypes,
    env: env
  });
  var resovleSig = Sig.resolve($)(typeClasses)(env);
  return $def('def')({})([$.String, $.AnyFunction])(function (signature) {
    return function (func) {
      var params = resovleSig(signature);
      return $def(params.name)(params.constraints)(params.types)(func);
    };
  });
});
exports.create = create;