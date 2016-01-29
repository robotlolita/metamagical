//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// Copyright (C) 2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

var meta = require('metamagical-interface').update;

meta(Object, {
  name: 'Object',
  signature: 'Object([value])',
  type: '(Any) -> Object',
  category: 'Base objects',
  stability: 'locked',
  platforms: ['ECMAScript'],
  authors: ['ECMA TC39'],
  module: '<native>',
  documentation: `
Creates an object wrapper for a given value.

The [[Object]] constructor can be used to convert a value to their
object counterparts. For primitives, such as numbers or strings, you
get their object equivalent (\`new String(a), new Number(a)\`). For
[[null]] or [[undefined]], you get an empty object. And for things
that are already objects, this constructor acts as an identity
function, just returning its argument.
  `
});


if (Object.assign) {
  meta(Object.assign, {
    name: 'assign',
    signature: 'assign(target, ...sources)',
    type: '(target:Object, ...Object) -> target :: mutates',
    complexity: 'O(n), n is the number of properties to copy',
    category: 'Refinement',
    belongsTo: Object,
    platforms: ['ECMAScript 2015'],
    since: 'es6',
    documentation: `
Copies enumerable own property values from [[sources]] to [[target]].

> **WARNING**:  
> The [[target]] object will be mutated.

[[Object.assign()]] will copy all *own* and *enumerable* property values
from each \`source\` object to the \`target\` object. The target is
modified in-place during the operation, and the properties are copied
from left to right, so sources on the right will have their properties
overwrite sources on the left.

    var o1 = { x: 1 };
    var o2 = { y: 2 };
    var o3 = { z: 3 };
    Object.assign(o1, o2, o3);
    o1 // => { x: 1, y: 2, z: 3 }

Note that, since this method copies only property **values**, getters
will be invoked in the sources. Furthermore, if a property with the
same name already exists in the target as a setter, that setter will
be invoked to assign the value.

    var o1 = { set x(v) { this._x = v }};
    var o2 = { get x(){ return Math.random() }};
    Object.assign(o1, o2);
    // => { x: [Setter], _x: 0.3094236080069095 }

Both [[String]] and [[Symbol]] properties will be copied.

> **NOTE**  
> If a source is not an object, it'll be converted to an object before
> copying.

> **NOTE**  
> If an error ocurrs during the copy, the operation is aborted, but the
> error is not propagated.
  `
  });
}

if (Object.create) {
  meta(Object.create, {
    name: 'create',
    signature: 'create(prototype[, properties])',
    type: '(a:Object, PropertyDescriptors) -> a <| Object',
    category: 'Refinement',
    belongsTo: Object,
    platforms: ['ECMAScript 5'],
    since: 'es5',
    documentation: `
Constructs a new object with the given prototype.


    `
  });
}

if (Object.prototype.__defineGetter__) {
  meta(Object.prototype.__defineGetter__, {
    name: '__defineGetter__',
    signature: '__defineGetter__(property, function)',
    type: 'Object.(String | Symbol, () -> Any)',
    category: 'Proxying',
    belongsTo: Object,
    stability: 'deprecated',
    deprecated: `
This feature is deprecated in favour of defining getters using
the Object Initialiser Syntax, or the [[Object.defineProperty]]
API.

However, as it is widely implemented and used on the Web, it is
very unlikely that browser will stop implementing it.
    `
  });
}
