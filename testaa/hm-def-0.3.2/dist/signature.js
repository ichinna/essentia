'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = exports.constraints = exports.constraintNames = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _ramdaFantasy = require('ramda-fantasy');

var _hmParser = require('hm-parser');

var _hmParser2 = _interopRequireDefault(_hmParser);

var _sanctuaryDef = require('sanctuary-def');

var _sanctuaryDef2 = _interopRequireDefault(_sanctuaryDef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* We need a recursion, so: */
/* eslint-disable no-use-before-define */

/* Types are by convention starts with a capital leter, so: */
/* eslint-disable new-cap */

/*
From https://www.npmjs.com/package/hindley-milner-parser-js:

HMP.parse('hello :: Foo a => a -> String');
{
  name: 'hello',
  constraints: [
    {typeclass: 'Foo', typevar: 'a'}],
  type:
    {type: 'function', text: '', children: [
      {type: 'typevar', text: 'a', children: []},
      {type: 'typeConstructor', text: 'String', children: []}]};
*/

// type TypeMap = StrMap Type

//-----------------------------------------------------------------------------
//
// Utilities
//
//-----------------------------------------------------------------------------

var lift = R.map;
var lift2 = R.liftN(2);
var uncurry2 = R.uncurryN(2);

// :: String -> String
var stripNamespace = R.compose(R.last, R.split('/'));

// :: Number -> String
var spellNumber = function spellNumber(x) {
  return {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
  }[x] || x.toString();
};

//-----------------------------------------------------------------------------
//
// Type classes
//
//-----------------------------------------------------------------------------

// TypeClassMap -> String -> TypeClass
var lookupTypeClass = function lookupTypeClass(tcm) {
  return function (name) {
    var tc = tcm[name];
    if (!tc) {
      var allTypeClasses = R.keys(tcm).join(', ');
      throw new TypeError('Type class ' + name + ' not found. ' + ('Available type classes are: ' + allTypeClasses));
    }

    return tc;
  };
};

// [SignatureConstraint] -> StrMap String
var constraintNames = exports.constraintNames = R.converge(R.zipObj, [R.pluck('typevar'), R.pluck('typeclass')]);

// TypeClassMap -> [SignatureConstraint] -> StrMap [TypeClass]
var constraints = exports.constraints = uncurry2(function (tcm) {
  return R.compose(R.map(R.of), R.map(lookupTypeClass(tcm)), constraintNames);
});

// :: [TypeClass] -> TypeClassMap
var indexTypeClasses = R.indexBy(R.compose(stripNamespace, R.prop('name')));

//-----------------------------------------------------------------------------
//
// Types
//
//-----------------------------------------------------------------------------

// :: { children :: [a] } -> [a]
var children = R.prop('children');

// :: { children :: [a] } -> a
var firstChild = R.compose(R.prop(0), children);

// :: Object -> String -> Boolean
var typeEq = R.propEq('type');

// :: SignatureEntry -> Boolean
var hasChildren = R.compose(R.not, R.isEmpty, R.prop('children'));

//  :: Type -> (Type -> Type)
var fromUnaryType = function fromUnaryType(t) {
  return _sanctuaryDef2.default.UnaryType(t.name, t.url, t._test, // eslint-disable-line no-underscore-dangle
  t.types.$1.extractor);
};
//  :: Type -> (Type -> Type -> Type)
var fromBinaryType = function fromBinaryType(t) {
  return _sanctuaryDef2.default.BinaryType(t.name, t.url, t._test, // eslint-disable-line no-underscore-dangle
  t.types.$1.extractor, t.types.$2.extractor);
};

// :: (Type, [Type]) -> ()
var checkTypeArity = function checkTypeArity(type, argTypes) {
  var expected = type.keys.length;
  var actual = argTypes.length;
  if (expected !== actual) {
    throw new TypeError('Type ' + type.name + ' expects ' + spellNumber(expected) + ' ' + ('argument' + (expected === 1 ? '' : 's') + ', ') + ('got ' + spellNumber(argTypes.length)));
  }
};

// :: [Type] -> Type|Function -> Type
var constructType = uncurry2(function (argTypes) {
  return R.ifElse(R.is(Function), R.apply(R.__, argTypes), function (t) {
    checkTypeArity(t, argTypes);
    switch (t.type) {
      case 'BINARY':
        return fromBinaryType(t)(argTypes[0], argTypes[1]);
      case 'UNARY':
        return fromUnaryType(t)(argTypes[0]);
      default:
        {
          throw new TypeError('Type ' + t.name + ' should be recreated with Types: ' + R.map(R.prop('name'), argTypes) + ' ' + ('but it haven\'t got a proper function recreator for type ' + t.type + '.'));
        }
    }
  });
});

// :: SignatureEntry -> Reader TypeMap Type
var lookupType = function lookupType(entry) {
  return (0, _ramdaFantasy.Reader)(function (typeMap) {
    var name = entry.text;
    var t = typeMap[name];
    if (!t) {
      var allTypes = R.keys(typeMap).join(', ');
      throw new TypeError('Type ' + name + ' not found in env. ' + ('Available types are: ' + allTypes));
    }
    return t;
  });
};

// Helper Type to wipe out thunks
var Thunk = _sanctuaryDef2.default.NullaryType('hm-def/Thunk', '', R.F);

// :: SignatureEntry -> Reader TypeMap Type
var convertTypeConstructor = function convertTypeConstructor(entry) {
  return R.ifElse(hasChildren, R.compose(lift2(constructType)(R.__, lookupType(entry)), convertTypes, children), lookupType)(entry);
};

// :: SignatureEntry -> Reader TypeMap Type
var convertList = R.compose(lift(_sanctuaryDef2.default.Array), convertType, firstChild);

// :: SignatureEntry -> Reader TypeMap Type
var convertFunction = R.compose(lift(_sanctuaryDef2.default.Function), convertTypes, children);

// :: SignatureEntry -> Reader TypeMap (Pair String Type)
var convertRecordField = function convertRecordField(entry) {
  return R.compose(lift(function (valueType) {
    return [entry.text, valueType];
  }), convertType, firstChild)(entry);
};

// :: SignatureEntry -> Reader TypeMap Type
var convertRecord = R.compose(lift(_sanctuaryDef2.default.RecordType), lift(R.fromPairs), R.sequence(_ramdaFantasy.Reader.of), R.map(convertRecordField), children);

// :: SignatureEntry -> Type
var convertTypevar = R.memoize(R.compose(_sanctuaryDef2.default.TypeVariable, R.prop('text')));

// :: SignatureEntry -> (Type -> Type)
var unaryTypevar = R.memoize(R.compose(_sanctuaryDef2.default.UnaryTypeVariable, R.prop('text')));

// :: SignatureEntry -> Reader TypeMap Type
var convertConstrainedType = function convertConstrainedType(entry) {
  return R.compose(lift(unaryTypevar(entry)), convertType, firstChild)(entry);
};

// :: SignatureEntry -> Reader TypeMap Type
function convertType(entry) {
  return R.cond([[typeEq('typeConstructor'), convertTypeConstructor], [typeEq('function'), convertFunction], [typeEq('list'), convertList], [typeEq('record'), convertRecord], [typeEq('constrainedType'), convertConstrainedType], [typeEq('typevar'), R.compose(_ramdaFantasy.Reader.of, convertTypevar)], [typeEq('thunk'), R.always(_ramdaFantasy.Reader.of(Thunk))], [R.T, function (e) {
    throw new Error('Don\'t know what to do with signature entry ' + e.type);
  }]])(entry);
}

// :: [SignatureEntry] -> Reader TypeMap [Type]
function convertTypes(entries) {
  return R.compose(lift(R.reject(R.equals(Thunk))), R.sequence(_ramdaFantasy.Reader.of), R.map(convertType))(entries);
}

// Type -> Type
var ensureParametrized = R.when(R.is(Function), function (fn) {
  return R.apply(fn, R.repeat(_sanctuaryDef2.default.Unknown, fn.length));
});

// :: Type -> String
var shortName = R.compose(stripNamespace, R.prop('name'), ensureParametrized);

// :: [Type] -> TypeMap
var indexTypes = R.indexBy(shortName);

//-----------------------------------------------------------------------------
//
// API
//
//-----------------------------------------------------------------------------

// :: [TypeClass] -> [Type] -> String -> {
//      name :: String,
//      constraints :: StrMap TypeClass,
//      types :: [Type]
//    }
var resolve = exports.resolve = R.curry(function (typeClasses, env, signature) {
  var typeMap = indexTypes(env);
  var typeClassMap = indexTypeClasses(typeClasses);
  var sig = _hmParser2.default.parse(signature);
  var entries = sig.type.children;
  return {
    name: sig.name,
    constraints: constraints(typeClassMap, sig.constraints),
    types: convertTypes(entries).run(typeMap)
  };
});