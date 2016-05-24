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
const Maybe     = require('data.maybe');
const Stability = require('./stability');


// --[ Helpers ]-------------------------------------------------------
function required(object, name) {
  throw new Error(`This ${object} does not define ${name}.

You must refine this object and define the missing property before
you can use it. For example:

    const newObject = ${object}.refine({ ${name}: ... });
  `);
}

function unique(xs) {
  return [...new Set(xs)];
}

function flatten(xss) {
  return xss.reduce((l, r) => l.concat(r), []);
}


// --[ Base for Fields ]-----------------------------------------------

/*~
 * Provides a base for a Field definition used by Meta:Magical.
 *
 * A field describes how Meta:Magical handles a particular annotation.
 * Annotations are uniquely identified by their names. Fields must at
 * least define the name of the annotation they apply to::
 *
 *     const documentation = Field.refine({ name: 'documentation' });
 *
 *
 * ## Inheritance and Propagation
 *
 * An annotation may be inherited from a parent object, or it may
 * propagate from child objects. Fields control whether any of these
 * apply to a particular annotation by specifying the `allowInheritance`
 * and `allowPropagation` properties::
 *
 *     const a = Field.refine({ name: 'a', allowInheritance: true });
 *     const b = Field.refine({ name: 'b', allowPropagation: true });
 *
 * By default, both of these are false.
 *
 * When a field allows the annotation to be propagated, it also must
 * define how the different values for that annotation defined in its
 * children are merged, by providing a `merge` method. The `merge`
 * method receives an array of all values in the children objects,
 * and returns the new value for that annotation, wrapped in a Maybe::
 *
 *     const Maybe = require('data.maybe');
 *
 *     const authors = Field.refine({
 *       name: 'authors',
 *       allowPropagation: true,
 *       merge(values) {
 *         return Maybe.Just([...new Set(values)])
 *       }
 *     });
 *
 * See the `Interface` object for more information on how it handles
 * propagation and inheritance.
 *
 * ---
 * module   : metamagical-interface/lib/fields
 * category : Describing annotations
 * platforms:
 *   - ECMAScript 5
 *
 * type: |
 *   Field 'a <: Refinable
 */
const Field = Refinable.refine({
  /*~
   * The name of the annotation this Field describes.
   *
   * ---
   * isRequired : true
   * category   : State and Configuration
   * stability  : stable
   *
   * type: String
   */
  get name() {
    required('Field', 'name');
  },

  /*~
   * Whether the annotation should be inherited from a parent object
   * if not defined directly in the object.
   *
   * ---
   * category  : Inheritance and Propagation
   * stability : stable
   *
   * type: Boolean
   */
  get allowInheritance() {
    return false;
  },

  /*~
   * Whether the annotation should be propagated from children obects
   * if not defined directly in the object.
   *
   * Note that you should provide your own merging strategy, through
   * the `merge` method, if your annotation supports propagation.
   *
   * ---
   * category  : Inheritance and Propagation
   * stability : stable
   *
   * type: Boolean
   */
  get allowPropagation() {
    return false;
  },

  /*~
   * Merges annotations that have been propagated from children
   * objects.
   *
   * ---
   * category  : Inheritance and Propagation
   * stability : stable
   *
   * type: |
   *   (Array 'a) => Maybe 'b
   */
  merge(values) {
    return Maybe.Just(values);
  }
});


// --[ Built-in Fields ]-----------------------------------------------

/*~
 * This module provides a set of built-in fields that Meta:Magical
 * knows about, as well as a way of defining new fields.
 *
 * ---
 * module   : metamagical-interface/lib/fields
 */
