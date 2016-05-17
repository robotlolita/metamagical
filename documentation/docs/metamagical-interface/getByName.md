

# getByName(name)


```javascript
Interface.(String) => Maybe Any
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


Retrieves metadata with the given name from the interface's current context.



## Source


```javascript
getByName(name) {
    return this.get(this.fields.Field.refine({ name }));
  }
```




## Properties in `getByName(name)`




### (Uncategorised)




#### [`length`](getByName/length)



```haskell
Number
```

(No documentation)



#### [`name`](getByName/name)



```haskell
String
```

(No documentation)



#### [`prototype`](getByName/prototype)



(No documentation)






