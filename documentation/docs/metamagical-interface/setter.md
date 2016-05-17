

# setter(name)


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



Returns an interface pointing to a setter with the given name in the
current context.


    const x = { set value(arg){ } };
    const valueSetter = Object.getOwnPropertyDescriptor(x, 'value').set;
    Interface.for(x).setter('value').get().object;
    // ==> valueSetter



## Source


```javascript
setter(name) {
    return getGetterSetter(this.object, name, 'set').map(x => this.for(x));
  }
```




## Properties in `setter(name)`




### (Uncategorised)




#### [`length`](setter/length)



```haskell
Number
```

(No documentation)



#### [`name`](setter/name)



```haskell
String
```

(No documentation)



#### [`prototype`](setter/prototype)



(No documentation)






