

# (Anonymous)






  - **Copyright:**
    
  - **Licence:**
    
  - **Platforms:**
    
  - **Maintainers:**
    
  - **Authors:**
    


(No documentation)



## Properties in `(Anonymous)`




### Additional reflective methods




#### [`properties()`](prototype/constructor)



```haskell
type PropertyKind is 'value' or 'getter' or 'setter'
type Property     is { name: String, value: Any, kind: PropertyKind }

Interface.() => Array { category: String, members: Array Property }
```

Retrieves a categorised list of properties owned by the current
context.






