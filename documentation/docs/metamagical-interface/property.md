

# property(name)


```javascript
Interface.(String) => Maybe Interface
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
    Navigating the context
  - **Platforms:**
      - ECMAScript 2015
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



Returns an interface pointing to the given property of the current
context.


     Interface.property('get').get().object;
     // ==> Interface.get



## Source


```javascript
property(name) {
    return name in this.object ?  Maybe.Just(this.for(this.object[name]))
    :      /* otherwise */        Maybe.Nothing();
  }
```




## Properties in `property(name)`




### (Uncategorised)




#### [`length`](property/length)



```haskell
Number
```

(No documentation)



#### [`name`](property/name)



```haskell
String
```

(No documentation)



#### [`prototype`](property/prototype)



(No documentation)






