//---------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//---------------------------------------------------------------------


// --[ Shared State ]--------------------------------------------------
let metadata     = new WeakMap();
const metaSymbol = Symbol.for('@@meta:magical');


// --[ Dependencies ]--------------------------------------------------
const Refinable        = require('refinable');
const Maybe            = require('data.maybe');
const { assertObject } = require('./assertions');
const fields           = require('./fields');
const Stability        = require('./stability');

// --[ Aliases ]-------------------------------------------------------
const symbols      = Object.getOwnPropertySymbols;
const propertiesOf = Object.getOwnPropertyNames;
const keys         = Object.keys;
const hasProperty  = Function.call.bind(Object.prototype.hasOwnProperty);
const descriptorOf = Object.getOwnPropertyDescriptor;
const prototypeOf  = Object.getPrototypeOf;


// --[ Helpers ]-------------------------------------------------------

/*~
 * Returns a getter or setter in an object.
 */
function getGetterSetter(object, name, kind) {
  if (hasProperty(object, name)) {
    const descriptor = descriptorOf(object, name);
    return descriptor[kind] ?  Maybe.Just(descriptor[kind])
    :      /* otherwise */     Maybe.Nothing();
  } else {
    return Maybe.Nothing();
  }
}

/*~
 * Retrieves meta-data from an object (either set directly or associated
 * through the global `WeakMap`).
 */
function getMeta(object) {
  assertObject(object);

  let data = {};
  Object.assign(data, object[metaSymbol] || {});
  Object.assign(data, metadata.get(object) || {});

  return data;
}


/*~
 * Tests if something is an object.
 */
function isObject(x) {
  return Object(x) === x;
}


/*~
 * Returns an array of own values in an object.
 * ---
 * complexity: O(n), `n` is the number of own properties in `object`
 */
function values(object) {
  return propertiesOf(object).map(key => object[key]);
}


/*~
 * Lifts a regular binary function in the domain of Maybe values.
 */
function maybeLift2(maybeA, maybeB, fn) {
  return maybeA.chain(a => maybeB.map(b => fn(a, b)));
}


/*~
 * Flattens one level of a list of lists.
 * ---
 * complexity: O(`xss.length`)
 */
function flatten(xss) {
  return xss.reduce((ys, xs) => ys.concat(xs), []);
}


/*~
 * Checks if an object has a symbol defined in itself.
 */
function hasOwnSymbol(object, symbol) {
  return symbols(object).indexOf(symbol) !== -1;
}


/*~
 * Removes duplicate values from a list.
 * ---
 * complexity: O(`xs.length`)
 */
function unique(xs) {
  return Array.from(new Set(xs));
}


/*~
 * Groups values based on the grouping function provided.
 * ---
 * complexity: O(`xs.length`)
 */
function groupBy(values, groupingFn) {
  let result = new Map();

  array.forEach(value => {
    const key    = groupingFn(value);
    const values = result.get(key) || [];

    values.push(value);
    result.set(key, values);
  });

  return Array.from(result.entries());
}

/*~
 * Returns an array of `key, descriptor` pairs for all own properties
 * in an object.
 * ---
 * complexity: O(number of enumerable properties)
 */
function entriesOf(object) {
  return flatten(propertiesOf(object).map(name => {
    const p = descriptorOf(object, name);

    let result = [];

    if (p.get) {
      result.push({ name, value: p.get, kind: 'getter' });
    }
    if (p.set) {
      result.push({ name, value: p.set, kind: 'setter' });
    }
    if (p.value) {
      result.push({ name, value: p.value, kind: 'value' });
    }

    return result;
  }));
}

/*~
 * Compares two comparable objects.
 */
function compare(a, b) {
  return a < b      ?  -1
  :      a > b      ?   1
  :      /* else */     0;
}

// --[ The Meta:Magical Interface ]------------------------------------

