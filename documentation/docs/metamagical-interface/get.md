

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




#### `length`



```haskell
Number
```

(No documentation)



#### `name`



```haskell
String
```

(No documentation)



#### [`prototype`](../(unknown module)/metamagical-interface/get/prototype)



(No documentation)






## Properties inherited from `(Anonymous)`




### (Uncategorised)




#### `apply()`



(No documentation)



#### `get arguments`



(No documentation)



#### `set arguments`



(No documentation)



#### `bind()`



(No documentation)



#### `call()`



(No documentation)



#### `get caller`



(No documentation)



#### `set caller`



(No documentation)



#### `constructor()`



(No documentation)



#### `toString()`



(No documentation)






## Properties inherited from `(Anonymous)`




### (Uncategorised)




#### `__defineGetter__()`



(No documentation)



#### `__defineSetter__()`



(No documentation)



#### `__lookupGetter__()`



(No documentation)



#### `__lookupSetter__()`



(No documentation)



#### `set __proto__`



(No documentation)



#### `get __proto__`



(No documentation)



#### `constructor()`



(No documentation)



#### `hasOwnProperty()`



(No documentation)



#### `isPrototypeOf()`



(No documentation)



#### `propertyIsEnumerable()`



(No documentation)



#### `toLocaleString()`



(No documentation)



#### `toString()`



(No documentation)



#### `valueOf()`



(No documentation)








