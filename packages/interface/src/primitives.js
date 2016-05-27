//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------

// --[ Helpers ]-------------------------------------------------------
const VALUE         = Symbol('Primitive.value');
const isPrototypeOf = Function.call.bind(Object.prototype.isPrototypeOf);

function notPrimitive(value) {
  throw new TypeError(`Not a primitive: ${value}`);
}

// --[ Primitives ]----------------------------------------------------

/*~
 * A Primitive provides an annotated representation for JS primitives,
 * which themselves can't be used as an object.
 *
 * This it much simpler to handle a lot of the complexities that come
 * with handling this difference at every call site.
 *
 * ---
 * category  : Wrapper objects
 * stability : experimental
 * isModule  : true
 */
let Primitive = Object.create(null);

// ---[ Types of primitive values ]------------------------------------

/*~
 * Wraps Undefined in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (Undefined) => Primitive
 */
Primitive.Undefined = function(value) {
  if (value !== undefined) {
    throw new TypeError('Expected undefined');
  }

  /*~
   * An Undefined value.
   *
   * This object provides an annotated representation for the underlying
   * Undefined JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "Undefined"
   */
  const Undefined = Primitive.of(value);

  return Undefined;
};

/*~
 * Wraps Null in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (Null) => Primitive
 */
Primitive.Null = function(value) {
  if (value !== null) {
    throw new TypeError('Expected null');
  }

  /*~
   * A null value.
   *
   * This object provides an annotated representation for the underlying
   * null JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "Null"
   */
  const Null = Primitive.of(value);

  return Null;
};

/*~
 * Wraps Boolean in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (Boolean) => Primitive
 */
Primitive.Boolean = function(value) {
  if (typeof value !== "boolean") {
    throw new TypeError('Expected Boolean');
  }

  /*~
   * A Boolean.
   *
   * This object provides an annotated representation for the underlying
   * boolean JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "Boolean"
   */
  const Boolean = Primitive.of(value);

  return Boolean;
};

/*~
 * Wraps Number in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (Number) => Primitive
 */
Primitive.Number = function(value) {
  if (typeof value !== "number") {
    throw new TypeError('Expected Number');
  }

  /*~
   * A Number.
   *
   * This object provides an annotated representation for the underlying
   * number JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "Number"
   */
  const Number = Primitive.of(value);

  return Number;
};

/*~
 * Wraps String in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (String) => Primitive
 */
Primitive.String = function(value) {
  if (typeof value !== "string") {
    throw new TypeError('Expected String');
  }

  /*~
   * A String.
   *
   * This object provides an annotated representation for the underlying
   * string JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "String"
   */
  const String = Primitive.of(value);

  return String;
};

/*~
 * Wraps Symbol in a Primitive object.
 *
 * ---
 * category  : Types of primitive values
 * stability : experimental
 * type: |
 *   (Symbol) => Primitive
 */
Primitive.Symbol = function(value) {
  if (typeof value !== "symbol") {
    throw new TypeError('Expected Symbol');
  }

  /*~
   * A Symbol.
   *
   * This object provides an annotated representation for the underlying
   * symbol JS primitive.
   *
   * ---
   * category  : JavaScript primitives
   * stability : experimental
   * type: "Symbol"
   */
  const Symbol = Primitive.of(value);

  return Symbol;
};



// ---[ Creating primitives ]------------------------------------------

/*~
 * Constructs a new primitive containing the given value.
 *
 * ---
 * category  : Constructing primitives
 * stability : experimental
 * type: |
 *   (primitive) => Primitive
 */
Primitive.of = function(value) {
  let result = Object.create(Primitive);
  result[VALUE] = value;
  return result;
};

/*~
 * Converts a regular primitive value to a Primitive object, or does
 * nothing if that's already wrapped.
 *
 * ---
 * category  : Constructing primitives
 * stability : experimental
 * type: |
 *   (primitive or Primitive) => Primitive
 */
Primitive.from = function(value) {
  if (isPrototypeOf(Primitive, value)) {
    return value;
  } else {
    return value === null             ?  Primitive.Null(value)
    :      value === undefined        ?  Primitive.Undefined(value)
    :      typeof value === "boolean" ?  Primitive.Boolean(value)
    :      typeof value === "number"  ?  Primitive.Number(value)
    :      typeof value === "string"  ?  Primitive.String(value)
    :      typeof value === "symbol"  ?  Primitive.Symbol(value)
    :      /* otherwise */               notPrimitive(value);
  }
};


// --[ Exports ]-------------------------------------------------------
module.exports = Primitive;
