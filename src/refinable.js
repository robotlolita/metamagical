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

// -- Dependencies -----------------------------------------------------
var meta = require('../decorators');


// -- Implementation ---------------------------------------------------
var Refinable = {
  toString() {
    return '[object Refinable]';
  },

  refine(properties) {
    return Object.assign(Object.create(this), properties);
  }
};


// -- Documentation ----------------------------------------------------
meta(Refinable, {
  name: 'Refinable',
  category: 'Base objects',
  stability: 'stable',
  platforms: ['ECMAScript 2015'],
  authors: ['Quildreen Motta'],
  documentation: `
Provides better primitives for prototype-based OO.

While JavaScript uses prototype-based OO, the most important
primitive (the "clone" operation, [[Object.create]]) is not
available directly on the object, plus it takes property
descriptors for the new properties, which makes using it
less than pleasant.

The Refinable object is a base object that provies the "clone"
primitive in a more usable way, instead. The [[refine()]]
method takes an object, and merges it in a copy of the receiver
of the method to create a new object:

    var Point2d = Refinable.refine({
      x: 0, y: 0,
      toString() {
        return this.x + ', ' + this.y
      }
    });

    var p1 = Point2d.refine({ x: 10, y: 10 });
    var p2 = p1.refine({ y: 20 });
    p1.toString()
    // => 10, 10
    p2.toString()
    // => 10, 20
  `
});

meta(Refinable.toString, {
  name: 'toString',
  signature: 'toString()',
  type: 'Object.() -> String',
  category: 'Inspecting',
  documentation: 'A textual description of this object'
});

meta(Refinable.refine, {
  name: 'refine',
  signature: 'refine(properties)',
  type: 'Object.({ String -> Any }) -> Object',
  category: 'Refinement',
  complexity: 'O(n), `n` is the number of properties',
  documentation: `
Constructs a new object that's enhanced with the given properties.

The [[refine()]] operation allows on to copy the receiver object, and
enhance that copy with the provided properties, in a more pleasant way
than JavaScript's built-in [[Object.create()]] operation:

    var o1 = o.refine({ x: 1 });
    var o2 = o1.refine({ x: 2 });
    o1.x  // => 1
    o2.x  // => 2
    `
});


// -- Exports ----------------------------------------------------------
module.exports = Refinable;
