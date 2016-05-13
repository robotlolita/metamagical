//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

/*~
 * Assertions used by other modules.
 *
 * ---
 * name        : module assertions
 * module      : metamagical-interface/lib/assertions
 * category    : Assertions
 * portability : portable
 * platforms:
 *   - ECMAScript 3
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
   * type: |
   *   (Any) => None :: throws TypeError
   */
  assertObject(value) {
    if (Object(value) !== value) {
      const kind = value === null      ?  'null'
      :            value === undefined ?  'undefined'
      :            /* otherwise */        `a primitive value (${JSON.stringify(value)})`;

      throw new TypeError(`Meta:Magical can only associate meta-data with objects, but you're trying to use ${kind}`);
    }
  }
};
