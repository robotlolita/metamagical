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

var metaSymbol = Symbol.for('@@meta:magical');

// -- Helpers ----------------------------------------------------------

// ### function: mapObject(object, fn)
//
// Transforms the values of an object.
function mapObject(object, fn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = fn(object[key]);
    return result;
  }, object);
}

// ### function: toDecorator(fn, meta)
//
// Converts a regular function to a decorator on Value descriptions.
function toInfix(fn) {
  var result = function() {
    fn(this);
  };
  result[metaSymbol] = fn[metaSymbol];
  return result;
}

// -- Exports ----------------------------------------------------------
module.exports = mapObject(require('./prefix'), toInfix);
