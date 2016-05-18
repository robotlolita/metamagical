

# for(value)


```javascript
(proto is Interface).(Object 'a) => Interface <: proto
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



Changes the current context of the Meta:Magical object.

This method allows changing the current context of the object
in a more convenient way than explicitly inheriting from the
object:

    const x = {
      [Symbol.for('@@meta:magical')]: {
        name: 'x'
      }
    };
    const xMeta = Interface.for(x);
    xMeta.get('name'); // ==> 'x'



## Source


```javascript
for(value) {
    assertObject(value);

    return this.refine({
      object: value
    });
  }
```




## Properties in `for(value)`




### (Uncategorised)




#### `length`



```haskell
Number
```

(No documentation)



#### `name`



```haskell
String
```

(No documentation)



#### [`prototype`](../(unknown module)/metamagical-interface/for/prototype)



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








