//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

// This module runs all of the example-based tests defined in the
// documentation for this module.
const metamagical = require('../../');
const defineTests = require('../../../mocha-bridge')(metamagical, describe, it);

defineTests(metamagical);

