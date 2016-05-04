# Meta:Magical Babel Assertion Comments Plugin

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-metamagical-comments.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-transform-metamagical-comments)
![Licence](https://img.shields.io/npm/l/babel-plugin-transform-metamagical-comments.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)

This plugin allows having assertions in your comments.


## Example

```js
1 + 2; // ==> 3
```

Compiles down to:

```js
require('assert')(1 + 2, 3, "1 + 2 ==> 3");
```


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

You can contact the author over [email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/conventions/blob/master/code-of-conduct.md).


## Licence

Meta:Magical is copyright (c) Quildreen Motta, 2016, and released under the MIT
licence. See the `LICENCE` file in this repository for detailed information.
