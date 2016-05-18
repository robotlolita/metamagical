

# fromIdentifier(id)


```javascript
Stability.(String) => StabilityEntry
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
    metamagical-interface/src/stability
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    git://github.com/origamitower/metamagical.git
  - **Category:**
    Constructing stability entries
  - **Platforms:**
    
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



Converts a textual identifier of stability to a structured
representation of the stability.



## Source


```javascript
fromIdentifier(id) {
    if (this.index.hasOwnProperty(id)) {
      return this.index[id];
    } else {
      throw new Error(`No stability with id "${id}"`);
    }
  }
```




## Properties in `fromIdentifier(id)`




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



#### [`prototype`](../../../(unknown module)/metamagical-interface/Stability/fromIdentifier/prototype)



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








