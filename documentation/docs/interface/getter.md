

# getter(name)


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



Returns an interface pointing to a getter with the given name in the
current context.


    const x = { get value() { } };
    const valueGetter = Object.getOwnPropertyDescriptor(x, 'value').get;
    Interface.for(x).getter('value').get().object;
    // ==> valueGetter



## Source


```javascript
getter(name) {
    return getGetterSetter(this.object, name, 'get').map(x => this.for(x));
  }
```




## Properties in `getter(name)`




### (Uncategorised)




#### [`length`](getter/length)



```haskell
Number
```

(No documentation)



#### [`name`](getter/name)



```haskell
String
```

(No documentation)



#### [`prototype`](getter/prototype)



(No documentation)






