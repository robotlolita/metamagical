

# set(field, value)


```javascript
(a is Interface).(String, Any) => Interface :: mutates a
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
    Querying and updating metadata
  - **Platforms:**
      - ECMAScript 2015
  - **Maintainers:**
      - Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
  - **Authors:**
      - Quildreen Motta <queen@robotlolita.me>



Updates a single metadata field associated with the current interface's
context.


    const a     = Object.freeze({});
    const aMeta = Interface.for(a);

    aMeta.get('name').getOrElse('Anonymous');  // ==> 'Anonymous'

    aMeta.set('name', 'a');   // ==> aMeta
    aMeta.get('name').get();  // ==> 'a'

This operation associates new metadata with the current interface's context.
Metadata is attached by using the internal `WeakMap`, and as such can be
used for frozen objects as well.

> | **NOTE**
> | Since this relies on a global `WeakMap`, it's subject to the
> | limitations described in the `Interface`.



## Source


```javascript
set(field, value) {
    const object = this.object;
    let meta     = metadata.get(object) || {};

    meta[field] = value;
    metadata.set(object, meta);

    return this;
  }
```




## Properties in `set(field, value)`




### (Uncategorised)




#### [`length`](set/length)



```haskell
Number
```

(No documentation)



#### [`name`](set/name)



```haskell
String
```

(No documentation)



#### [`prototype`](set/prototype)



(No documentation)






