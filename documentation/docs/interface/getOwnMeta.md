

# getOwnMeta(name)


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
    Auxiliary methods for querying metadata
  - **Platforms:**
      - ECMAScript 2015
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



Retrieves metadata defined directly on the current interface's context.


    const x = {[Symbol.for('@@meta:magical')]: {
      name: 'x'
    }};

    Interface.for(x).getOwnMeta('name').getOrElse('Anonymous');
    // ==> 'x'
    Interface.for({}).getOwnMeta('name').getOrElse('Anonymous');
    // ==> 'Anonymous'



## Source


```javascript
getOwnMeta(name) {
    const meta = getMeta(this.object);

    return name in meta ?   Maybe.Just(meta[name])
    :      /* otherwise */  Maybe.Nothing();
  }
```




## Properties in `getOwnMeta(name)`




### (Uncategorised)




#### [`length`](getOwnMeta/length)



```haskell
Number
```

(No documentation)



#### [`name`](getOwnMeta/name)



```haskell
String
```

(No documentation)



#### [`prototype`](getOwnMeta/prototype)



(No documentation)






