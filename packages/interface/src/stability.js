//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


// -- DEPENDENCIES -----------------------------------------------------
const Refinable = require('refinable');


// -- IMPLEMENTATION ---------------------------------------------------

/*~
 * Handles describing and normalising stability identifiers.
 *
 * ---------------------------------------------------------------------
 * name        : module stability
 * module      : metamagical-interface/lib/stability
 * copyright   : (c) 2016 Quildreen Motta
 * licence     : MIT
 * repository  : https://github.com/origamitower/metamagical
 *
 * category    : Metadata
 * portability : portable
 * platforms:
 *   - ECMAScript 5
 *   - ECMAScript 3, with es5-shim
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 */
module.exports = Refinable.refine({
  /*~
   * Converts a textual identifier of stability to a structured
   * representation of the stability.
   *
   * -------------------------------------------------------------------
   * category  : Converting to other types
   * stability : stable
   *
   * signature: .fromIdentifier(id)
   * type: |
   *   Stability.(String) => StabilityEntry
   */
  fromIdentifier(id) {
    if (this.index.hasOwnProperty(id)) {
      return this.index[id];
    } else {
      throw new Error(`No stability with id "${id}"`);
    }
  },


  /*~
   * An index of valid stability identifiers.
   *
   * ---
   * stability : stable
   * category  : Data
   */
  index: {
    /*~
     * ---
     * stability : stable
     * category  : Data
     */
    deprecated: Refinable.refine({
      index: 0,
      name:  'Deprecated',
      description: `
This feature is known to be problematic, and will either be entirely
removed from the system, or completely redesigned. You should not rely
on it.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Data
     */
    experimental: Refinable.refine({
      index: 1,
      name:  'Experimental',
      description: `
This feature is experimental and likely to change (or be removed) in the
future.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Data
     */
    stable: Refinable.refine({
      index: 2,
      name:  'Stable',
      description: `
This feature is stable, and its API is unlikely to change (unless deemed
necessary for security or other important reasons). You should expect
backwards compatibility with the system, and a well-defined and automated
(if possible) migration path if it changes.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Data
     */
    locked: Refinable.refine({
      index: 3,
      name:  'Locked',
      description: `
This API will not change, however security and other bug fixes will still
be applied.`
    })
  }
});
