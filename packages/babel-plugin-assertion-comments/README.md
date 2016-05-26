# Meta:Magical Babel Assertion Comments Plugin

[![Chat on Gitter](https://img.shields.io/gitter/room/origamitower/discussion.svg?style=flat-square)](https://gitter.im/origamitower/discussion) 
[![Build status](https://img.shields.io/travis/origamitower/metamagical/master.svg?style=flat-square)](https://travis-ci.org/origamitower/metamagical) 
[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-assertion-comments.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-transform-assertion-comments) 
![Licence](https://img.shields.io/npm/l/babel-plugin-transform-assertion-comments.svg?style=flat-square&label=licence) 
![Stability: Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)


This plugin allows having assertions in your comments.


## Example

```js
1 + 2;              // ==> 3
[1].concat([2])     // ==> [1, ..._]
{ x: 1, y: 2 }      // ==> { x: 1, y: 2 }
```


## Supported assertions

Assertions are defined in the form:

```js
Actual Value                  Expected Value

<ExpressionStatement>; // ==> <Expression | Array | Record>
```

Arrays are expressed using the Array literal. And may include
`..._` at the end to indicate that the array may contain any
other elements after that point. Arrays are otherwise compared
structurally, so if the same elements, in the same position,
happen in both sides, they're considered equal:

```js
OK:
[1, 2, 3];     // ==> [1, 2, 3]
[1, 2];        // ==> [1, 2, ..._]
[1, 2, 3, 4];  // ==> [1, 2, ..._]

NOT OK:
[1, 2, 3];  // ==> [3, 2, 1] 
[1, 2, 3];  // ==> [1, 3, 2]
[1];        // ==> [1, 2, ..._]
```

Records are expressed using the Object literal. Records are
compared structurally, and the two values are considered
equal if they have the same keys, with the same values.

If a record includes the `..._` spread element, then
the two objects are equal if the actual value has the
same keys (own or inherited) and values as the expected value:

```js
OK:
{ __proto__: { a: 1 }, b: 2 }  // ==> { a: 1, b: 2, ..._ }
{ __proto__: { a: 1 }, b: 2 }  // ==> { a: 1, ..._ }
{ __proto__: { a: 1 }, b: 2 }  // ==> { b: 2, ..._ }


NOT OK:
{ __proto__: { a: 1 }, b: 2 }  // ==> { a: 1, b: 1, ..._ }
{ __proto__: { a: 1 }, b: 2 }  // ==> { a: 1, c: 2, ..._ }
```

Otherwise the two values are equal if they have the same
own enumerable keys, with the same values.

If the two values provide an `.equals` method, then the assertion
plugin will just use that method to compare them.

Otherwise the values are compared with `===`.


## Installing

The only supported way to install the transform plugin is through [npm][].

> **NOTE**  
> If you don't have npm yet, you'll need to install [Node.js][]. All newer
> versions (4+) of Node come with npm.

```shell
$ npm install babel-plugin-transform-assertion-comments
```


## Usage

This package is a transform plugin for the [Babel][] compiler. You'll need to
install Babel separately.

The recommended way of using the transform plugin is by putting it in your
`.babelrc` file. This file, which contains configuration values for Babel
encoded as JSON, should be in the root of your project.

To tell Babel to use the Meta:Magical plugin, add the following to the `plugins`
section of your `.babelrc` (the `( ... )` marks stand for existing configuration
in your file):

```js
{
  ( ... ),
  "plugins": [
    ( ... ),
    "transform-assertion-comments"
  ]
}
```

You may provide the `module` option to define a different assertion module from
Node's built-in `assert`, as long as it has the same interface:

```js
{
  "plugins": [["transform-assertion-comments", { "module": "my-assert" }]]
}
```

#### (alternative) via CLI

You can tell Babel to use the transform plugin directly as a command line option:

```shell
$ babel --plugins transform-assertion-comments your-script.js
```


#### (alternative) via Node API

If you're using Babel programmatically, you'll want to tell Babel to use the
transform plugin by providing it as an option to the `transform` method:

```js
require('babel-core').transform(SOURCE_CODE, {
  plugins: ['transform-assertion-comments']
})
```


## Supported platforms

The transform plugin requires Node 4+ and Babel 6+.



## Support

If you think you've found a bug in the project, or want to voice your
frustration about using it (maybe the documentation isn't clear enough? Maybe
it takes too much effort to use?), feel free to open a new issue in the
[Github issue tracker](https://github.com/origamitower/metamagical/issues).

Pull Requests are welcome. By submitting a Pull Request you agree with releasing
your code under the MIT licence.

You can join the [Gitter Channel](https://gitter.im/origamitower/discussion) for quick support.
You can contact the author over [email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/metamagical/blob/master/CODE_OF_CONDUCT.md).


## Licence

Meta:Magical is copyright (c) Quildreen Motta, 2016, and released under the MIT
licence. See the `LICENCE` file in this repository for detailed information.
