# The REPL Browser

[![Chat on Gitter](https://img.shields.io/gitter/room/origamitower/discussion.svg?style=flat-square)](https://gitter.im/origamitower/discussion) 
[![Build status](https://img.shields.io/travis/origamitower/metamagical/master.svg?style=flat-square)](https://travis-ci.org/origamitower/metamagical) 
[![NPM version](https://img.shields.io/npm/v/metamagical-repl.svg?style=flat-square)](https://npmjs.org/package/metamagical-repl) 
![Licence](https://img.shields.io/npm/l/metamagical-repl.svg?style=flat-square&label=licence) 
![Stability: Experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square)

The Meta:Magical REPL browser allows one to explore annotated objects from
Node's REPL.

![](https://raw.github.com/origamitower/metamagical/master/Images/repl.png)


## Installing

The only supported way to install the transform plugin is through [npm][].

> **NOTE**  
> If you don't have npm yet, you'll need to install [Node.js][]. All newer
> versions (4+) of Node come with npm.

```shell
$ npm install metamagical-repl
```

[npm]: https://www.npmjs.com/
[Node.js]: nodejs.org


## Documentation

To learn about the REPL browser, you can use the REPL browser itself! Before you can do
that you'll need to download and build this project:

```shell
git clone https://github.com/origamitower/metamagical.git
cd metamagical
npm install     # install build tooling
make all        # compiles all sub projects
```

Then launch a Node REPL to browse the project:

```js
node> var Interface = require('./packages/interface')
node> var browser = require('./packages/repl')(Interface)
node> browser.summary()
```

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
