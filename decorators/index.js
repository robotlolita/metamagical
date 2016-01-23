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


// -- Exports ----------------------------------------------------------
var withMeta =
module.exports = function withMeta(fn, meta) {
  fn[metaSymbol] = meta;
  return fn;
};

withMeta[metaSymbol] = {
  name: 'withMeta',
  signature: 'withMeta(object, meta)',
  type: '(Object, { String -> Any }) -> Object',
  category: 'Decorators',
  documentation: 'Defines the meta-data for an object.'
};

withMeta.infix = function(meta) {
  return module.exports(this, meta);
};

withMeta.infix[metaSymbol] = {
  name: 'withMeta',
  signature: 'object.withMeta(meta)',
  type: 'Object . ({ String -> Any }) -> Object',
  category: 'Decorators',
  documentation: 'Defines the meta-data for an object.'
};
