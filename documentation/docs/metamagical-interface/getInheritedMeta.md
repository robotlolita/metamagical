

# getInheritedMeta(name)


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



Retrieves metadata defined in the closest parent for the interface's
context.

In JavaScript objects may contain other objects, but we can't know
what object contains another object (given that many objects might).
In order to support inherited meta-data for classes and objects,
Meta:Magical allows one to annotate this missing link with the
`belongsTo` field:

    const root = {
      child: { }
    };
    root[Symbol.for('@@meta:magical')] = {
      category: 'Objects'
    };
    root.child[Symbol.for('@@meta:magical')] = {
      belongsTo() { return root; }
    };

One may then ask for the meta-data in this containership-chain:

    Interface.for(root.child)
             .getInheritedMeta('category')
             .getOrElse('Uncategorised');
    // ==> 'Objects'

    Interface.for(root)
             .getInheritedMeta('category')
             .getOrElse('Uncategorised');
    // ==> 'Uncategorised'



## Source


```javascript
getInheritedMeta(name) {
    return this.getOwnMeta('belongsTo').chain(parentFn => {
      const parent = parentFn();
      return this.for(parent).getOwnMeta(name).orElse(_ =>
        this.for(parent).getInheritedMeta(name)
      );
    });
  }
```




## Properties in `getInheritedMeta(name)`




### (Uncategorised)




#### [`length`](getInheritedMeta/length)



```haskell
Number
```

(No documentation)



#### [`name`](getInheritedMeta/name)



```haskell
String
```

(No documentation)



#### [`prototype`](getInheritedMeta/prototype)



(No documentation)






