

# prototype()


```javascript
Interface.() => Maybe Interface
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



Returns an interface pointing to the prototype of the current context's
`[[Prototype]]`.


    const x = {};
    const y = Object.create(x);
    Interface.for(y).prototype().get().object;
    // ==> x



## Source


```javascript
prototype() {
    const parent = prototypeOf(this.object);
    return parent != null ?  Maybe.Just(this.for(parent))
    :      /* otherwise */   Maybe.Nothing();
  }
```




## Properties in `prototype()`




### (Uncategorised)




#### [`name`](prototype/name)



```haskell
String
```

(No documentation)



#### [`prototype`](prototype/prototype)



(No documentation)