/*~
 * The Meta:Magical interface allows one to query meta-data associated
 * with a particular object, or attach new meta-data to any object
 * without modifying the object.
 *
 *
 * ## Why?
 *
 * Languages like Python, Ruby, Clojure, Smalltalk, and others support
 * interactively exploring their world of objects. For example, in
 * Python, one is able to look at the documentation of an object through
 * the `__doc__` property. In Smalltalk, the platform's browser tells
 * you what classes you have, which methods are available on them, their
 * source code, documentation, all in a searchable interactive
 * environment.
 *
 * JavaScript has a very limited support for this kind of reflective
 * capabilities. One may, for example, ask which properties an object
 * has, what's the name of a function, or its source, but there isn't
 * much beyond that which we could benefit from while exploring a
 * particular library in the REPL. There's nothing in JavaScript that
 * reifies a concept of documentation, making it accessible at runtime.
 *
 * In order to support a more exploration-driven interactive development
 * of applications, and even more accurate documentation in more static
 * forms (given that JavaScript is too dynamic to lend itself well to
 * static analysis documentation tools usually rely on), Meta:Magical
 * allows people to attach new, arbitrary meta-data to any object in the
 * system, and query that meta-data later.
 *
 * The Meta:Magical project is heavily influenced by work on Smalltalk
 * reflective environments, and Clojure's take on meta annotations for
 * runtime values, and this interface aims to be the basis of better
 * tooling for discoverable interactive environments and documentation
 * tools.
 *
 *
 * ## How Meta:Magical handles metadata?
 *
 * JavaScript has a prototype-based object-orientation model, which
 * basically means that each object defines its own layout (the methods,
 * properties, fields, etc. it has), rather than linking to a class that
 * defines such. Alongside the possibility of adding or modifying
 * properties in an object at any time, and the new `Symbol` feature,
 * this allows us to attach arbitrary meta-data to any object without
 * risking conflicts.
 *
 * There are two ways in which Meta:Magical supports attaching meta-data
 * to an object:
 *
 *   - By assigning an object to the global Meta:Magical symbol:
 *
 *         object[Symbol.for('@@meta:magical')] = { ... };
 *
 *   - By using the Interface's `.set()` method, which assigns meta-data
 *     to an object using an internal `WeakMap` to avoid problems
 *     modifying non-owned objects, specially those that have been
 *     frozen::
 *
 *         const frozen = Object.freeze({});
 *         Interface.for(frozen).set('name', 'frozen');
 *
 * Meta-data associated with an object through the `WeakMap` has
 * precedence over meta-data attached directly on the object, as a
 * property. This allows people to refine existing meta-data and provide
 * new ones for objects from the outside.
 *
 *
 * ## Querying meta-data
 *
 * The Meta:Magical interface is an object that wraps another object,
 * and lets you reflect over meta-properties associated with that
 * object, by both querying or updating them.
 *
 * The `object` method defines which object this interface is looking
 * at. By default, the interface starts looking at itself, but it can be
 * refined to look at another object, which can be done by inheriting
 * from it explicitly or just using the `.for()` method::
 *
 *     Interface.getByName('name');
 *     // ==> 'Interface'
 *
 *     const getInterface = Interface.for(Interface.getByName);
 *     getInterface.getByName('name');
 *     // ==> 'getByName'
 *
 *     const myInterface = getInterface.for(Interface);
 *     myInterface.getByName('name');
 *     // ==> 'Interface'
 *
 * At any point you can use the `object` method to retrieve the
 * object the interface is looking at:
 *
 *     Interface.object
 *     // ==> Interface
 *
 *
 * ### Containership and Inheritance
 *
 * Objects form hierarchies of data, but given a JavaScript object
 * one is only able to ask which objects are under that, it's not
 * possible to query which objects contains a particular value.
 * This makes interactive exploration in a REPL harder, because
 * we can't figure out the context of a particular value (where
 * does this belong to?).
 *
 * To solve this, Meta:Magical introduces a special piece of metadata,
 * `belongsTo`, which lazily provides the missing link::
 *
 *     const root = {
 *       child: { }
 *     };
 *     root.child[Symbol.for('@@meta:magical')] = {
 *       belongsTo() { return root },
 *       name: 'child'
 *     };
 *
 * This allows one to retrieve which object canonically holds the
 * definition of a particular value. So, if one has a function like
 * `get`, they can retrieve the broader context in which this function
 * lives::
 *
 *     const getMeta = Interface.forObject(Interface.get);
 *     getMeta.getByName('belongsTo').getOrElse(null)();
 *     // ==> Interface
 *
 * Internally, Meta:Magical uses this information to propagate some
 * metadata from the broader context (parent object) to the current
 * context. Things such as `licence`, `repository`, `copyright`, and
 * others allow this kind of inheritance::
 *
 *     root[Symbol.for('@@meta:magical')] = {
 *       licence: 'CC0'
 *     };
 *
 *     Interface.for(root.child).getInherited('licence').getOrElse(null);
 *     // ==> 'CCO'
 *
 *
 * ### Propagation
 *
 * Another aspect that's important when you have a hierarchy of objects
 * is that objects are made out of several smaller pieces. And these
 * pieces impact the metadata about the top objects. For example, if
 * a module contains a single experimental function, then it might make
 * sense to mark the module as experimental.
 *
 * Meta:Magical supports this through the concept of propagation. Given
 * a root object, and a metadata field, one may retrieve all of the
 * values for that field in all objects contained in it. The interface
 * handles all of the recursion and cycles for you::
 *
 *     const root = {
 *       childA: {
 *         childB: { }
 *       }
 *     };
 *     root.childA[Symbol.for('@@meta:magical')] = {
 *       stability: 'experimental'
 *     };
 *     root.childB[Symbol.for('@@meta:magical')] = {
 *       stability: 'stable'
 *     };
 *
 *     Interface.for(root).getPropagatedMeta('stability');
 *     // ==> ['experimental', 'stable']
 *
 *
 * ### Simplifying querying with fields
 *
 * Because different pieces of metadata have different behaviours
 * with inheritance and propagation, and because propagated metadata
 * needs to be merged for it to make sense (an array of stability
 * indexes is often meaningless, for example), Meta:Magical has a
 * concept of fields.
 *
 * `Field`s are an object that describe how a particular metadata
 * is handled, providing a name, inheritance and propagation
 * behaviours, and a way to merge metadata. All of this is used
 * by the `.get()` method to provide a value for the metadata.
 *
 * Taking the example in the previous section, a field could
 * provide an overall stability for the whole module::
 *
 *     const root = {
 *       childA: {
 *         childB: { }
 *       }
 *     };
 *     root.childA[Symbol.for('@@meta:magical')] = {
 *       stability: 'experimental'
 *     };
 *     root.childB[Symbol.for('@@meta:magical')] = {
 *       stability: 'stable'
 *     };
 *
 *     const stability = Interface.fields.stability;
 *     Interface.for(root).get(stability).getOrElse(null);
 *     // ==> 'experimental'
 *
 *     Interface.for(root.childA.childB).get(stability).getOrElse(null);
 *     // ==> 'stable'
 *
 * For more information on fields, see the `.fields` property
 * exposed by the interface.
 *
 *
 * ## Updating meta-data
 *
 * The interface object also handles updating meta-data. The newly
 * associated meta-data is stored in a `WeakMap`, rather than on the
 * object itself, to avoid problems with modifying unowned, and frozen
 * objects.
 *
 * In order to associate new metadata one needs to construct an
 * `Interface` pointing to the object one wants to associate metadata
 * with, and then use the `.set(name, value)` to update the metadata::
 *
 *     const x = {};
 *     const xMeta = Interface.for(x);
 *     xMeta.set('name', 'x');
 *     xMeta.getByName('name'); // ==> 'x'
 *
 * Multiple metadata may be provided as an object through the
 * `.update(meta)` method. All own enumerable key/value pairs provided
 * will replace the existing metadata on the object::
 *
 *     xMeta.update({ name: 'X' });
 *     xMeta.getByName('name'); // ==> 'X'
 *
 *
 * ## Known issues with Meta:Magical
 *
 * Meta:Magical's use of global symbols for associating meta-data with
 * the objects doesn't have any issues, although in the unlikely event
 * that someone uses a global symbol with the `"@@meta:magical"` key
 * that would conflict with this library's use of the symbol. As long as
 * you only use the Symbol approach, there are no problems to worry
 * about.
 *
 * The use of a `WeakMap` to keep track of additional metadata for
 * unowned objects, on the other hand, is somewhat of a problem due to
 * JavaScript's semantics:
 *
 *   - The `metamagical-interface` library should be loaded only once.
 *     Because the library relies on a single `WeakMap` to keep track
 *     of additional metadata, having different libraries (and
 *     consequently different state) would lead to inconsistencies and
 *     unpredictable behaviour.
 *
 *   - All code realms should share the same instance of the
 *     `metamagical-interface`. Because a JavaScript VM may have
 *     different Code Realms (essentially, global execution contexts),
 *     it's important that all of them share the same Interface
 *     instance, otherwise metadata attached in one realm would not be
 *     visible in another.
 *
 *   - The `metamagical-interface` module uses reference equality, so it
 *     will treat objects from different realms as different objects, as
 *     it will treat duplicated isntances of a particular module (as
 *     could happen in npm) as different objects. There is no way of
 *     avoiding this problem.
 *
 * To ensure that one only has a single instance of the
 * `metamagical-interface` module in their application, all modules that
 * depend on this interface should be parameterised and expect an
 * outsider to provide the proper object, rather than require it
 * directly. In essence, modules that depend on the
 * `metamagical-interface` should be written as:
 *
 *     module.exports = function(metamagical) {
 *       return {
 *         foo() { return metamagical.get('name') }
 *       };
 *     }
 *
 * Rather than:
 *
 *     const metamagical = require('metamagical-interface');
 *     module.exports = {
 *       foo() { return metamagical.get('name') }
 *     }
 *
 * ---
 * module    : metamagical-interface
 * category  : Metadata
 * stability : experimental
 * platforms:
 *   - ECMAScript 2015
 */
