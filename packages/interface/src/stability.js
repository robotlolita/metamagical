//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------


// --[ Dependencies ]--------------------------------------------------
const Refinable = require('refinable');


// --[ Implementation ]------------------------------------------------

/*~
 * Handles describing and normalising stability identifiers.
 *
 * ---
 * name     : module stability
 * module   : metamagical-interface/lib/stability
 * category : Metadata
 * platforms:
 *   - ECMAScript 5
 *   - ECMAScript 3 (with `es5-shim`)
 */
module.exports = Refinable.refine({
  /*~
   * Converts a textual identifier of stability to a structured
   * representation of the stability.
   *
   * ---
   * category  : Constructing stability entries
   * stability : stable
   *
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
   * Meta:Magical uses [Node's stability index](https://nodejs.org/dist/latest-v4.x/docs/api/documentation.html#documentation_stability_index)
   *
   * ---
   * stability : stable
   * category  : Stability index
   */
  index: {
    /*~
     * Describes deprecated features.
     *
     * ---
     * stability : stable
     * category  : Stability entry
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
     * Describes experimental features.
     *
     * ---
     * stability : stable
     * category  : Stability entry
     */
    experimental: Refinable.refine({
      index: 1,
      name:  'Experimental',
      description: `
This feature is experimental and likely to change (or be removed) in the
future.`
    }),

    /*~
     * Describes stable features.
     *
     * ---
     * stability : stable
     * category  : Stability entry
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
     * Describes locked features.
     *
     * ---
     * stability : stable
     * category  : Stability entry
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
