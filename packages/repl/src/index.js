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
module.exports = {
  browse(metadata) {
    return Browser.for(metadata);
  }
};
