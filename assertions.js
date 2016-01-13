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

// # module: metamagical/assertions
//
// This module contains assertions that are shared between the
// modules at this level of the project.

// ### function: assertObject(value)
//
// Makes sure that `value` is an object.
function assertObject(value) {
  if (Object(value) !== value) {
    var kind = value === null?       'null'
    :          value === undefined?  'undefined'
    :          /* otherwise */       'a primitive value (' + JSON.stringify(value) + ')';

    throw new TypeError("Meta:Magical can only associate meta-data with objects, but you're trying to use " + kind);
  }
}


// -- Exports ----------------------------------------------------------
module.exports = {
  assertObject: assertObject
};
