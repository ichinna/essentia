"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolve = void 0;

var _sanctuary = _interopRequireDefault(require("sanctuary"));

var _hmParser = _interopRequireDefault(require("hm-parser"));

var _mem = _interopRequireDefault(require("mem"));

var _lodash = _interopRequireDefault(require("lodash.cond"));

var _lodash2 = _interopRequireDefault(require("lodash.frompairs"));

var _Reader = _interopRequireDefault(require("./Reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// ----------------------------------------------------------------------------
//
// Utilities
//
// ----------------------------------------------------------------------------
//    isEmpty :: Foldable f => f a -> Boolean
var isEmpty = function isEmpty(xs) {
  return xs.length === 0;
}; //    propEq :: String -> a -> StrMap a -> Boolean


var propEq = function propEq(prop) {
  return function (val) {
    return function (obj) {
      return obj[prop] === val;
    };
  };
}; //    indexBy :: (StrMap a -> String) -> Array (StrMap a) -> StrMap (StrMap a)


var indexBy = (0, _mem.default)(function (f) {
  return _sanctuary.default.reduce(function (xs) {
    return function (x) {
      return _sanctuary.default.insert(f(x))(x)(xs);
    };
  })({});
}); //    stripNamespace :: String -> String

var stripNamespace = (0, _mem.default)(function (xs) {
  return xs.split('/').pop();
}); //    name :: { name :: a } -> a

var name = _sanctuary.default.prop('name'); //    text :: { text :: a } -> a


var text = _sanctuary.default.prop('text'); //    spellNumber :: Number -> String


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
}; // ----------------------------------------------------------------------------
//
// Type classes
//
// ----------------------------------------------------------------------------
//    lookupTypeClass :: TypeClassMap -> String -> TypeClass


var lookupTypeClass = function lookupTypeClass(tcm) {
  return function (tcName) {
    var tc = tcm[tcName];

    if (!tc) {
      var allTypeClasses = _sanctuary.default.pipe([_sanctuary.default.keys, _sanctuary.default.joinWith(', ')])(tcm);

      throw new TypeError("Type class ".concat(tcName, " not found. Available type ") + "classes are: ".concat(allTypeClasses));
    }

    return tc;
  };
}; //    indexTypeClasses :: Array TypeClass -> TypeClassMap


var indexTypeClasses = (0, _mem.default)(indexBy(_sanctuary.default.pipe([name, stripNamespace]))); // ----------------------------------------------------------------------------
//
// Types
//
// ----------------------------------------------------------------------------
//    children :: { children :: Array a } -> Array a

var children = _sanctuary.default.prop('children'); //    firstChild :: { children :: NonEmpty (Array a) } -> a


var firstChild = function firstChild(x) {
  return children(x)[0];
}; //    typeEq :: String -> Object -> Boolean


var typeEq = propEq('type'); //    hasChildren :: { children :: Array a } -> Boolean

var hasChildren = function hasChildren(x) {
  return !isEmpty(children(x));
}; //    assertTypeArity :: Type -> Array Type -> Undefined !


var assertTypeArity = function assertTypeArity(type) {
  return function (argTypes) {
    var expected = type.keys.length;
    var actual = argTypes.length;

    if (expected !== actual) {
      throw new TypeError("Type ".concat(type.name, " expects ").concat(spellNumber(expected), " ") + "argument".concat(expected === 1 ? '' : 's', ", got ") + "".concat(spellNumber(argTypes.length)));
    }
  };
}; //    lookupType :: SignatureEntry -> Reader (TypeMap Type)


var lookupType = function lookupType(entry) {
  return (0, _Reader.default)(function (typeMap_) {
    var typeName = entry.text;
    var t = typeMap_[typeName];

    if (!t) {
      var allTypes = _sanctuary.default.joinWith(', ')(_sanctuary.default.keys(typeMap_));

      throw new TypeError("Type ".concat(typeName, " not found in env. Available types ") + "are: ".concat(allTypes));
    }

    return t;
  });
}; // ----------------------------------------------------------------------------
//
// API
//
// ----------------------------------------------------------------------------
//           resolve :: Object -> Array TypeClass -> Array Type -> String
//                      -> { name :: String
//                         , constraints :: StrMap TypeClass
//                         , types :: (Array Type)
//                         }


var resolve = function resolve($) {
  // --------------------------------------------------------------------------
  //
  // Type classes
  //
  // --------------------------------------------------------------------------
  //    constraintNames :: Array SignatureConstraint -> StrMap String
  var constraintNames = _sanctuary.default.reduce(function (xs) {
    return function (x) {
      var typeVarName = _sanctuary.default.prop('typevar')(x);

      var newTypeClassName = _sanctuary.default.prop('typeclass')(x);

      var typeVarClasses = _sanctuary.default.fromMaybe([])(_sanctuary.default.get(_sanctuary.default.is($.Array($.String)))(typeVarName)(xs));

      return _sanctuary.default.insert(typeVarName)(_sanctuary.default.append(newTypeClassName)(typeVarClasses))(xs);
    };
  })({}); //    constraints :: TypeClassMap -> Array SignatureConstraint
  //                   -> StrMap (Array TypeClass)


  var constraints = function constraints(tcm) {
    return _sanctuary.default.pipe([constraintNames, _sanctuary.default.map(_sanctuary.default.map(lookupTypeClass(tcm)))]);
  }; // --------------------------------------------------------------------------
  //
  // Types
  //
  // --------------------------------------------------------------------------
  //    fromUnaryType :: Type -> (Type -> Type)


  var fromUnaryType = function fromUnaryType(t) {
    return $.UnaryType(t.name)(t.url)(t._test)(t.types.$1.extractor);
  }; //    fromBinaryType :: Type -> (Type -> Type -> Type)


  var fromBinaryType = function fromBinaryType(t) {
    return $.BinaryType(t.name)(t.url)(t._test)(t.types.$1.extractor)(t.types.$2.extractor);
  }; //    constructType :: (Array Type) -> Type -> Type


  var constructType = function constructType(argTypes) {
    return function (t) {
      assertTypeArity(t)(argTypes);

      switch (t.type) {
        case 'BINARY':
          return fromBinaryType(t)(argTypes[0])(argTypes[1]);

        case 'UNARY':
          return fromUnaryType(t)(argTypes[0]);

        default:
          {
            throw new TypeError("Type ".concat(t.name, " should be recreated with ") + "Types: ".concat(_sanctuary.default.map(name, argTypes), " but it haven't got ") + "a proper function recreator for type ".concat(t.type, "."));
          }
      }
    };
  }; // Helper Type to wipe out thunks


  var Thunk = $.NullaryType('hm-def/Thunk')('')(_sanctuary.default.K(false)); //    convertType :: SignatureEntry -> Reader (TypeMap Type)

  var convertType = (0, _mem.default)(function (entry) {
    return (0, _lodash.default)([[typeEq('typeConstructor'), convertTypeConstructor], [typeEq('function'), convertFunction], [typeEq('list'), convertList], [typeEq('record'), convertRecord], [typeEq('constrainedType'), convertConstrainedType], [typeEq('typevar'), _sanctuary.default.pipe([convertTypevar, _Reader.default.of])], [typeEq('thunk'), _sanctuary.default.K(_Reader.default.of(Thunk))], [_sanctuary.default.K(true), function (e) {
      throw new Error("Don't know what to do with signature entry ".concat(e.type));
    }]])(entry);
  }); //    convertTypes :: Array SignatureEntry -> Reader (TypeMap (Array Type))

  var convertTypes = (0, _mem.default)(_sanctuary.default.pipe([_sanctuary.default.map(convertType), _sanctuary.default.unchecked.sequence(_Reader.default), _sanctuary.default.unchecked.map(_sanctuary.default.reject(_sanctuary.default.equals(Thunk)))])); //    convertTypeConstructor :: SignatureEntry -> Reader (TypeMap Type)

  var convertTypeConstructor = (0, _mem.default)(_sanctuary.default.ifElse(hasChildren)(function (y) {
    return _sanctuary.default.pipe([children, convertTypes, function (x) {
      return _sanctuary.default.unchecked.lift2(constructType)(x)(lookupType(y));
    }])(y);
  })(lookupType)); //    convertList :: SignatureEntry -> Reader (TypeMap Type)

  var convertList = (0, _mem.default)(_sanctuary.default.pipe([firstChild, convertType, _sanctuary.default.unchecked.map($.Array)])); //    convertFunction :: SignatureEntry -> Reader (TypeMap Type)

  var convertFunction = (0, _mem.default)(_sanctuary.default.pipe([children, convertTypes, _sanctuary.default.unchecked.map(function (types) {
    return _sanctuary.default.reduce(function (f) {
      return function (x) {
        return $.Function([x, f]);
      };
    })(types[types.length - 1])(types.slice(0, -1));
  })])); //    convertRecordField :: SignatureEntry
  //                          -> Reader (TypeMap (Pair String Type))

  var convertRecordField = (0, _mem.default)(function (entry) {
    return _sanctuary.default.pipe([firstChild, convertType, _sanctuary.default.unchecked.map(function (valueType) {
      return [entry.text, valueType];
    })])(entry);
  }); //    convertRecord :: SignatureEntry -> Reader (TypeMap Type)

  var convertRecord = (0, _mem.default)(_sanctuary.default.pipe([children, _sanctuary.default.map(convertRecordField), _sanctuary.default.unchecked.sequence(_Reader.default), _sanctuary.default.unchecked.map(_lodash2.default), _sanctuary.default.unchecked.map($.RecordType)])); //    convertTypevar :: SignatureEntry -> Type

  var convertTypevar = (0, _mem.default)(function (x) {
    return $.TypeVariable(text(x));
  }); //    unaryTypevar :: SignatureEntry -> (Type -> Type)

  var unaryTypevar = (0, _mem.default)(function (x) {
    return $.UnaryTypeVariable(text(x));
  }); //    convertConstrainedType :: SignatureEntry -> Reader (TypeMap Type)

  var convertConstrainedType = (0, _mem.default)(function (entry) {
    return _sanctuary.default.pipe([firstChild, convertType, _sanctuary.default.unchecked.map(unaryTypevar(entry))])(entry);
  }); //    shortName :: Type -> String

  var shortName = function shortName(x) {
    return stripNamespace(name(x));
  }; //    indexTypes :: Array Type -> TypeMap


  var indexTypes = indexBy(shortName);
  return function (typeClasses) {
    return function (env) {
      return (0, _mem.default)(function (signature) {
        var typeMap = indexTypes(env);
        var typeClassMap = indexTypeClasses(typeClasses);

        var sig = _hmParser.default.parse(signature);

        var entries = sig.type.children;
        return {
          name: sig.name,
          constraints: constraints(typeClassMap)(sig.constraints),
          types: convertTypes(entries).run(typeMap)
        };
      });
    };
  };
};

exports.resolve = resolve;