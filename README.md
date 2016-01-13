Meta:Magical
===============

> **WARNING**  
> This project is still in **early stages of development**. It's not ready
> to be used yet.

Meta:Magical allows you to annotate objects in JavaScript, and inspect them in
an interactive environment (REPL).


## Example

You can use the Meta:Magical browser to inspect objects:

```shell
$ node
> var meta = require("metamagical");
> meta.browse(Object.prototype)
Object.prototype
================

Category: Built-in

Object is the root of JavaScript’s hierarchy of objects.


Properties in Object.prototype
------------------------------

Comparing and testing:
  * this.hasOwnProperty(key)
     | Tests if the object has a property `key`.
  * this.isPrototypeOf(object)
     | Tests if the object is in the prototype chain of `object`.

( ... )
```

You can attach meta-data to your own objects by using the
`metamagical/decorators` module:

```js
let { documentation, category } = require('metamagical/decorators');

@documentation(`
A structure for values that may not be present, or computations
that might fail.
`)
class Maybe {
  @category("Transforming")
  @documentation("Transforms the value inside a maybe")
  map(f) {
    ...
  }
}
```

Or by providing a property with the global `@@meta:magical` symbol:

```js
function add(a, b) {
  return a + b;
}
add[Symbol.for('@@meta:magical')] = {
  'complexity': 'O(1)',
  'category': 'Maths',
  'documentation': 'Sums two numbers.'
};
```

For objects that you don't control, you can attach meta-data by using the
`metamagical/interface` module:

```shell
$ node
> var { set } = require('metamagical/interface');
> set(Object, 'name', 'Object');
```


## Installing

The only supported installation form for `metamagical` right now is through
[npm](http://npmjs.com/). If you don't have npm yet, you'll need to install
[Node.js](https://nodejs.org/en/):

```shell
$ npm install --save metamagical
```


## Documentation

To learn about the bits and pieces of Meta:Magical, you can just load the module
itself in the Node REPL:

```shell
$ node
> var meta = require('metamagical');
> meta.browse(meta);
```

A conceptual documentation is being written, which will explain the idea behind
the project. The following sections of this README are a short introduction to
those concepts.

The `CHANGELOG.md` file documents all of the important changes in the
project. It includes information about when or why to upgrade, and how to
upgrade in cases of breaking changes.


## Why?

How does one learn how to use a library or framework? Usually they would have to
open up a separate tab and load an HTML page with the documentation, then search
for the thing they want to get more information in. Different applications
provide different features for "finding what you want,"
[Hoogle](https://www.haskell.org/hoogle/) has a powerful search by approximate
type signature feature, most HTML documentation allows you to search by the name
of the entity you're looking at, and then some provide you no search feature at
all.

This is annoying, but more importantly, it makes it hard to find exactly what
you're looking for. The experience of learning something becomes far more
taxing than what it could be.

In my PL, [Siren](https://github.com/siren-lang/siren), one of the core values
is that the entire "world" of the language is reflective and inspectable
directly from the interactive shell:

![Siren's Browser in action](https://raw.githubusercontent.com/origamitower/metamagical/master/siren.png)

> **NOTE**  
> This isn't really anything novel. Emacs and Smalltalk have been doing this for
> ages, but most programming environments still require you to go out of your way
> to understand how things work.

JavaScript isn't a language built with meta-data at its core, but it's still
possible to attach meta-data to objects after-the-fact, and inspect these
objects and meta-data. If you support this with some kind of library, then it's
possible to get much of the same features Siren's browser has, and their
benefits. Meta:Magical is that kind of project.


## Approach

Meta:Magical stores data about objects in a global WeakMap, it also supports
objects defining meta-data themselves with a `Symbol.for('@@meta:magical')`
symbol.

> **NOTE**  
> 
> The global WeakMap relies on there existing only one instance of the
> `metamagical` module in your entire program. This relies on both the `require`
> cache not being cleared, and the resolution algorithm always resolving the
> identifier `metamagical` to the very same file. **It IS brittle**, but so far
> I don't have any other idea of how to solve this problem in JavaScript.


## Supported Platforms

Meta:Magical requires `WeakMaps` and `Symbols` to work, and they can't be
polyfilled. You'll need a platform that supports said ES2015 features, like
Node's 4+ version.


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

