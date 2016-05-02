# Meta:Magical Mocha Bridge

[![NPM version](https://img.shields.io/npm/v/metamagical-example-testing.svg?style=flat-square)](https://npmjs.org/package/metamagical-example-testing)
![Licence](https://img.shields.io/npm/l/metamagical-example-testing.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)

This package allows defining Mocha test cases from Meta:Magical examples.


## Example

Annotate some object with Meta:Magical using the `examples` meta-data:

```js
function double(n) {
  return n + n;
}

double[Symbol.for('@@meta:magical')] = {
  examples: [_ => {
    double(10)  // ==> 20
    double(15)  // ==> 30
  }]
}
```

Then use this module inside a Mocha test:

```js
const metamagical = require('metamagical-interface');
const defineTests = require('metamagical-mocha-bridge')(metamagical, describe, it);

defineTests(double);
```


## Installing

The only supported way to install the transform plugin is through [npm][].

> **NOTE**  
> If you don't have npm yet, you'll need to install [Node.js][]. All newer
> versions (4+) of Node come with npm.

```shell
$ npm install metamagical-mocha-bridge
```

[npm]: https://www.npmjs.com/
[Node.js]: nodejs.org



## Support

If you think you've found a bug in the project, or want to voice your
frustration about using it (maybe the documentation isn't clear enough? Maybe
it takes too much effort to use?), feel free to open a new issue in the
[Github issue tracker](https://github.com/origamitower/metamagical/issues).

Pull Requests are welcome. By submitting a Pull Request you agree with releasing
your code under the MIT licence.

You can join the [Gitter Channel](https://gitter.im/origamitower/discussion) for
quick support. You may also contact the author directly through
[email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/metamagical/blob/master/CODE_OF_CONDUCT.md).


## Licence

Meta:Magical is copyright (c) Quildreen Motta 2016, and released under the MIT licence. See the `LICENCE` file in this repository for detailed information.
