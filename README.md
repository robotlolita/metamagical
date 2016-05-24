Meta:Magical
===============

[![Chat on Gitter](https://img.shields.io/gitter/room/origamitower/discussion.svg?style=flat-square)](https://gitter.im/origamitower/discussion)![Licence: MIT](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat-square)![Stability: Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)


> **WARNING**  
> This project is still in **early stages of development**.

Meta:Magical is a project to improve documentation tooling in JavaScript. At
its core, Meta:Magical allows one to annotate runtime objects with arbitrary
data, and query this data later.

This allows for some very interesting features. For example:

  - A REPL may use this data to provide auto-completion features, documentation,
    or even show related functionality.
    
  - A tool may use example code attached to an object and run them as test cases
    automatically.
    
  - A compiler may output annotated objects, and enable people to inspect these
    annotations in ways that aren't possible with static documentation generators
    due to the dynamic nature of JavaScript.

The current focus of development is to provide a robust framework for annotating
live objects, and an interactive tool for exploring objects enriched with these
annotations.


## Repository Layout

This repository is organised as an aggregation of different projects that are
related to Meta:Magical. The stable and active packages live in the `packages/`
directory, and experiments live in the `experimental/` directory.

#### Packages

  - [**Interface**](packages/interface) —
    The Meta:Magical interface provides the basis for annotating live objects,
    and querying this meta-data.
    
  - [**REPL Browser**](packages/repl) —
    The REPL Browser allows exploring annotated objects from a regular Node
    REPL.
    
  - [**Mocha Bridge**](packages/mocha-bridge) —
    The Mocha bridge allows automatically defining tests in the Mocha framework
    by recursively finding all examples attached to objects given a root object.
    
  - [**Babel Plugin: Meta:Magical comments**](packages/babel-plugin-metamagical-comments) —
    The Meta:Magical comments plugin allows annotating objects by using documentation
    comments, in a very similar way to things like JavaDoc, JSDoc, etc. The plugin can
    infer static information and automatically extract examples from documentation, which
    can then be automatically tested.
    
  - [**Babel Plugin: Assertion comments**](packages/babel-plugin-assertion-comments) —
    The assertion comments plugin isn't a Meta:Magical feature, but was created to allow
    examples to be defined in a more readable way. This plugin allows compiling trailing
    comments in the form of `2 + 2 // ==> 4` to an actual runtime assertion, and is a
    good fit for examples in documentation.
    
    
## How do I use this?

> **NOTE**  
> This section is a draft and needs to be improved on a lot, but it should give
> you some pointers to get started.


### I am creating a library, and want to document my objects

If you're creating a library, the simplest way to use Meta:Magical to document
your code is by using the
[Meta:Magical Comments Babel plugin](packages/babel-plugin-metamagical-comments).
This plugin allows annotating objects by just placing documentation comments
before them, as you would do with something like JSDoc:

```js
/*~
 * This is a documentation comment.
 *
 * It may contain multiple lines, and is formatted as **Markdown**!
 *
 * ---
 * category : Things that do things
 * type: (String, Number, Boolean) => Undefined
 */
function doSomething(a, b, c) {
  It.really.does.something();
}
```

The babel plugin will provide common metadata, such as the function's signature,
the module where it's defined, the position in the source, the source itself,
which object it belongs to, etc. by analysing the code for you, so you only
need to provide things like category, stability, and type.


### I am using a library annotated with Meta:Magical

If you're using a library annotated with Meta:Magical, you can explore the
objects by loading the [REPL Browser](packages/repl) package. You need to
install both the `metamagical-interface` and the `metamagical-repl` packages:

```shell
npm install metamagical-interface metamagical-repl
```

Once you do that, you can browse an object by feeding any object into the
browser. For example, running the following in the Node REPL:

```js
var Interface = require('metamagical-interface');
var browser   = require('metamagical-repl')(Interface);

browser.browse(Interface).summary();
```

Would give you the following output:

```md
# Interface
===========


Stability: 1 - Experimental
Platforms: 
    • ECMAScript 2015

The Meta:Magical interface allows one to query meta-data associated
with a particular object, or attach new meta-data to any object
without modifying the object.

## Properties
-------------

### Additional reflective methods

    • allProperties()
      | Retrieves a categorised list of properties in the current
   context.
   
    • properties()
      | Retrieves a categorised list of properties owned by the current
   context.
   

### Auxiliary methods for querying metadata

    • getInheritedMeta(name)
      | Retrieves metadata defined in the closest parent for the interface's
   context.
   
    • getOwnMeta(name)
      | Retrieves metadata defined directly on the current interface's context.
   
    • getPropagatedMeta(name)
      | Retrieves metadata defined in the children of the interface's context.
   
( ... )

------------------------------------------------------------------------

From: src/index.js at line 507, column 0
In package: metamagical-interface
In module: metamagical-interface

Copyright: (c) 2016 Quildreen Motta
Licence: MIT
Repository: git://github.com/origamitower/metamagical.git
Web Site: https://github.com/origamitower/metamagical#readme

Authors: 
    • Quildreen Motta <queen@robotlolita.me>
Maintainers: 
    • Quildreen Motta <queen@robotlolita.me> (http://robotlolita.me/)
```

You may navigate in the browser by using the `.forProperty(name)`,
`.forPrototype()`, `.forGetter(name)`, and `.forSetter(name)` methods. Each of
these methods gives you a new browser for the relevant object. Better yet, you
can look at the browser itself to know what you can do with it, just
`browser.summary()`!


### I'd like to document someone *else*'s objects

Attaching meta-data to other people's objects can be done safely with the
Meta:Magical interface, which keeps an internal WeakMap associating 
objects with metadata. This also accounts for the cases where the object
has been frozen, and thus can't be modified.

If you're not writing a library to provide these annotations, you can
load the `metamagical-interface` directly:

```js
const Interface = require('metamagical-interface');

Interface.for(Object.prototype).update({
  name: 'Object.prototype'
});
```


### I'd like to write a tool using Meta:Magical annotations

If you're writing a library, you should take the `metamagical-interface`
instance provided to your library by an external user, and just specify
which version of the interface you depend on in your package's `peerDependencies`.
Effectively, this means that you're exposing a parametric module:

```js
// your-module.js
module.exports = function(Interface) {
  Interface.for(Object.prototype).update({
    name: 'Object.prototype'
  });
};
```

```js
// package.json
{
  (...)
  "peerDependencies": {
    "metamagical-interface": "3.x"
  }
}
```

The user of this library then provides the proper `metamagical-interface` for
you to use:

```js
require('your-module')(require('metamagical-interface'));
```

If you're using ES6 modules, this is a little bit more complicated since
the modules are not first-class, and don't support being parameterised
over other modules. A compromise is to export a function as the default
binding, but you'll be losing static analysis and mutually recursive
bindings by doing this:

```js
// your-module.js
export default function(Interface) {
  Interface.for(...).update(...);
}
```

```
// The client
const Interface = require('metamagical-interface');
import ModuleFactory from 'your-module';
const Module = ModuleFactory(Interface);

// Now you can use Module...
```

> **WHY THIS RESTRICTION?**  
> Since the interface needs to keep a single WeakMap containing all of the
> annotations, there must be only one instance of the Interface in the entire
> environment.
>
> JavaScript makes this hard for a number of reasons: modules are first class,
> and can be instantiated multiple times; npm may install multiple versions of
> a package; clients may install multiple versions of a package; code might
> interact with different realms; etc.
>
> Parameterisation makes what's happening explicit, and leads to less
> surprising behaviours.


## Support

If you think you've found a bug in the project, or want to voice your
frustration about using it (maybe the documentation isn't clear enough? Maybe
it takes too much effort to use?), feel free to open a new issue in the
[Github issue tracker](https://github.com/origamitower/metamagical/issues).

Pull Requests are welcome. By submitting a Pull Request you agree with releasing
your code under the MIT licence.

You can contact the author over [email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/conventions/blob/master/code-of-conduct.md).


## Licence

Meta:Magical is copyright (c) Quildreen Motta, 2016, and released under the MIT
licence. See the `LICENCE` file in this repository for detailed information.

