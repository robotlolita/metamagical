# Meta:Magical Mocha Bridge

[![Chat on Gitter](https://img.shields.io/gitter/room/origamitower/discussion.svg?style=flat-square)](https://gitter.im/origamitower/discussion) 
[![Build status](https://img.shields.io/travis/origamitower/metamagical/master.svg?style=flat-square)](https://travis-ci.org/origamitower/metamagical) 
[![NPM version](https://img.shields.io/npm/v/metamagical-mocha-bridge.svg?style=flat-square)](https://npmjs.org/package/metamagical-mocha-bridge)
![Licence](https://img.shields.io/npm/l/metamagical-mocha-bridge.svg?style=flat-square&label=licence)
![Stability: Stable](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)

This package allows defining Mocha test cases from Meta:Magical examples.


## Example

Annotate some object with Meta:Magical using the `examples` meta-data:

```js
function double(n) {
  return n + n;
}

double[Symbol.for('@@meta:magical')] = {
  name: 'double',
  examples: [_ => {
    var assert = require('assert');
    assert(double(10) === 20);
    assert(double(15) === 30);
  }]
}
```

Then use this module inside a Mocha test:

```js
const metamagical = require('metamagical-interface');
const defineTests = require('metamagical-mocha-bridge')(metamagical, describe, it);

defineTests(double);
```

> **NOTE**  
> metamagical-mocha-bridge only runs tests for **named** objects.

If you use the [Babel assertion comments plugin](../babel-plugin-assertion-comments), you can write this instead:

```js
function double(n) {
  return n + n;
}

double[Symbol.for('@@meta:magical')] = {
  name: 'double',
  examples: [_ => {
    double(10); // ==> 20
    double(15); // ==> 30
  }]
}
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

You can join the [Gitter Channel](https://gitter.im/origamitower/discussion) for quick support.
You can contact the author over [email](mailto:queen@robotlolita.me), or
[Twitter](https://twitter.com/robotlolita).

Note that all interactions in this project are subject to Origami Tower's
[Code of Conduct](https://github.com/origamitower/metamagical/blob/master/CODE_OF_CONDUCT.md).


## Licence

Meta:Magical is copyright (c) Quildreen Motta 2016, and released under the MIT licence. See the `LICENCE` file in this repository for detailed information.
