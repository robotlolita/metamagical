//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Dependencies ]--------------------------------------------------
const Browser = require('./browser');


// --[ Module ]--------------------------------------------------------
module.exports = function(metamagical) {
  return Browser.for(metamagical.for(Browser));
};
