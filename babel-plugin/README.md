# Meta:Magical Babel Plugin

[![NPM version](https://img.shields.io/npm/v/babel-plugin-transform-metamagical-comments.svg?style=flat-square)](https://npmjs.org/package/babel-plugin-transform-metamagical-comments)
![Licence](https://img.shields.io/npm/l/babel-plugin-transform-metamagical-comments.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)

This plugin allows describing Meta:Magical meta-data using doc comments, by
having Babel compile the doc comments to runtime annotations.


## Example

```js
/*~
 * Composes two functions.
 *
 * The compose operation allows function composition. For example, if
 * you have two functions, `inc` and `double`, you can compose them
 * such that you get a new function which has the characteristics of
 * both.
 *
 *     const inc    = (x) => x + 1
 *     const double = (x) => x * 2
 *     const incDouble = compose(double, inc)
 *
 *     incDouble(3)
 *     // => double(inc(3))
 *     // => 8
 *
 * > **NOTE**  
 * > Composition is done from right to left, rather than left to right.
 *
 * ---
 * signature: compose(f, g)(value)
 * type: (β -> γ, α -> β) -> α -> γ
 * category: Combinators
 * tags: ["Lambda Calculus"]
 * stability: stable
 * platforms: ["ECMAScript"]
 * licence: MIT
 */
const compose = (f, g) => (value) => f(g(value))
```

Compiles down to:

```
var compose = function compose(f, g) {
  return function (value) {
    return f(g(value));
  };
};
compose[Symbol.for("@@meta:magical")] = {
  "signature": "compose(f, g)(value)",
  "type": "(β -> γ, α -> β) -> α -> γ",
  "category": "Combinators",
  "tags": ["Lambda Calculus"],
  "stability": "stable",
  "platforms": ["ECMAScript"],
  "licence": "MIT",
  "documentation": "Composes two functions.\nThe compose operation allows function composition. For example, if\nyou have two functions, `inc` and `double`, you can compose them\nsuch that you get a new function which has the characteristics of\nboth.\n    const inc    = (x) => x + 1\n    const double = (x) => x * 2\n    const incDouble = compose(double, inc)\n    incDouble(3)\n    // => double(inc(3))\n    // => 8\n> **NOTE**  \n> Composition is done from right to left, rather than left to right."
};
```


## Installing

The only supported way to install the transform plugin is through [npm][].

> **NOTE**  
> If you don't have npm yet, you'll need to install [Node.js][]. All newer
> versions (4+) of Node come with npm.

```shell
$ npm install babel-plugin-transform-metamagical-comments
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
    "transform-metamagical-comments"
  ]
}
```

#### (alternative) via CLI

You can tell Babel to use the transform plugin directly as a command line option:

```shell
$ babel --plugins transform-metamagical-comments your-script.js
```


#### (alternative) via Node API

If you're using Babel programmatically, you'll want to tell Babel to use the
transform plugin by providing it as an option to the `transform` method:

```js
require('babel-core').transform(SOURCE_CODE, {
  plugins: ['transform-metamagical-comments']
})
```


## Comment format

This plugin only considers **leading block comments** which are marked as
Meta:Magical documentation with a leading `~` symbol. As a general rule, the
first line of the block comment should contain only the character `~` (with
optional trailing whitespace), and the other lines should contain a leading `*`
character, which the plugin will use as an starting-indentation mark.

> **EXAMPLES**
> 
> The following is considered a Meta:Magical doc comment:
> 
> ```js
> /*~
>  * This is a documentation
>  */
> function f(...) { ... }
> ```
> 
> The following are **not** considered a Meta:Magical doc comment:
> 
> ```js
> /* ~
>  * Spaces are not allowed
>  */
> function f(...) { ... }
> 
> /*~ New line is required after ~ */
> function f(...) { ... }
> 
> function f(...) { ... }
> /*~
>  * Trailing block comments are not considered.
>  */
> ```

The doc comment is separated in two parts by a line containing at least 3 dash
characters. The first part of the doc comment is the documentation field for
Meta:Magical, which should be a long description of your functionality formatted
as Markdown. The second part is a [YAML][] document containing any additional
meta-data for Meta:Magical:

```js
/*~
 * This is the documentation.
 *
 * ---
 * this_is: a YAML document
 */
function f(...) { ... }
```

## Supported platforms

The transform plugin requires Node 4+ and Babel 6+.



## Known Limitations

This plugin is not entirely done yet, the following is a list of current limitations:

- Only works for function and variable (const/let/var) declarations;
- No meta-data is inferred from the source code yet;


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
