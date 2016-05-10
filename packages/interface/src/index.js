//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------


// -- SHARED STATE -----------------------------------------------------
let metadata     = new WeakMap();
const metaSymbol = Symbol.for('@@meta:magical');


// -- DEPENDENCIES -----------------------------------------------------
const Refinable        = require('refinable');
const Maybe            = require('data.maybe');
const Stability        = require('./stability');
const { assertObject } = require('./assertions');


// -- ALIASES ----------------------------------------------------------
const symbols    = Object.getOwnPropertySymbols;
const properties = Object.getOwnPropertyNames;
const keys       = Object.keys;


// -- HELPERS ----------------------------------------------------------

/*~
 * Retrieves meta-data from an object.
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
 * Returns an array of values in an object.
 */
function values(object) {
  return properties(object).map(key => object[key]);
}

/*~
 */
function maybeLift2(maybeA, maybeB, fn) {
  return maybeA.chain(a => maybeB.map(b => fn(a, b)));
}

function flatten(xss) {
  return xss.reduce((ys, xs) => ys.concat(xs), []);
}

function hasOwnSymbol(object, symbol) {
  return symbols(object).indexOf(symbol) !== -1;
}

function unique(xs) {
  return Array.from(new Set(xs));
}


// -- IMPLEMENTATION ---------------------------------------------------

/*~
 */
module.exports = Refinable.refine({
  /*~
   * The object to retrieve meta-data from.
   */
  object() {
    return this;
  },

  /*~
   * Changes the object to retrieve meta-data from.
   */
  forObject(object) {
    assertObject(object);

    return this.refine({
      object: () => object
    });
  },

  mergingStrategy: {
    authors(xs) {
      return unique(xs);
    },

    stability(xs) {
      if (xs.length === 0) {
        return null;
      } else {
        return xs.reduce((l, r) => {
          const il = Stability.fromIdentifier(l).index;
          const ir = Stability.fromIdentifier(r).index;

          return il < ir    ?  l
          :      /* else */    r;
        });
      }
    },

    portability(xs) {
      if (xs.length === 0) {
        return null;
      } else {
        return xs.reduce((l, r) => {
          return l !== 'portable' || r !== 'portable' ?  'not portable'
          :      /* otherwise */                         'portable';
        });
      }
    }
  },

  /*~
   */
  get(field) {
    const meta = getMeta(this.object());

    return field in meta ?  Maybe.Just(meta[field])
    :      /* otherwise */  Maybe.Nothing();
  },

  /*~
   */
  getInherited(field) {
    return this.get(field).orElse(_ =>
      this.get('belongsTo').cata({
        Just:    (parent) => this.forObject(parent).getInherited(field),
        Nothing: ()       => Maybe.Nothing()
      })
    );
  },

  /*~
   */
  getPropagated(field) {
    const visited = new Set();

    const metaFrom = (meta) => {
      const object = meta.object();

      if (!visited.has(object)) {
        visited.add(object);

        return flatten(values(object).filter(isObject).map(child => {
          if (!visited.has(child)) {
            const childMeta = this.forObject(child);
            return childMeta.get(field).map(x => [x]).getOrElse([])
                            .concat(metaFrom(childMeta));
          } else {
            return [];
          }
        }));
      } else {
        return [];
      }
    };

    const merge     = this.mergingStrategy[field];
    const collected = this.get(field).map(x => [x]).getOrElse([])
                          .concat(metaFrom(this));

    return merge ?     merge(collected)
    :      /* else */  collected;
  },

  /*~
   */
  set(field, value) {
    const object = this.object();
    let meta     = metadata.get(object) || {};

    meta[field] = value;
    metadata.set(object, meta);

    return this;
  },

  /*~
   */
  update(meta) {
    keys(meta).forEach(key => this.set(key, meta[key]));
  }
});
