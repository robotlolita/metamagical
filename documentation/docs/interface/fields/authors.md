

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




#### [`allowInheritance`](authors/allowInheritance)



```haskell
Boolean
```

(No documentation)



#### [`allowPropagation`](authors/allowPropagation)



```haskell
Boolean
```

(No documentation)



#### [`merge()`](authors/merge)



(No documentation)



#### [`name`](authors/name)



```haskell
String
```

(No documentation)






## Properties inherited from `Field`




### (Uncategorised)




#### [`get allowInheritance`](authors/allowInheritance)







#### [`get allowPropagation`](authors/allowPropagation)







#### [`merge(values)`](authors/merge)







#### [`get name`](authors/name)










## Properties inherited from `Refinable`




### Inspecting




#### [`.toString()`](authors/toString)



```haskell
Refinable.() => String
```

A textual representation of this object.





### Refinement




#### [`.refine(properties)`](authors/refine)

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







