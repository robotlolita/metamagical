

# module stability





> 
> **Stability: 2 - Stable**
> 
> This feature is stable, and its API is unlikely to change (unless deemed
> necessary for security or other important reasons). You should expect
> backwards compatibility with the system, and a well-defined and automated
> (if possible) migration path if it changes.
> 


  - **From:**
    metamagical-interface/lib/stability
  - **Copyright:**
    (c) 2016 Quildreen Motta
  - **Licence:**
    MIT
  - **Repository:**
    git://github.com/origamitower/metamagical.git
  - **Category:**
    Metadata
  - **Platforms:**
      - ECMAScript 5
      - ECMAScript 3 (with `es5-shim`)
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



Handles describing and normalising stability identifiers.



## Source


```javascript
Refinable.refine({
  /*~
   * Converts a textual identifier of stability to a structured
   * representation of the stability.
   *
   * ---
   * category  : Constructing stability entries
   * stability : stable
   *
   * type: |
   *   Stability.(String) => StabilityEntry
   */
  fromIdentifier(id) {
    if (this.index.hasOwnProperty(id)) {
      return this.index[id];
    } else {
      throw new Error(`No stability with id "${id}"`);
    }
  },


  /*~
   * An index of valid stability identifiers.
   *
   * ---
   * stability : stable
   * category  : Stability index
   */
  index: {
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
})
```




## Properties in `module stability`




### Constructing stability entries




#### [`fromIdentifier(id)`](Stability/fromIdentifier)



```haskell
Stability.(String) => StabilityEntry
```

Converts a textual identifier of stability to a structured
representation of the stability.





### Stability index




#### [`index`](Stability/index)



An index of valid stability identifiers.






## Properties inherited from `Refinable`




### Inspecting




#### [`.toString()`](Stability/toString)



```haskell
Refinable.() => String
```

A textual representation of this object.





### Refinement




#### [`.refine(properties)`](Stability/refine)

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







