"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sanctuary = _interopRequireDefault(require("sanctuary"));

var _fantasyLand = require("fantasy-land");

var _sanctuaryShow = _interopRequireDefault(require("sanctuary-show"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-multi-assign */
var $$show = '@@show'; // Reader :: TypeRep

function Reader(run) {
  if (!(this instanceof Reader)) {
    return new Reader(run);
  }

  this.run = run;
} // run :: Reader a -> Any... -> Any


Reader.run = function run(reader) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return reader.run.apply(reader, args);
}; // chain :: Reader a ~> (a -> Reader b) -> Reader b


Reader.prototype.chain = Reader.prototype[_fantasyLand.chain] = function chain_(f) {
  var _this = this;

  return new Reader(function (r) {
    return f(_this.run(r)).run(r);
  });
}; // ap :: Reader a ~> Reader (a -> b) -> Reader b


Reader.prototype.ap = Reader.prototype[_fantasyLand.ap] = function ap_(a) {
  var _this2 = this;

  return a.chain(function (f) {
    return _this2.map(f);
  });
}; // map :: Reader a ~> (a -> b) -> Reader b


Reader.prototype.map = Reader.prototype[_fantasyLand.map] = function map_(f) {
  return this.chain(function (a) {
    return Reader.of(f(a));
  });
}; // of :: a -> Reader a


Reader.prototype.of = Reader.prototype[_fantasyLand.of] = function (a) {
  return new Reader(function () {
    return a;
  });
};

Reader.of = Reader[_fantasyLand.of] = Reader.prototype.of; // ask :: Reader (a -> a)

Reader.ask = Reader(_sanctuary.default.I); // show :: Reader a ~> String

Reader.prototype.toString = Reader.prototype[$$show] = function show_() {
  return 'Reader (' + (0, _sanctuaryShow.default)(this.run) + ')';
};

var _default = Reader;
exports.default = _default;