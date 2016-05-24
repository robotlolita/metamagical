//----------------------------------------------------------------------
//
// This source file is part of the Meta:Magical project.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const doc = `
metamagical-markdown — Compiles Markdown to annotated JavaScript modules.

Usage:
  metamagical-markdown [options] <file>
  metamagical-markdown --version
  metamagical-markdown --help

Options:
  --version                 Displays the version number.
  -h, --help                Displays this screen.
  --babel-options=<Path>    A path to a '.babelrc' file (looks in CWD by default)
`;

// -- DEPENDENCIES -----------------------------------------------------
const docopt = require('docopt').docopt;
const pkg    = require('../package.json');
const fs     = require('fs');
const path   = require('path');
const { parse, generate } = require('./');

function show(...args) {
  console.log(...args);
}

function read(file) {
  return fs.readFileSync(file, 'utf-8');
}

function exists(file) {
  try {
    fs.accessSync(file);
    return true;
  } catch (_e) {
    return false;
  }
}

function parentDirectory(dir) {
  const result = path.dirname(dir);
  if (path.resolve(result) === path.resolve(dir)) {
    throw new Error("No Babel configuration found.");
  }

  return result;
}

function findBabelConfigFrom(dir) {
  if (exists(path.join(dir, '.babelrc'))) {
    return JSON.parse(read(path.join(dir, '.babelrc')));
  } else if (exists(path.join(dir, 'package.json'))) {
    const meta = JSON.parse(read(path.join(dir, 'package.json')));
    if (meta.babel) {
      return meta.babel;
    } else {
      return findBabelConfigFrom(parentDirectory(dir));
    }
  } else {
    return findBabelConfigFrom(parentDirectory(dir));
  }
}

function getBabelOptions(file, babelConfig) {
  try {
    if (babelConfig) {
      return JSON.parse(fs.readFileSync(babelConfig, 'utf-8'));
    } else {
      return findBabelConfigFrom(path.dirname(path.resolve(file)));
    }
  } catch (_e) {
    return {};
  }
}

module.exports = function Main() {
  const args = docopt(doc, { help: false });

  ; args['--help']    ?  show(doc)
  : args['--version'] ?  show(`metamagical-markdown version ${pkg.version}`)
  : /* else */           show(generate(parse(
                           read(args['<file>']),
                           getBabelOptions(args['<file>'], args['--babel-options'])
                         )));
};
