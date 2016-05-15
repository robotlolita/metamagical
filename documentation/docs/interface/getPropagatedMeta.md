

# getPropagatedMeta(name)


```javascript
Interface.(String) => Array Any
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
  - **Complexity:**
    O(n), `n` is the number of obects inside the current context


Retrieves metadata defined in the children of the interface's context.

This gives you an array of the values for the given metadata field defined
in the children (direct or indirect) of the current interface's context:

    const root = {
      childA: { },
      childB: { }
    };
    childA[Symbol.for('@@meta:magical')] = {
      stability: 'experimental'
    };
    childA[Symbol.for('@@meta:magical')] = {
      stability: 'stable'
    };

    Interface.for(root).getPropagatedMeta('stability');
    // ==> ['experimental', 'stable']



## Source


```javascript
getPropagatedMeta(name) {
    let visited = new Set();

    const collectFrom = (meta) => {
      const object = meta.object;

      if (visited.has(object)) {
        return [];
      }

      visited.add(object);

      return flatten(entriesOf(object).map(child => {
        if (!isObject(child.value) || visited.has(child.value)) {
          return [];
        } else {
          const childMeta = this.for(child.value);
          return childMeta.getOwnMeta(name)
                          .map(x => [x])
                          .getOrElse([])
                          .concat(collectFrom(childMeta));
        }
      }));
    };

    return collectFrom(this);
  }
```




## Properties in `getPropagatedMeta(name)`




### (Uncategorised)




#### [`length`](getPropagatedMeta/length)



```haskell
Number
```

(No documentation)



#### [`name`](getPropagatedMeta/name)



```haskell
String
```

(No documentation)



#### [`prototype`](getPropagatedMeta/prototype)



(No documentation)






