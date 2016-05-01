//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

/*~
 * Assertions used by other modules.
 *
 * ---
 * name        : module assertions
 * module      : metamagical-interface/assertions
 * copyright   : (c) 2016 Quildreen Motta
 * licence     : MIT
 * repository  : https://github.com/origamitower/metamagical
 *
 * category    : Assertions
 * portability : portable
 * platforms:
 *   - ECMAScript 3
 *
 * maintainers:
 *   - Quildreen Motta <queen@robotlolita.me>
 */
module.exports = {
  /*~
   * Makes sure that `value` is an object.
   *
   * ---
   * category  : Assertions
   * stability : stable
   *
   * throws:
   *   TypeError: when the value isn't an object.
   *
   * signature: assertObject(value)
   * type: |
   *   (Any) => None :: throws TypeError
   */
  assertObject(value) {
    if (Object(value) !== value) {
      var kind = value === null?       'null'
      :          value === undefined?  'undefined'
      :          /* otherwise */       'a primitive value (' + JSON.stringify(value) + ')';

      throw new TypeError("Meta:Magical can only associate meta-data with objects, but you're trying to use " + kind);
    }
  }
};