const Interface = Refinable.refine({
  // ---[ Related objects ]--------------------------------------------
  fields: fields,
  Stability: Stability,

  // ---[ State & Configuration ]--------------------------------------

  /*~
   * The current context of the Meta:Magical interface.
   *
   * A Meta:Magical interface has a current context, that is the
   * object to retrieve metadata from, or associate new metadata
   * with. This method provides such context.
   *
   * By default the interface starts looking at itself. But this
   * can be changed by inheriting from the interface::
   *
   *     const x = {
   *       [Symbol.for('@@meta:magical')]: {
   *         name: 'x'
   *       }
   *     };
   *     const meta = Interface.refine({
   *       object: x
   *     });
   *
   *     meta.get('name'); // ==> 'x'
   *
   * A much more convenient way of changing the context is by using
   * the `.for(object)` method, however::
   *
   *     Interface.for(x).get('name'); // ==> 'x'
   *
   * ---
   * category: State and configuration
   *
   * seeAlso:
   *   - type: entity
   *     path: .for
   *     reason: A convenience method for changing the context.
   *
   * type: |
   *   Interface. => Object 'a
   */
  get object() {
    return this;
  },


  /*~
   * Changes the current context of the Meta:Magical object.
   *
   * This method allows changing the current context of the object
   * in a more convenient way than explicitly inheriting from the
   * object::
   *
   *     const x = {
   *       [Symbol.for('@@meta:magical')]: {
   *         name: 'x'
   *       }
   *     };
   *     const xMeta = Interface.for(x);
   *     xMeta.get('name'); // ==> 'x'
   *
   * ---
   * category: State and configuration
   *
   * seeAlso:
   *   - type: entity
   *     path: .object
   *     reason: Retrieving the current context of the interface.
   *
   * type: |
   *   (proto is Interface).(Object 'a) => Interface <: proto
   */
  for(value) {
    assertObject(value);

    return this.refine({
      object: value
    });
  },


  // ---[ Auxiliary Methods for Querying Metadata ]--------------------

  /*~
   * Retrieves metadata defined directly on the current interface's context.
   *
   * ::
   *     const x = {[Symbol.for('@@meta:magical)]: {
   *       name: 'x'
   *     }};
   *
   *     Interface.for(x).getOwnMeta('name').getOrElse('Anonymous');
   *     // ==> 'x'
   *     Interface.for({}).getOwnMeta('name').getOrElse('Anonymous');
   *     // ==> 'Anonymous'
   *
   * ---
   * category: Auxiliary methods for querying metadata
   * type: |
   *   Interface.(String) => Maybe Any
   */
  getOwnMeta(name) {
    const meta = getMeta(this.object);

    return name in meta ?   Maybe.Just(meta[name])
    :      /* otherwise */  Maybe.Nothing();
  },


  /*~
   * Retrieves metadata defined in the closest parent for the interface's
   * context.
   *
   * In JavaScript objects may contain other objects, but we can't know
   * what object contains another object (given that many objects might).
   * In order to support inherited meta-data for classes and objects,
   * Meta:Magical allows one to annotate this missing link with the
   * `belongsTo` field::
   *
   *     const root = {
   *       child: { }
   *     };
   *     root[Symbol.for('@@meta:magical')] = {
   *       category: 'Objects'
   *     };
   *     root.child[Symbol.for('@@meta:magical')] = {
   *       belongsTo() { return root; }
   *     };
   *
   * One may then ask for the meta-data in this containership-chain::
   *
   *     Interface.for(root.child)
   *              .getInheritedMeta('category')
   *              .getOrElse('Uncategorised');
   *     // ==> 'Objects'
   *
   *     Interface.for(root)
   *              .getInheritedMeta('category')
   *              .getOrElse('Uncategorised');
   *     // ==> 'Uncategorised'
   *
   * ---
   * category: Auxiliary methods for querying metadata
   * type: |
   *   Interface.(String) => Maybe Any
   */
  getInheritedMeta(name) {
    return this.getOwnMeta('belongsTo').chain(parent =>
      this.for(parent).getOwnMeta(name).orElse(_ =>
        this.for(parent).getInheritedMeta(name)
      )
    );
  },


  /*~
   * Retrieves metadata defined in the children of the interface's context.
   *
   * This gives you an array of the values for the given metadata field defined
   * in the children (direct or indirect) of the current interface's context::
   *
   *     const root = {
   *       childA: { },
   *       childB: { }
   *     };
   *     childA[Symbol.for('@@meta:magical')] = {
   *       stability: 'experimental'
   *     };
   *     childA[Symbol.for('@@meta:magical')] = {
   *       stability: 'stable'
   *     };
   *
   *     Interface.for(root).getPropagatedMeta('stability');
   *     // ==> ['experimental', 'stable']
   *
   * ---
   * category   : Auxiliary methods for querying metadata
   * complexity : O(n), `n` is the number of obects inside the current context
   *
   * type: |
   *   Interface.(String) => Array Any
   */
  getPropagatedMeta(name) {
    let visited = new Set();

    const collectFrom = (meta) => {
      const object = meta.object;

      visited.add(object);

      return flatten(values(object).filter(isObject).map(child => {
        if (visited.has(child)) {
          return [];
        } else {
          const childMeta = this.for(child);
          return childMeta.getOwnMeta(name)
                          .map(x => [x])
                          .getOrElse([])
                          .concat(collectFrom(childMeta));
        }
      }));
    };

    return collectFrom(this);
  },


  // ---[ Querying Metadata ]------------------------------------------

  /*~
   * Retrieves metadata for the given field from the interface's current
   * context.
   *
   * This will try retrieving metadata stored directly in the current context,
   * and fallback to metadata inherited from a parent object (through the
   * `belongsTo` metadata), or metadata propagated from the values of the
   * properties in the object, if the provided field allows either.
   *
   * ---
   * category   : Querying metadata
   * complexity : O(n), `n` is the number of objects inside the current context
   *
   * type: |
   *   Interface.(Field) => Maybe Any
   */
  get(field) {
    return this.getOwnMeta(field.name)
               .orElse(_ =>
                 field.allowInheritance ?  this.getInheritedMeta(field.name)
                 : /* otherwise */         Maybe.Nothing()
               ).orElse(_ =>
                 field.allowPropagation ?  field.merge(this.getPropagatedMeta(field.name))
                 : /* otherwise */         Maybe.Nothing()
               );
  },

  /*~
   * Retrieves metadata with the given name from the interface's current context.
   *
   * ---
   * category   : Querying metadata
   * complexity : O(n), `n` is the number of objects inside the current context
   *
   * type: |
   *   Interface.(String) => Maybe Any
   */
  getByName(name) {
    return this.get(this.fields.Field.refine({ name }));
  },


  // ---[ Updating Metadata ]------------------------------------------

  /*~
   * Updates a single metadata field associated with the current interface's
   * context.
   *
   * ::
   *     const a     = Object.freeze({});
   *     const aMeta = Interface.for(a);
   *
   *     aMeta.get('name').getOrElse('Anonymous');  // ==> 'Anonymous'
   *
   *     aMeta.set('name', 'a');   // ==> aMeta
   *     aMeta.get('name').get();  // ==> 'a'
   *
   * This operation associates new metadata with the current interface's context.
   * Metadata is attached by using the internal `WeakMap`, and as such can be
   * used for frozen objects as well.
   *
   * > | **NOTE**
   * > | Since this relies on a global `WeakMap`, it's subject to the
   * > | limitations described in the `Interface`.
   *
   * ---
   * category: Querying and updating metadata
   *
   * seeAlso:
   *   - type: entity
   *     path: .update
   *     reason: Convenience for updating multiple metadata fields
   *
   * type: |
   *   (a is Interface).(String, Any) => Interface :: mutates a
   */
  set(field, value) {
    const object = this.object();
    let meta     = metadata.get(object) || {};

    meta[field] = value;
    metadata.set(object, meta);

    return this;
  },


  /*~
   * Updates many metadata fields associated with the current interface's
   * context.
   *
   * ::
   *     const a     = Object.freeze({});
   *     const aMeta = Interface.for(a);
   *
   *     aMeta.get('type').getOrElse('Unknown'); // ==> 'Unknown'
   *
   *     aMeta.update({ name: 'a', type: 'Object' }); // ==> aMeta
   *     aMeta.get('name').get();  // ==> 'a'
   *     aMeta.get('type').get();  // ==> 'Object'
   *
   * This operation associates new metadata with the current interface's context.
   * Metadata is attached by using the internal `WeakMap`, and as such can be
   * used for frozen objects as well.
   *
   * > | **NOTE**
   * > | Since this relies on a global `WeakMap`, it's subject to the
   * > | limitations described in the `Interface`.
   *
   * ---
   * category: Querying and updating metadata
   *
   * type: |
   *   (a is Interface).(String, Object Any) => Interface :: mutates a
   */
  update(meta) {
    keys(meta).forEach(key => this.set(key, meta[key]));
  },


  // ---[ Navigating the context ]-------------------------------------

  /*~
   * Returns an interface pointing to the given property of the current
   * context.
   *
   * ::
   *      Interface.property('get').get().object;
   *      // ==> Interface.get
   *
   * ---
   * category: Navigating the context
   * type: |
   *   Interface.(String) => Maybe Interface
   */
  property(name) {
    return name in this.object ?  Maybe.Just(this.for(this.object[name]))
    :      /* otherwise */        Maybe.Nothing();
  },


  /*~
   * Returns an interface pointing to a getter with the given name in the
   * current context.
   *
   * ::
   *     const x = { get value() { } };
   *     const valueGetter = Object.getOwnPropertyDescriptor(x, 'value').get;
   *     Interface.for(x).getter('value').get().object;
   *     // ==> valueGetter
   *
   * ---
   * category: Navigating the context
   * type: |
   *   Interface.(String) => Maybe Interface
   */
  getter(name) {
    return getGetterSetter(this.object, name, 'get').map(x => this.for(x));
  },


  /*~
   * Returns an interface pointing to a setter with the given name in the
   * current context.
   *
   * ::
   *     const x = { set value(arg){ } };
   *     const valueSetter = Object.getOwnPropertyDescriptor(x, 'value').set;
   *     Interface.for(x).setter('value').get().object;
   *     // ==> valueSetter
   *
   * ---
   * category: Navigating the context
   * type: |
   *   Interface.(String) => Maybe Interface
   */
  setter(name) {
    return getGetterSetter(this.object, name, 'set').map(x => this.for(x));
  },


  /*~
   * Returns an interface pointing to the prototype of the current context's
   * `[[Prototype]]`.
   *
   * ::
   *     const x = {};
   *     const y = Object.create(x);
   *     Interface.for(y).prototype().get().object;
   *     // ==> x
   */
  prototype() {
    const parent = prototypeOf(this.object);
    return parent != null ?  Maybe.Just(this.for(parent))
    :      /* otherwise */   Maybe.Nothing();
  },


  // ---[ Additional reflective methods ]------------------------------

  /*~
   * Retrieves a categorised list of properties owned by the current
   * context.
   *
   * ---
   * category: Additional reflective methods
   * type: |
   *   type PropertyKind is 'value' or 'getter' or 'setter'
   *   type Property     is { name: String, value: Any, kind: PropertyKind }
   *
   *   Interface.() => Array { category: String, members: Array Property }
   */
  properties() {
    const byName     = (a, b) => compare(a.name, b.name);
    const byCategory = (a, b) => compare(a.category, b.category);

    const sortedProperties = (object) => entriesOf(object).sort(byName);
    const asCategoryObject = ([category, members]) => ({ category, members });

    const category = ({ value }) =>
      isObject(value) ?  this.for(value).get('category').getOrElse('(Uncategorised)')
      : /* else */       '(Uncategorised)';

    return groupBy(sortedProperties(this.object), category)
             .map(asCategoryObject)
             .sort(byCategory);
  }
});


// --[ Exports ]-------------------------------------------------------
module.exports = Interface;
