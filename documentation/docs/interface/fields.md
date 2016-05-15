

# exports






  - **From:**
    metamagical-interface/src/fields
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    git://github.com/origamitower/metamagical.git
  - **Platforms:**
    
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



 


## Source


```javascript
{
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
      return Maybe.Just(unique(flatten(values)));
    }
  }),

  maintainers: Field.refine({
    name: 'maintainers',
    allowInheritance: true,
    allowPropagation: true,
    merge(values) {
      return Maybe.Just(unique(flatten(values)));
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
        return Maybe.Just(values.reduce((l, r) => {
          const left  = Stability.fromIdentifier(l).index;
          const right = Stability.fromIdentifier(r).index;

          return left < right ?  l
          :      /* else */      r;
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
      return Maybe.Just(unique(flatten(values)));
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

}
```




## Properties in `exports`




### (Uncategorised)




#### [`Field`](fields/Field)







#### [`authors`](fields/authors)







#### [`belongsTo`](fields/belongsTo)







#### [`category`](fields/category)







#### [`complexity`](fields/complexity)







#### [`copyright`](fields/copyright)







#### [`deprecated`](fields/deprecated)







#### [`documentation`](fields/documentation)







#### [`examples`](fields/examples)







#### [`homepage`](fields/homepage)







#### [`licence`](fields/licence)







#### [`location`](fields/location)







#### [`maintainers`](fields/maintainers)







#### [`module`](fields/module)







#### [`name`](fields/name)







#### [`npmPackage`](fields/npmPackage)







#### [`parameters`](fields/parameters)







#### [`platforms`](fields/platforms)







#### [`portable`](fields/portable)







#### [`repository`](fields/repository)







#### [`returns`](fields/returns)







#### [`signature`](fields/signature)







#### [`since`](fields/since)







#### [`source`](fields/source)







#### [`stability`](fields/stability)







#### [`tags`](fields/tags)







#### [`throws`](fields/throws)







#### [`type`](fields/type)










