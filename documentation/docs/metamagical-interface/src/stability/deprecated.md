

# deprecated





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
      index: 0,
      name:  'Deprecated',
      description: `
This feature is known to be problematic, and will either be entirely
removed from the system, or completely redesigned. You should not rely
on it.`
    })
```




## Properties in `deprecated`




### (Uncategorised)




#### `description`



```haskell
String
```

(No documentation)



#### `name`



```haskell
String
```

(No documentation)






## Properties inherited from `Refinable`




### Inspecting




#### [`toString()`](../../../refinable/toString)



```haskell
Refinable.() => String
```

A textual representation of this object.





### Refinement




#### [`refine(properties)`](../../../refinable/refine)

  - **Complexity:**
    O(n), `n` is the number of properties.

```haskell
(a is Refinable).(Object Any) => (Object Any) <: a
```

Constructs a new object that's enhanced with the given properties.






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








