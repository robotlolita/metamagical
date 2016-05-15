'use strict';

var fs = require('fs');
var path = require('path');
var metamagical = require('metamagical-interface');
var generate = require('metamagical-mkdocs')(metamagical).generate;

var root = path.join(__dirname, '../documentation/docs');

function flatten(xss) {
  return xss.reduce((l, r) => l.concat(r), []);
}

function entriesOf(object) {
  return flatten(Object.getOwnPropertyNames(object).map(name => {
    var p = Object.getOwnPropertyDescriptor(object, name);

    var result = [];

    if (p.get) {
      result.push({ name, value: p.get, kind: 'getter' });
    }
    if (p.set) {
      result.push({ name, value: p.set, kind: 'setter' });
    }
    if (p.value) {
      result.push({ name, value: p.value, kind: 'value' });
    }

    return result;
  }));
}

function exists(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch (e) {
    return false;
  }
}

function mkdir(path) {
  if (!exists(path)) {
    console.log('Creating directory', path);
    fs.mkdirSync(path);
  }
}

function mkdirp(pathString) {
  if (!exists(pathString)) {
    var parent = path.join(pathString, '..');
    if (!exists(parent)) {
      mkdirp(parent);
    }
    mkdir(pathString);
  }
}

function write(pathString, data) {
  mkdirp(path.dirname(pathString));
  fs.writeFileSync(pathString, data, 'utf8');
}

function p(pathString) {
  return path.resolve(root, pathString);
}

function generateTree(objects, path) {
  path = path || [];
  Object.keys(objects).forEach(key => {
    console.log(': Generating ' + p(path.concat(key + '.md').join('/')) + '...')
    var value = objects[key];
    var data = generate(value.object, {
      linkPrefix: key + '/',
      skipUndocumented: true,
      excludePrototypes: new Set([Array.prototype, Object.prototype, Function.prototype])
    });
    write(p(path.concat(key + '.md').join('/')), data);
    generateTree(value.children || {}, path.concat(key));
  });
}

function isDocumented(object) {
  return metamagical.forObject(object || {})
                    .get('documentation')
                    .map(_ => true).getOrElse(false);
}

function isObject(value) {
  return Object(value) === value;
}

function computeTree(label, root, options) {
  var result  = {};
  var visited = new Set();

  function go(where, name, object, path) {
    if (!isObject(object)) {
      return;
    }
    if (visited.has(object)) {
      return;
    }

    visited.add(object);
    var data = where[name] = { object, children: {} };
    entriesOf(object).forEach(p => {
      go(data.children, p.name, p.value, [path].concat([p.name]));
    });
  }

  go(result, label, root, []);
  return result;
}

generateTree(computeTree('interface', require('../packages/interface'), {}));
