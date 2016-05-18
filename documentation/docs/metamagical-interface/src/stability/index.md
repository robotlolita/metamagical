

# index





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
    Stability index
  - **Platforms:**
    
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



An index of valid stability identifiers.



## Source


```javascript
{
    /*~
     * ---
     * stability : stable
     * category  : Stability entry
     */
    deprecated: Refinable.refine({
      index: 0,
      name:  'Deprecated',
      description: `
This feature is known to be problematic, and will either be entirely
removed from the system, or completely redesigned. You should not rely
on it.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Stability entry
     */
    experimental: Refinable.refine({
      index: 1,
      name:  'Experimental',
      description: `
This feature is experimental and likely to change (or be removed) in the
future.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Stability entry
     */
    stable: Refinable.refine({
      index: 2,
      name:  'Stable',
      description: `
This feature is stable, and its API is unlikely to change (unless deemed
necessary for security or other important reasons). You should expect
backwards compatibility with the system, and a well-defined and automated
(if possible) migration path if it changes.`
    }),

    /*~
     * ---
     * stability : stable
     * category  : Stability entry
     */
    locked: Refinable.refine({
      index: 3,
      name:  'Locked',
      description: `
This API will not change, however security and other bug fixes will still
be applied.`
    })
  }
```




## Properties in `index`




### Stability entry




#### [`deprecated`](deprecated)







#### [`experimental`](experimental)







#### [`locked`](locked)







#### [`stable`](stable)










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







