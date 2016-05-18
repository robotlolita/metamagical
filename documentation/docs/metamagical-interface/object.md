

# get object()


```javascript
Interface. => Object 'a
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
    State and configuration
  - **Platforms:**
      - ECMAScript 2015
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



The current context of the Meta:Magical interface.

A Meta:Magical interface has a current context, that is the
object to retrieve metadata from, or associate new metadata
with. This method provides such context.

By default the interface starts looking at itself. But this
can be changed by inheriting from the interface:

    const x = {
      [Symbol.for('@@meta:magical')]: {
        name: 'x'
      }
    };
    const meta = Interface.refine({
      object: x
    });

    meta.get('name'); // ==> 'x'

A much more convenient way of changing the context is by using
the `.for(object)` method, however:

    Interface.for(x).get('name'); // ==> 'x'



## Source


```javascript
get object() {
    return this;
  }
```




## Properties in `get object()`




### (Uncategorised)




#### `name`



```haskell
String
```

(No documentation)






## Properties inherited from `(Anonymous)`




### (Uncategorised)




#### `apply()`



(No documentation)



#### `get arguments`



(No documentation)



#### `set arguments`



(No documentation)



#### `bind()`



(No documentation)



#### `call()`



(No documentation)



#### `get caller`



(No documentation)



#### `set caller`



(No documentation)



#### `constructor()`



(No documentation)



#### `toString()`



(No documentation)






## Properties inherited from `(Anonymous)`




### (Uncategorised)




#### `__defineGetter__()`



(No documentation)



#### `__defineSetter__()`



(No documentation)



#### `__lookupGetter__()`



(No documentation)



#### `__lookupSetter__()`



(No documentation)



#### `set __proto__`



(No documentation)



#### `get __proto__`



(No documentation)



#### `constructor()`



(No documentation)



#### `hasOwnProperty()`



(No documentation)



#### `isPrototypeOf()`



(No documentation)



#### `propertyIsEnumerable()`



(No documentation)



#### `toLocaleString()`



(No documentation)



#### `toString()`



(No documentation)



#### `valueOf()`



(No documentation)








