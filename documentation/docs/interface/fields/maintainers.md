

# Field






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
Refinable.refine({
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
})
```




## Properties in `Field`




### (Uncategorised)




#### [`allowInheritance`](maintainers/allowInheritance)



```haskell
Boolean
```

(No documentation)



#### [`allowPropagation`](maintainers/allowPropagation)



```haskell
Boolean
```

(No documentation)



#### [`merge()`](maintainers/merge)



(No documentation)



#### [`name`](maintainers/name)



```haskell
String
```

(No documentation)






## Properties inherited from `Field`




### (Uncategorised)




#### [`get allowInheritance`](maintainers/allowInheritance)







#### [`get allowPropagation`](maintainers/allowPropagation)







#### [`merge(values)`](maintainers/merge)







#### [`get name`](maintainers/name)










## Properties inherited from `Refinable`




### Inspecting




#### [`.toString()`](maintainers/toString)



```haskell
Refinable.() => String
```

A textual representation of this object.





### Refinement




#### [`.refine(properties)`](maintainers/refine)

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








