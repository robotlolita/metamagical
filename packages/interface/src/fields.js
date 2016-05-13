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


// --[ Base for Fields ]-----------------------------------------------

/*~
 */
const Field = Refinable.refine({
  /*~
   */
  get name() {
    required('Field', 'name');
  },

  /*~
   */
  get allowInheritance() {
    return false;
  },

  /*~
   */
  get allowPropagation() {
    return false;
  },

  /*~
   */
  merge(values) {
    return Maybe.Just(values);
  }
});


// --[ Built-in Fields ]-----------------------------------------------

/*~
 */
module.exports = {
  Field: Field,

  // ---[ Social Metadata ]--------------------------------------------
  copyright: Field.refine({
    name: 'copyright',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(values));
    }
  }),

  authors: Field.refine({
    name: 'authors',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(values));
    }
  }),

  maintainers: Field.refine({
    name: 'maintainers',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(values));
    }
  }),

  licence: Field.refine({
    name: 'licence',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(values));
    }
  }),

  since: Field.refine({
    name: 'since',
    allowInheritance: true
  }),

  deprecated: Field.refine({
    name: 'deprecated',
    allowInheritance: true
  }),

  repository: Field.refine({
    name: 'repository',
    allowInheritance: true
  }),

  stability: Field.refine({
    name: 'stability',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      if (values.length === 0) {
        return Maybe.Nothing();
      } else {
        return Maybe.Just(xs.reduce((l, r) => {
          const left  = Stability.fromIdentifier(l).index;
          const right = Stability.fromIdentifier(r).index;

          return left < right ?  left
          :      /* else */      right;
        }));
      }
    }
  }),

  homepage: Field.refine({
    name: 'homepage',
    allowInheritance: true
  }),


  // ---[ Organisational Metadata ]------------------------------------
  category: Field.refine({
    name: 'category'
  }),

  tags: Field.refine({
    name: 'tags'
  }),


  // ---[ Definition Metadata ]----------------------------------------
  npmPackage: Field.refine({
    name: 'npmPackage',
    allowInheritance: true
  }),

  module: Field.refine({
    name: 'module',
    allowInheritance: true
  }),

  belongsTo: Field.refine({
    name: 'belongsTo'
  }),

  name: Field.refine({
    name: 'name'
  }),

  location: Field.refine({
    name: 'location'
  }),

  source: Field.refine({
    name: 'source'
  }),


  // ---[ Usage Metadata ]---------------------------------------------
  documentation: Field.refine({
    name: 'documentation'
  }),

  examples: Field.refine({
    name: 'examples'
  }),

  signature: Field.refine({
    name: 'signature'
  }),

  type: Field.refine({
    name: 'type'
  }),

  throws: Field.refine({
    name: 'throws'
  }),

  parameters: Field.refine({
    name: 'parameters'
  }),

  returns: Field.refine({
    name: 'returns'
  }),

  complexity: Field.refine({
    name: 'complexity'
  }),


  // ---[ Execution Metadata ]-----------------------------------------
  platforms: Field.refine({
    name: 'platforms',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(values));
    }
  }),

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