module.exports = {
  Field: Field,

  // ---[ Social Metadata ]--------------------------------------------

  /*~
   * Provides copyright information about a particular object.
   *
   * This is usually a String in the form of `"(c) 2016 Some Name"`,
   * and is commonly just output as-is by the documentation browsers.
   *
   * Copyright may be inherited from a parent object, but it may not
   * be propagated.
   *
   * ---
   * category  : Social Metadata
   * stability : stable
   * type: Field String
   */
  copyright: Field.refine({
    name: 'copyright',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Provides a list of people who have authored the object.
   *
   * This is an array of Person objects, where a Person must
   * at least have a `name` field, but may also include
   * additional contact information:
   *
   *     { name: "Quildreen Motta", email: "queen@robotlolita.me" }
   *
   * Authors may be inherited from a parent object or propagated
   * from children objects. When propagated, only unique *names*
   * are kept.
   *
   * ---
   * category  : Social Metadata
   * stability : experimental
   * type: |
   *   type Person = {
   *     name: String,
   *     email?: String,
   *     url?: String
   *   }
   *   Field (Array Person)
   */
  authors: Field.refine({
    name: 'authors',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(flatten(values)));
    }
  }),

  /*~
   * Provides a list of people who maintain the object.
   *
   * This is an array of Person objects, where a Person must
   * at least have a `name` field, but may also include
   * additional contact information:
   *
   *     { name: "Quildreen Motta", email: "queen@robotlolita.me" }
   *
   * Because this field is used to present the people who are in
   * charge of fixing bugs in the object or adding new features to
   * it, it's strongly recommended to include an `email` for each
   * of the people in the list, so people may contact them.
   *
   * Maintainers may be inherited from a parent object or propagated
   * from child objects. When propagated, only unique *names*
   * are kept.
   *
   * ---
   * category  : Social Metadata
   * stability : experimental
   * type: |
   *   type Person = {
   *     name: String,
   *     email?: Email,
   *     url?: String
   *   }
   *   Field (Array Person)
   */
  maintainers: Field.refine({
    name: 'maintainers',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(flatten(values)));
    }
  }),

  /*~
   * Provides the licence under which the code is released.
   *
   * This is ideally a valid [SPDX index](http://spdx.org/licenses/),
   * so browsers may link to the full text of the licence.
   *
   * Licences may be inherited from a parent object, but they may
   * not propagate.
   *
   * ---
   * category  : Social Metadata
   * stability : stable
   * type: Field String
   */
  licence: Field.refine({
    name: 'licence',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Provides the version in which the feature was introduced.
   *
   * This is ideally a valid [semantic version](http://semver.org/),
   * but might use another format if your project doesn't follow
   * semver.
   *
   * Versions may be inherited from a parent object, since child
   * objects are assumed to have been introduced at the same time
   * a parent was, unless otherwise noted. Versions may not be
   * propagated.
   *
   * ---
   * category  : Social Metadata
   * stability : stable
   * type: Field String
   */
  since: Field.refine({
    name: 'since',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Provides a deprecation warning for the object.
   *
   * When defined, the `deprecated` annotation must provide the
   * version in which the object was deprecated, the reason for
   * deprecating it, and whether any substitute functionality
   * exists.
   *
   * Deprecated annotations can be inherited from parent objects,
   * since we assume that deprecating an object automatically
   * deprecates all of its children. Deprecated annotations cannot
   * be propagated.
   *
   * ---
   * category  : Social Metadata
   * stability : experimental
   * type: |
   *   type Deprecation = {
   *     version: String
   *     reason: String
   *     replacedBy?: String
   *   }
   */
  deprecated: Field.refine({
    name: 'deprecated',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Provides the source repository where the object lives in.
   *
   * This is the URL of the source repository where the project
   * that provides the object lives in.
   *
   * ---
   * category  : Social Metadata
   * stability : stable
   * type: Field String
   */
  repository: Field.refine({
    name: 'repository',
    allowInheritance: true
  }),

  /*~
   * Provides the stability of the object being described.
   *
   * The stability must be a valid stability index, as defined in
   * the `Stability` object.
   *
   * Stability can be inherited, and it can be propagated. When
   * propagating, the worse stability is kept.
   *
   * ---
   * category  : Social Metadata
   * stability : experimental
   * type: |
   *   type StabilityId = 'deprecated'
   *                    | 'experimental'
   *                    | 'stable'
   *                    | 'locked'
   *   Field StabilityId
   */
  stability: Field.refine({
    name: 'stability',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      if (values.length === 0) {
        return Maybe.Nothing();
      } else {
        return Maybe.Just(values.reduce((l, r) => {
          const left  = Stability.fromIdentifier(l).index;
          const right = Stability.fromIdentifier(r).index;

          return left < right ?  l
          :      /* else */      r;
        }));
      }
    }
  }),

  /*~
   * Provides an URL for the project website.
   *
   * Homepages can be inherited, but not propagated.
   *
   * ---
   * category  : Social Metadata
   * stability : stable
   * type: Field String
   */
  homepage: Field.refine({
    name: 'homepage',
    allowInheritance: true
  }),


  // ---[ Organisational Metadata ]------------------------------------

  /*~
   * Provides a category for the object.
   *
   * Like in Smalltalk and Swift, objects in Meta:Magical are grouped
   * in logical categories to make it easier for people to find the
   * functionality they're looking for. This is particularly important
   * when your object or module has several properties.
   *
   * While there are no restrictions in what one may use as a category,
   * and you should try to provide a grouping that makes sense in your domain,
   * there are a few groups that are considered common:
   *
   *   - `Constructing`, for methods or functions that construct
   *     a particular version of the object.
   *   - `Comparing and Testing`, for things like `equals`, `isEmpty`,
   *     and other predicates.
   *   - `Transforming`, for methods like `map`, where you transform the
   *     contents of the object.
   *   - `Combining`, for methods like `concat`, where you combine two or more
   *     objects into a new one.
   *   - `Handling Errors`, for methods that provide a way of handling errors
   *     captured by the object, like Promise's `catch`.
   *
   * Categories can be neither inherited or propagated.
   *
   * ---
   * category  : Organisational Metadata
   * stability : stable
   * type: Field String
   */
  category: Field.refine({
    name: 'category',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * Provides a set of short terms related to the functionality.
   *
   * Tags help people find functionality when searching for related
   * terms. They can be neither inherited nor propagated.
   *
   * ---
   * category  : Organisational Metadata
   * stability : stable
   * type: Field (Array String)
   */
  tags: Field.refine({
    name: 'tags',
    allowInheritance: false,
    allowPropagation: false
  }),


  // ---[ Definition Metadata ]----------------------------------------

  /*~
   * Provides the npm package the object belongs to.
   *
   * Packages can be inherited, but not propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field String
   */
  npmPackage: Field.refine({
    name: 'npmPackage',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Provides the module the object belongs to.
   *
   * This should be the same module identifier the user can pass to
   * `require()`.
   *
   * Modules can be inherited, but not propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field String
   */
  module: Field.refine({
    name: 'module',
    allowInheritance: true,
    allowPropagation: false
  }),

  /*~
   * Tells whether the object is also a module.
   *
   * While ES6 modules are second class, CommonJS modules are first-class,
   * and in Node modules may be any object. Browsers need to know whether
   * a particular object also doubles as a module for display purposes.
   *
   * This annotation can neither be inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field Boolean
   */
  isModule: Field.refine({
    name: 'isModule',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * Tells whether the object has an implementation or requires one
   * to be provided.
   *
   * This is used for getters and methods, so tools can tell users the
   * expectations of an object, and avoid running code that hasn't been
   * defined yet.
   *
   * This annotation can neither be inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field Boolean
   */
  isRequired: Field.refine({
    name: 'isRequired',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * Provides the object that defines the annotated object.
   *
   * In JavaScript we can't ask an object where it's defined, and
   * even if we could this would lead to multiple answers. The `belongsTo`
   * annotation provides a canonical answer to this question, and is used
   * for things like methods.
   *
   * Because the object containing the annotated object may not
   * be referenceable at the point where the annotated object is created,
   * this annotation requires the object to be provided as a thunk.
   *
   * belongsTo may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field (() => Object 'a)
   */
  belongsTo: Field.refine({
    name: 'belongsTo',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * The canonical name for the object being annotated.
   *
   * name may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field String
   */
  name: Field.refine({
    name: 'name',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * The place where the object is defined.
   *
   * location can be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: |
   *   type Position = {
   *     line: Number,
   *     column: Number
   *   }
   *
   *   Field {
   *     filename: String,
   *     start?: Position,
   *     end?: Position
   *   }
   */
  location: Field.refine({
    name: 'location',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * The original source code for the annotated object.
   *
   * source may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field String
   */
  source: Field.refine({
    name: 'source',
    allowInheritance: false,
    allowPropagation: false
  }),


  // ---[ Usage Metadata ]---------------------------------------------
  /*~
   * The documentation of the annotated object, in Markdown.
   *
   * documentation may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field String
   */
  documentation: Field.refine({
    name: 'documentation',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * An array of example code for the annotated object.
   *
   * examples may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: |
   *   type Example = {
   *     name: String,
   *     call: (() => None),
   *     inferred?: Boolean
   *   }
   *
   *   Array Example
   */
  examples: Field.refine({
    name: 'examples',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * The signature of the entity being annotated.
   *
   * This is mostly used for functions and methods,
   * and should match the way those are defined in the code,
   * like: `doStuff(value, optional = default)`
   *
   * signature may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field String
   */
  signature: Field.refine({
    name: 'signature',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * The type of the entity being annotated.
   *
   * Currently Meta:Magical does nothing with this field, and
   * the value is a String describing a type as described
   * in [this document](https://github.com/origamitower/conventions/blob/master/documentation/type-notation.md).
   *
   * type may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field String
   */
  type: Field.refine({
    name: 'type',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * Describes all errors that may be thrown by the entity being annotated.
   *
   * The value is an object where the key is the name of the error
   * being thrown, and the value is a description of which situations
   * lead to that error being thrown.
   *
   * throws may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field (Object String)
   */
  throws: Field.refine({
    name: 'throws',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * Describes all of the parameters accepted by the entity being annotated.
   *
   * The value is an object where the key is the name of the parameter,
   * and the value is a short description of what it means and how it's
   * used.
   *
   * Longer descriptions are more suited to the documentation metadata.
   *
   * parameters may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field (Object String)
   */
  parameters: Field.refine({
    name: 'parameters',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * A short summary of what the entity being annotated returns when ran.
   *
   * returns may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : stable
   * type: Field String
   */
  returns: Field.refine({
    name: 'returns',
    allowInheritance: false,
    allowPropagation: false
  }),

  /*~
   * A short summary of the algorithmic complexity of the entity being annotated.
   *
   * This is meant to provide only the worst case for now.
   *
   * complexity may be neither inherited nor propagated.
   *
   * ---
   * category  : Definition Metadata
   * stability : experimental
   * type: Field String
   */
  complexity: Field.refine({
    name: 'complexity',
    allowInheritance: false,
    allowPropagation: false
  }),


  // ---[ Execution Metadata ]-----------------------------------------
  /*~
   * A list of platforms that support the entity being annotated.
   *
   * Platforms may be inherited, but not propagated.
   *
   * ---
   * category  : Execution Metadata
   * stability : experimental
   * type: Field (Array String)
   */
  platforms: Field.refine({
    name: 'platforms',
    allowInheritance: true,
    allowPropagation: false,
  }),

  /*~
   * Whether the object being annotated is portable or not.
   *
   * Portability can be inherited. When propagating, an entity is
   * considered portable if all of its children are also portable.
   *
   * ---
   * category  : Execution Metadata
   * stability : experimental
   * type: Field Boolean
   */
  portable: Field.refine({
    name: 'portable',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      if (values.length === 0) {
        return Maybe.Nothing();
      } else {
        return Maybe.Just(values.every(Boolean));
      }
    }
  })

};

