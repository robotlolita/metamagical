

# refine(properties)


```javascript
(a is Refinable).(Object Any) => (Object Any) <: a
```




> 
> **Stability: 2 - Stable**
> 
> This feature is stable, and its API is unlikely to change (unless deemed
> necessary for security or other important reasons). You should expect
> backwards compatibility with the system, and a well-defined and automated
> (if possible) migration path if it changes.
> 


  - **From:**
    refinable
  - **Defined in:**
    Refinable
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    https://github.com/origamitower/refinable.git
  - **Category:**
    Refinement
  - **Portability:**
    portable
  - **Platforms:**
      - ECMAScript 5
      - ECMAScript 3 (with `es5-shim`)
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me>
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>
  - **Complexity:**
    O(n), `n` is the number of properties.


Constructs a new object that's enhanced with the given properties.

The [[refine]] operation allows one to copy the receiver object,
and enhance that copy with the provided properties, in a more
convenient way than JavaScript's built-in [[Object.create]]:

    const o  = Refinable.refine({ x: 0, y: 3 });
    const o1 = o.refine({ x: 1 });
    const o2 = o1.refine({ x: 2 });
    [o1.x, o1.y];  // ==> [1, 3]
    [o2.x, o2.y];  // ==> [2, 3]



## Source


```javascript
refine(properties) {
    const instance = clone(this);
    const names    = keys(properties);

    for (let i = 0; i < names.length; ++i) {
      const name = names[i];
      define(instance, name, descriptor(properties, name));
    }

    return instance;
  }
```




## Properties in `refine(properties)`




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



#### `prototype`



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








