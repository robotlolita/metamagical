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

/*~
 * Constructs a Meta:Magical browser.
 *
 * The Browser is parameterised over a Meta:Magical interface, so before
 * you can browse objects you must provide the proper interface:
 *
 *     const Interface = require('metamagical-interface');
 *     const Browser   = require('metamagical-repl')(Interface);
 *
 *     // Browser can now be used to inspect objects:
 *     Browser.for(yourObject).summary();
 *
 *     // The browser starts inspecting itself, so you can look at
 *     // its properties easily:
 *     Browser.summary();
 *     Browser.forProperty("for").documentation()
 *
 * ---
 * category  : Constructing
 * stability : experimental
 * type: |
 *   (Interface) => Browser
 */
module.exports = function(metamagical) {
  return Browser.for(metamagical.for(Browser));
};

module.exports.AST = require('./ast');
module.exports.Browser = require('./browser');
module.exports.TerminalDisplay = require('./terminal-display');
