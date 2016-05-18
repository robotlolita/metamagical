

# locked





> 
> **Stability: 2 - Stable**
> 
> This feature is stable, and its API is unlikely to change (unless deemed
> necessary for security or other important reasons). You should expect
> backwards compatibility with the system, and a well-defined and automated
> (if possible) migration path if it changes.
> 


  - **From:**
    metamagical-interface/src/stability
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    git://github.com/origamitower/metamagical.git
  - **Category:**
    Stability entry
  - **Platforms:**
    
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>





## Source


```javascript
Refinable.refine({
      index: 3,
      name:  'Locked',
      description: `
This API will not change, however security and other bug fixes will still
be applied.`
    })
```




## Properties in `locked`




### (Uncategorised)




#### `description`



```haskell
String
```

(No documentation)



#### `index`



```haskell
Number
```

(No documentation)



#### `name`



```haskell
String
```

(No documentation)






## Properties inherited from `Refinable`




### Inspecting




#### `toString: .toString()`



```haskell
Refinable.() => String
```

A textual representation of this object.





### Refinement




#### `refine: .refine(properties)`

  - **Complexity:**
    O(n), `n` is the number of properties.

```haskell
('a is Refinable).(Object Any) => (Object Any) <: 'a
```

Constructs a new object that's enhanced with the given properties.
The [[refine]] operation allows one to copy the receiver object,
and enhance that copy with the provided properties, in a more
convenient way than JavaScript's built-in [[Object.create]]:
    const o1 = o.refine({ x: 1 });
    const o2 = o1.refine({ x: 2 });
    o1.x  // ==> 1
    o2.x  // ==> 2






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








