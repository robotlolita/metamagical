

# get(field)


```javascript
Interface.(Field) => Maybe Any
```




> 
> **Stability: 1 - Experimental**
> 
> This feature is experimental and likely to change (or be removed) in the
> future.
> 


  - **From:**
    metamagical-interface
  - **Defined in:**
    Interface
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    git://github.com/origamitower/metamagical.git
  - **Category:**
    Querying metadata
  - **Platforms:**
      - ECMAScript 2015
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>
  - **Complexity:**
    O(n), `n` is the number of objects inside the current context


Retrieves metadata for the given field from the interface's current
context.

This will try retrieving metadata stored directly in the current context,
and fallback to metadata inherited from a parent object (through the
`belongsTo` metadata), or metadata propagated from the values of the
properties in the object, if the provided field allows either.



## Source


```javascript
get(field) {
    return this.getOwnMeta(field.name)
               .orElse(_ =>
                 field.allowInheritance ?  this.getInheritedMeta(field.name)
                 : /* otherwise */         Maybe.Nothing()
               ).orElse(_ =>
                 field.allowPropagation ?  field.merge(this.getPropagatedMeta(field.name))
                 : /* otherwise */         Maybe.Nothing()
               );
  }
```




## Properties in `get(field)`




### (Uncategorised)




#### [`length`](get/length)



```haskell
Number
```

(No documentation)



#### [`name`](get/name)



```haskell
String
```

(No documentation)



#### [`prototype`](get/prototype)



(No documentation)






